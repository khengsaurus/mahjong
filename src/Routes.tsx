import Home from 'platform/pages/Home';
import JoinGame from 'platform/pages/JoinGame';
import Login from 'platform/pages/Login';
import NewUser from 'platform/pages/Login/NewUser';
import NewGame from 'platform/pages/NewGame';
import Sample from 'platform/pages/Sample';
import Table from 'platform/pages/Table';
import { IWebUIStore, Slide } from 'platform/store';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.scss';
// import './pageSlider.scss';

const Routes = () => {
	const slide: Slide = useSelector((state: IWebUIStore) => state.slide) || Slide.LEFT;
	// const timeout = { enter: 800, exit: 400 };

	return (
		<Route
			render={({ location }) => (
				<TransitionGroup>
					<CSSTransition key={location.key} timeout={600} classNames={`screen-slide-${slide}`}>
						<Switch location={location}>
							<Route exact path="/" component={Home} />
							<Route exact path="/Login" component={Login} />
							<Route exact path="/NewUser" component={NewUser} />
							<Route exact path="/NewGame" component={NewGame} />
							<Route exact path="/JoinGame" component={JoinGame} />
							<Route exact path="/Table" component={Table} />
							<Route exact path="/Sample" component={Sample} />
						</Switch>
					</CSSTransition>
				</TransitionGroup>
			)}
		/>
	);
};

export default Routes;
