import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FaceIcon from '@material-ui/icons/Face';
import { useContext, useState } from 'react';
import { CenteredColored } from '../../global/StyledComponents';
import { User } from '../../Models/User';
import FBService from '../../service/MyFirebaseService';
import { AppContext } from '../../util/hooks/AppContext';
import './searchForms.scss';

const UserSearchForm: React.FC = () => {
	const { user, players, setPlayers, mainTextColor } = useContext(AppContext);
	const [showOptions, setShowOptions] = useState<boolean>(false);
	const [foundUsers, setFoundUsers] = useState<User[]>([]);
	const [searchFor, setSearchFor] = useState('');

	async function searchForUser(username: string) {
		let foundUsers: Array<User> = [];
		await FBService.searchUser(username).then(data => {
			if (!data.empty) {
				data.docs.forEach(doc => {
					let data = doc.data();
					foundUsers.push(new User(doc.id, data.username, data.photoUrl, data.email));
				});
				if (foundUsers.length > 0) {
					setFoundUsers(foundUsers);
					setShowOptions(true);
				}
			}
		});
	}

	function handleFormChange(str: string): void {
		setSearchFor(str);
		if (str.length > 3) {
			searchForUser(str);
		} else {
			setShowOptions(false);
		}
	}

	function notSelected(user: User): boolean {
		for (let i = 0; i < players.length; i++) {
			if (user.username === players[i].username) {
				return false;
			}
		}
		return true;
	}

	function handleSelect(selectedPlayer: User) {
		setPlayers([...players, selectedPlayer]);
		setSearchFor('');
		setShowOptions(false);
	}

	const useStyles = makeStyles((theme: ITheme) =>
		createStyles({
			text: {
				color: mainTextColor
			},
			rightChevron: {
				transition: '200ms'
			},
			downChevron: {
				transition: '200ms',
				transform: 'rotate(90deg)'
			}
		})
	);
	const classes = useStyles();

	return (
		<CenteredColored className="search-form-container">
			<List>
				<ListItem className="search-box list-item">
					<TextField
						label={players.length < 4 ? 'Find user' : 'Players selected'}
						onChange={e => {
							handleFormChange(e.target.value);
						}}
						value={searchFor}
						InputLabelProps={{
							className: classes.text
						}}
						InputProps={{
							color: 'secondary',
							disabled: players.length >= 4,
							endAdornment: (
								<InputAdornment position="end" style={{ marginRight: -11 }}>
									<IconButton
										component="span"
										onClick={() => {
											showOptions ? setShowOptions(false) : searchForUser(searchFor);
										}}
										disabled={searchFor.trim() === ''}
										disableRipple
									>
										<ChevronRightIcon
											className={showOptions ? classes.downChevron : classes.rightChevron}
											color={showOptions ? 'secondary' : 'primary'}
										/>
									</IconButton>
								</InputAdornment>
							)
						}}
						onKeyPress={e => {
							if (searchFor.trim() !== '' && e.key === 'Enter') {
								searchForUser(searchFor);
							}
						}}
					/>
				</ListItem>
				<Collapse in={showOptions} timeout={300} unmountOnExit className="search-box list-item">
					{foundUsers.length > 0 &&
						foundUsers.map(foundUser => {
							if (user && user.id !== foundUser.id && notSelected(foundUser)) {
								return (
									<ListItem
										className="user list-item"
										button
										key={foundUser.id}
										style={{
											borderRadius: '5px'
										}}
										onClick={() => {
											handleSelect(foundUser);
										}}
									>
										<ListItemText primary={foundUser.username} className={classes.text} />
										<ListItemIcon
											style={{
												justifyContent: 'flex-end'
											}}
										>
											<FaceIcon color="primary" />
										</ListItemIcon>
									</ListItem>
								);
							} else {
								return null;
							}
						})}
				</Collapse>
			</List>
		</CenteredColored>
	);
};

export default UserSearchForm;
