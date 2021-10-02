import { useContext } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { AppContext } from '../util/hooks/AppContext';
import { TextColors } from './enums';

export const Styled = (props: any) => {
	const { backgroundColor, tableColor, tileBackColor, tableTextColor, mainTextColor } = useContext(AppContext);
	const colorTheme = {
		backgroundColor,
		tableColor,
		tileBackColor,
		tableTextColor,
		mainTextColor
	};
	return <ThemeProvider theme={colorTheme} {...props} />;
};

export const TableColoredDiv = styled.div`
	background-color: ${props => props.theme.tableColor};
`;

export const Centered = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
`;

export const CenteredColored = styled(Centered)`
	background-color: ${props => props.theme.backgroundColor};
`;

export const Main = styled(Centered)`
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	font-family: 'Roboto', sans-serif;
	background-color: ${props => props.theme.backgroundColor};
	-webkit-touch-callout: none; /* iOS Safari */
	-webkit-user-select: none; /* Safari */
	-khtml-user-select: none; /* Konqueror HTML */
	-moz-user-select: none; /* Old versions of Firefox */
	-ms-user-select: none; /* Internet Explorer/Edge */
	user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
`;

export const MainTransparent = styled(Main)`
	background-color: transparent;
`;

export const TableDiv = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: relative;
	height: 100%;
	width: 100%;
	max-height: 900px;
	max-width: 900px;
	font-family: 'Roboto', sans-serif;
	background-color: ${props => props.theme.tableColor};
	-webkit-touch-callout: none; /* iOS Safari */
	-webkit-user-select: none; /* Safari */
	-khtml-user-select: none; /* Konqueror HTML */
	-moz-user-select: none; /* Old versions of Firefox */
	-ms-user-select: none; /* Internet Explorer/Edge */
	user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
`;

export const Wind = styled.div`
	display: flex;
	flex-direction: column;
	font-family: 'Roboto', sans-serif;
	color: ${props => props.theme.backgroundColor};
`;

export const TableText = styled.p`
	color: ${props => props.theme.tableTextColor};
	margin: 0;
`;

export const GreenTableText = styled.p`
	color: ${TextColors.GREEN};
	margin: 0;
`;

export const HiddenTile = styled.div`
	background-color: ${props => props.theme.tileBackColor || 'teal'};
`;

export const VerticalDivider = styled.div`
	position: relative;
	top: 10%;
	height: 80%;
	max-height: 200px;
	width: 1px;
	background-color: ${props => props.theme.mainTextColor};
`;

export const Row = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
`;