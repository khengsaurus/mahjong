import CasinoIcon from '@material-ui/icons/Casino';
import * as _ from 'lodash';
import React, { useContext, useMemo } from 'react';
import getTileSrc from '../../images';
import { AppContext } from '../../util/hooks/AppContext';
import { generateNumberArray } from '../../util/utilFns';
import './playerComponentsLarge.scss';
import './playerComponentsMedium.scss';
import './playerComponentsSmall.scss';

const LeftPlayer = (props: PlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown } = props;
	const { selectedTiles, setSelectedTiles, handSize, tilesSize } = useContext(AppContext);
	const unusedTiles: number[] = useMemo(() => generateNumberArray(player.unusedTiles), [player.unusedTiles]);
	let frontBackTag = hasFront ? 'front' : hasBack ? 'back' : '';

	function selectTile(tile: TileI) {
		if (!selectedTiles.includes(tile) && selectedTiles.length < 4) {
			setSelectedTiles([...selectedTiles, tile]);
		} else {
			setSelectedTiles(selectedTiles.filter(selectedTile => selectedTile.id !== tile.id));
		}
	}

	return (
		<div className={`column-section-${tilesSize}`}>
			{/*------------------------------ Hidden tiles ------------------------------*/}
			{player.showTiles ? (
				<div className="vtss">
					{player.hiddenTiles.map((tile: TileI) => {
						return (
							<div className="vts" key={`${tile.id}-hidden`}>
								<img className="vts-bg" src={getTileSrc(tile.card)} alt="tile" />
							</div>
						);
					})}
					{!_.isEmpty(player.lastTakenTile) && (
						<div className="vts margin-top" key={`${player.lastTakenTile.id}-hidden`}>
							<img className="vts-bg last" src={getTileSrc(player.lastTakenTile.card)} alt="tile" />
						</div>
					)}
				</div>
			) : (
				<div className={`self-hidden-tiles-${handSize}`}>
					{player.hiddenTiles.map((tile: TileI) => {
						return (
							<div
								key={`${tile.id}-hidden`}
								className={
									selectedTiles.includes(tile)
										? 'self-hidden-tile selected'
										: 'self-hidden-tile unselected'
								}
								onClick={() => selectTile(tile)}
							>
								<img className="self-hidden-tile-bg" src={getTileSrc(tile.card)} alt="tile" />
							</div>
						);
					})}
					{!_.isEmpty(player.lastTakenTile) && (
						<div
							key={`${player.lastTakenTile.id}-hidden`}
							className={
								selectedTiles.includes(player.lastTakenTile)
									? 'self-hidden-tile selected last'
									: 'self-hidden-tile unselected last'
							}
							onClick={() => selectTile(player.lastTakenTile)}
						>
							<img
								className="self-hidden-tile-bg"
								src={getTileSrc(player.lastTakenTile.card)}
								alt="tile"
							/>
						</div>
					)}
				</div>
			)}

			{/*------------------------------ Shown tiles ------------------------------*/}
			<div className="vtss">
				{player.shownTiles.map((tile: TileI) => {
					let tileBgName = `vts-bg${!_.isEmpty(lastThrown) && tile.id === lastThrown.id ? ` last` : ``}`;
					return tile.suit !== '花' && tile.suit !== '动物' ? (
						<div className="vts" key={`${tile.id}-shown`}>
							<img className={tileBgName} src={getTileSrc(tile.card)} alt="tile" />
						</div>
					) : null;
				})}
				{/* Extra */}
				{/* {player.hiddenTiles.map((tile: TileI) => {
					return (
						<div className="vts" key={`${tile.id}-shown`}>
							<img className="vts-bg" src={getTileSrc(tile.card)} alt="tile" />
						</div>
					);
				})} */}
				{player.shownTiles.map((tile: TileI) => {
					return tile.suit === '花' || tile.suit === '动物' ? (
						<div className="vts" key={`${tile.id}-shown`}>
							<img
								className={
									tile.isValidFlower
										? tile.suit === '动物'
											? 'vts-bg flower animal'
											: 'vts-bg flower'
										: 'vts-bg'
								}
								src={getTileSrc(tile.card)}
								alt="tile"
							/>
						</div>
					) : null;
				})}
				{dealer && <CasinoIcon color="disabled" fontSize="small" />}
			</div>

			{/*------------------------------ Unused tiles ------------------------------*/}
			<div className={`vtsh unused ${frontBackTag}`}>
				{unusedTiles &&
					unusedTiles.map(i => {
						return <div key={`self-unused-tile${i}`} className="vth" />;
					})}
			</div>

			{/*------------------------------ Discarded tiles ------------------------------*/}
			<div className="vtss discarded">
				{/* Extra */}
				{/* {player.hiddenTiles.map((tile: TileI) => {
					return (
						<div className="dt" key={`self-dt-${tile.id}`}>
							<img className="vts-bg" src={getTileSrc(tile.card)} alt="tile" />
						</div>
					);
				})} */}
				{player.discardedTiles.map((tile: TileI) => {
					let tileBgName = `vts-bg${!_.isEmpty(lastThrown) && tile.id === lastThrown.id ? ` last` : ``}`;
					return (
						<div
							className={'vts'}
							key={`${tile.id}-discarded`}
							onClick={() => {
								console.log(tile.id);
							}}
						>
							<img className={tileBgName} src={getTileSrc(tile.card)} alt="tile" />
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default React.memo(LeftPlayer);
