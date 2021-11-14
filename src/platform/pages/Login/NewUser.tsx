import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import { history } from 'App';
import 'App.scss';
import { HomeTheme } from 'platform/style/MuiStyles';
import { Main } from 'platform/style/StyledComponents';
import { StyledButton, Title } from 'platform/style/StyledMui';
import { useContext, useState } from 'react';
import { Pages, Status } from 'shared/enums';
import { AppContext } from 'shared/hooks';
import { User } from 'shared/models';
import { FBDeleteCurrentFBUser, FBNewUser_EmailUser, FBResolveUser_Email } from 'shared/service/fbUserFns';

const NewUser = () => {
	const { userEmail, login, logout, alert, setAlert } = useContext(AppContext);
	const [username, setUsername] = useState('');

	function handleCancel() {
		setAlert(null);
		FBDeleteCurrentFBUser();
		logout();
		history.push(Pages.LOGIN);
	}

	function handleSubmit(values: IEmailUser, callback: () => void) {
		FBNewUser_EmailUser(values)
			.then(res => {
				if (res) {
					setAlert({ status: Status.SUCCESS, msg: 'Registered successfully' });
					callback();
				}
			})
			.catch(err => {
				setAlert({ status: Status.ERROR, msg: err.toString() });
			});
	}

	function successCallback() {
		FBResolveUser_Email(userEmail)
			.then((user: User) => {
				login(user, true);
				setTimeout(function () {
					history.push(Pages.HOME);
					setAlert(null);
				}, 1000);
			})
			.catch(err => {
				if (err.message === 'Username already taken') {
					setAlert({ status: Status.ERROR, msg: err.message });
				}
			});
	}

	return (
		<HomeTheme>
			<Main>
				<Title title={`Welcome! Choose a username`} />
				<TextField
					name="username"
					label="Username"
					onChange={e => {
						setUsername(e.target.value);
					}}
				/>
				<br></br>
				<StyledButton
					label={`Submit`}
					autoFocus
					type="submit"
					disabled={username.trim() === ''}
					onClick={() => {
						handleSubmit({ email: userEmail, uN: username }, successCallback);
					}}
				/>
				{alert?.status !== Status.SUCCESS ? <StyledButton label="Cancel" onClick={handleCancel} /> : null}
				{alert && (
					<>
						<br></br>
						<Alert severity={alert.status as 'success' | 'info' | 'warning' | 'error'}>{alert.msg}</Alert>
					</>
				)}
			</Main>
		</HomeTheme>
	);
};

export default NewUser;