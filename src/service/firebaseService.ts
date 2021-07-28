import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { Game, gameToObj } from '../Models/Game';
import { User } from '../Models/User';
import { userToObj } from '../util/utilFns';
import FirebaseConfig from './FirebaseConfig';

class FirebaseService {
	private user: firebase.User;
	private db: firebase.firestore.Firestore;
	private userVal: firebase.firestore.CollectionReference;
	private userRepr: firebase.firestore.CollectionReference;
	private gameRef: firebase.firestore.CollectionReference;
	private app: firebase.app.App = null;
	private auth: firebase.auth.Auth = null;
	private authProvider: firebase.auth.GoogleAuthProvider = null;

	constructor() {
		this.init().then(() => {
			this.auth = firebase.auth();
			this.authProvider = new firebase.auth.GoogleAuthProvider();
			this.db = firebase.firestore();
			this.userVal = this.db.collection('userVal');
			this.userRepr = this.db.collection('userRepr');
			this.gameRef = this.db.collection('games');
			this.auth.onAuthStateChanged(user => {
				this.user = user;
			});
		});
	}

	async init() {
		if (!firebase.apps.length) {
			this.app = firebase.initializeApp(FirebaseConfig);
		} else {
			this.app = firebase.app();
		}
		// this.loginAnon();
	}

	async loginWithGoogle(): Promise<string> {
		return new Promise((resolve, reject) => {
			this.auth
				.signInWithPopup(this.authProvider)
				.then((values: firebase.auth.UserCredential) => {
					resolve(values.user.email);
				})
				.catch(err => {
					console.log(err);
				});
		});
	}

	logout() {
		this.auth.signOut();
	}

	userAuthenticated() {
		return this.user !== null;
	}

	async loginAnon(): Promise<firebase.auth.UserCredential> {
		try {
			return await firebase.auth().signInAnonymously();
		} catch (err) {
			console.log(err);
		}
	}

	/* ------------------------- User related ------------------------- */
	async registerByUserPass(username: string, password: string) {
		let userId = '';
		try {
			await this.userVal.add({}).then(user => {
				userId = user.id;
			});
			const userValNew = this.userVal.doc(userId);
			const userReprNew = this.userRepr.doc(userId);
			await this.db.runTransaction(async t => {
				t.set(userValNew, { username, password });
				t.set(userReprNew, { username, photoUrl: '', groups: [] });
			});
			console.log('User created successfully');
		} catch (err) {
			console.log('firebaseService: User was not created - ', +err);
		}
	}

	async registerByEmail(username: string, email: string) {
		try {
			await this.userRepr.add({ username, email, photoUrl: '', groups: [] });
			console.log('User created successfully');
		} catch (err) {
			console.log('firebaseService: User was not created - ', +err);
		}
	}

	getUserValByUsername(username: string) {
		return this.userVal.where('username', '==', username).get();
	}

	getUserReprByUsername(username: string) {
		return this.userRepr.where('username', '==', username).get();
	}

	getUserReprByEmail(email: string) {
		return this.userRepr.where('email', '==', email).get();
	}

	getUserReprById(id: string) {
		return this.userRepr.doc(id).get();
	}

	searchUser(partUsername: string) {
		return this.userRepr
			.where('username', '>=', partUsername)
			.where('username', '<=', partUsername + '\uf8ff')
			.limit(5)
			.get();
	}

	async createGroup(user: User, groupName: string, users: User[]) {
		const userRef = this.userRepr.doc(user.id);
		await userRef.update({ groups: { [groupName]: users } });
	}

	async searchGroups(user: User, partGroupName: string) {
		return new Promise((resolve, reject) => {
			let groups: Group[] = [];
			this.userRepr
				.doc(user.id)
				.get()
				.then(data => {
					groups = data.data().groups;
					// filter group.name like partGroupName
				})
				.catch(err => {
					console.log(err);
					groups = [];
				});
			resolve(groups);
		});
	}

	/* ------------------------- User-game related ------------------------- */

	async getInvites(user: User) {
		if (user) {
			return await this.gameRef
				.where('playerIds', 'array-contains', user.id)
				.where('ongoing', '==', true)
				// .orderBy('createdAt', 'desc')
				.limit(5)
				.get();
		} else {
			return null;
		}
	}

	listenInvitesSnapshot(user: User, observer: any) {
		if (user) {
			return (
				this.gameRef
					.where('playerIds', 'array-contains', user.id)
					.where('ongoing', '==', true)
					// .orderBy('createdAt', 'desc')
					.limit(5)
					.onSnapshot(observer)
			);
		} else {
			return null;
		}
	}

	/* ------------------------- Game related ------------------------- */
	async getGameById(game?: Game, gameId?: string) {
		if (!game && !gameId) {
			return null;
		} else {
			let game_id = game ? game.id : gameId;
			return this.gameRef.doc(game_id).get();
		}
	}

	async createGame(user: User, players: User[]): Promise<Game> {
		let playerIds: string[] = [];
		let playersString: string = '';
		players.forEach(player => {
			playerIds.push(player.id);
			playersString += player.username + ' ';
		});
		return new Promise((resolve, reject) => {
			let createdAt = new Date();
			try {
				this.gameRef
					.add({
						creator: user.username,
						createdAt,
						stage: 0,
						previousStage: -1,
						ongoing: true,
						midRound: false,
						dealer: 0,
						flagProgress: true,
						whoseMove: 0,
						playerIds,
						playersString,
						players: players.map(function (player: User) {
							return userToObj(player);
						}),
						tiles: [],
						frontTiles: 0,
						backTiles: 0,
						lastThrown: {},
						thrownBy: 0,
						thrownTile: false,
						takenTile: true,
						uncachedAction: false,
						hu: [],
						initRound: [true, false],
						draw: false
					})
					.then(newGame => {
						console.log(`Game created successfully: gameId ${newGame.id}`);
						const game: Game = new Game(
							newGame.id,
							user.username,
							createdAt,
							playersString,
							true,
							0,
							-1,
							null,
							false,
							true,
							0,
							playerIds,
							players,
							[],
							null,
							null,
							null,
							null,
							false,
							true,
							false,
							[],
							false
						);
						resolve(game);
					});
			} catch (err) {
				console.log('firebaseService: Game was not created');
				reject(err);
			}
		});
	}

	updateGame(game: Game): Promise<Game> {
		return new Promise(async (resolve, reject) => {
			try {
				let gameObj = await gameToObj(game);
				const currentGameRef = await this.gameRef.doc(game.id);
				await currentGameRef.set({ ...gameObj }).then(() => {
					resolve(game);
					console.log('firebaseService: game doc was updated');
				});
			} catch (err) {
				console.log(err);
				reject(new Error('firebaseService: game doc was not updated'));
			}
		});
	}

	listenToGame(gameId: string, observer: any) {
		if (gameId) {
			return this.gameRef.doc(gameId).onSnapshot(observer);
		}
	}
}

const FBService = new FirebaseService();
export default FBService;
