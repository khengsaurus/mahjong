import { getHands } from 'bot';
import { LocalFlag } from 'enums';
import { useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { IStore } from 'store';
import { AppContext } from './AppContext';

export default function useHand(): IUseHand {
	const { playerSeat } = useContext(AppContext);
	const { game, gameId, localGame, tHK } = useSelector((state: IStore) => state);
	const currGame = gameId === LocalFlag ? localGame : game;
	const { lTh, n = [], ps = [] } = currGame;
	const { ms, hTs, lTa } = ps[playerSeat] || {};

	const _pRef =
		JSON.stringify(ms) + JSON.stringify(hTs.map(t => t.r)) + JSON.stringify(lTa?.r);

	return useMemo(() => {
		if (n[3] !== playerSeat && n[7] === playerSeat) {
			return { HH: {} };
		} else {
			return getHands(currGame, playerSeat, tHK);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lTh?.c, lTh?.r, n[7], _pRef, tHK]);
}
