import CasinoIcon from '@material-ui/icons/Casino';
import React from 'react';
import { Segments, Sizes, Suits } from '../../global/enums';
import ShownTile from './ShownTile';

interface Props {
	nonFlowers: ITile[];
	flowers: ITile[];
	flowerIds: string[];
	nonFlowerIds: string[];
	segment: Segments;
	dealer: boolean;
	tilesSize: Sizes;
	lastThrownId?: string;
}

function compare(prev: Props, next: Props) {
	return (
		prev.flowerIds.length === next.flowerIds.length &&
		prev.nonFlowerIds.length === next.nonFlowerIds.length &&
		prev.segment === next.segment &&
		prev.dealer === next.dealer &&
		prev.tilesSize === next.tilesSize &&
		(!!prev.nonFlowerIds.find(tileId => {
			return tileId === prev.lastThrownId;
		})
			? prev.lastThrownId === next.lastThrownId
			: !next.nonFlowerIds.find(tileId => {
					return tileId === next.lastThrownId;
			  }))
	);
}

const ShownTiles = ({ nonFlowers, flowers, segment, dealer, tilesSize, lastThrownId }: Props) => {
	return (
		<>
			{nonFlowers.map(tile => {
				return (
					<ShownTile
						key={tile.id}
						tileID={tile.id}
						tileCard={tile.card}
						segment={segment}
						lastID={lastThrownId}
					/>
				);
			})}
			{flowers.map(tile => {
				return (
					<ShownTile
						key={tile.id}
						tileID={tile.id}
						tileCard={tile.card}
						segment={segment}
						classSuffix={tile.isVF ? (tile.suit === Suits.ANIMAL ? 'flower animal' : 'hts flower') : ''}
					/>
				);
			})}
			{dealer && <CasinoIcon color="primary" fontSize={tilesSize} />}
		</>
	);
};

export default React.memo(ShownTiles, compare);
