import { history } from 'App';
import { useContext, useEffect } from 'react';
import { Pages, Status } from 'shared/enums';
import { AppContext, useSession } from 'shared/hooks';

function useLocalSession() {
	const { logout } = useContext(AppContext);
	const { verifyingSession, sessionVerified } = useSession();

	useEffect(() => {
		if (verifyingSession === Status.SUCCESS && !sessionVerified) {
			logout();
			history.push(Pages.LOGIN);
		}
	}, [verifyingSession, sessionVerified, logout]);

	return { verifyingSession, sessionVerified };
}

export default useLocalSession;
