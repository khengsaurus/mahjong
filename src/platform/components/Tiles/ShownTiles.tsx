import CasinoIcon from '@mui/icons-material/Casino';
import React, { forwardRef, memo, MutableRefObject } from 'react';
import { Segment, Size, Suit } from 'shared/enums';
import ShownTile from './ShownTile';

interface IShownTilesP {
	sT: boolean;
	dealer: boolean;
	className: string;
	lastThrownId?: string;
	tileSize: Size;
	segment: Segment;
	flowers: IShownTile[];
	nonFlowers: IShownTile[];
}

function compare(prev: IShownTilesP, next: IShownTilesP) {
	return (
		prev.dealer === next.dealer &&
		prev.segment === next.segment &&
		prev.tileSize === next.tileSize &&
		prev.sT === next.sT &&
		JSON.stringify(prev.flowers) === JSON.stringify(next.flowers) &&
		JSON.stringify(prev.nonFlowers) === JSON.stringify(next.nonFlowers) &&
		(!!prev.nonFlowers.find(tile => tile.i === prev.lastThrownId)
			? prev.lastThrownId === next.lastThrownId
			: !next.nonFlowers.find(tile => tile.i === next.lastThrownId))
	);
}

const ShownTiles = forwardRef<MutableRefObject<any>, IShownTilesP>(
	(props: IShownTilesP, ref?: MutableRefObject<any>) => {
		const { className, nonFlowers, flowers, segment, dealer, tileSize, lastThrownId } = props;
		return (
			<div id={segment + '-shown'} className={className} ref={ref}>
				{nonFlowers.map(tile => (
					<ShownTile
						key={tile?.i}
						tileRef={tile?.r}
						tileCard={tile?.c}
						segment={segment}
						highlight={tile?.i === lastThrownId}
					/>
				))}
				{flowers.map(tile => (
					<ShownTile
						key={tile?.i}
						tileRef={tile?.r}
						tileCard={tile?.c}
						segment={segment}
						classSuffix={tile?.v ? (tile?.s === Suit.ANIMAL ? 'flower animal' : 'hts flower') : ''}
					/>
				))}
				{dealer && <CasinoIcon color="primary" fontSize={tileSize} />}
			</div>
		);
	}
);

export default memo(ShownTiles, compare);
