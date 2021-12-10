import { createBrowserHistory } from 'history';
import webUIStore from 'platform/store';
import { Styled } from 'platform/style/StyledComponents';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import Routes from 'Routes';
import { AppContextProvider } from 'shared/hooks';
import store from 'shared/store';
import './App.scss';

export const history = createBrowserHistory();

function App() {
	return (
		<Provider store={webUIStore}>
			<Provider store={store}>
				<AppContextProvider>
					<Styled>
						<Router history={history}>
							<Routes />
						</Router>
					</Styled>
				</AppContextProvider>
			</Provider>
		</Provider>
	);
}

export default App;
