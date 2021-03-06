import {
	DiscardedTiles,
	HiddenHand,
	ShownHiddenHand,
	ShownTiles,
	UnusedTiles
} from 'components';
import { FrontBackTag, Segment, Size } from 'enums';
import { AppContext, useTiles } from 'hooks';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { IStore } from 'store';
import { IPlayerComponentP } from 'typesPlus';
import './playerComponents.scss';

const TopPlayer = (props: IPlayerComponentP) => {
	const { player, dealer, hasFront, hasBack, lastThrown, highlight } = props;
	const { hTs = [], sTs = [], ms, dTs = [], lTa = {}, uTs, sT } = player;
	const { showAI } = useContext(AppContext);
	const allHiddenTiles = player?.allHiddenTiles() || [];
	const {
		sizes: { tileSize = Size.MEDIUM },
		tHK
	} = useSelector((state: IStore) => state);
	const { flowers, nonFlowers } = useTiles({
		sTs,
		ms
	});

	return (
		<div className={`row-section-${tileSize || Size.MEDIUM}`}>
			{/* Hidden or shown hand */}
			{showAI || sT ? (
				<ShownHiddenHand
					className="htss top"
					segment={Segment.TOP}
					lastSuffix="margin-right"
					{...{ hTs, lTa, tHK, dealer }}
				/>
			) : (
				<HiddenHand
					segment={Segment.TOP}
					tiles={allHiddenTiles.length}
					tileSize={tileSize}
					highlight={highlight}
					dealer={dealer}
				/>
			)}

			{/* Shown tiles */}
			{(dealer || sTs.length > 0) && (
				<ShownTiles
					className="htss top"
					segment={Segment.TOP}
					lastThrownId={lastThrown?.i}
					{...{ dealer, flowers, nonFlowers, sT, tileSize }}
				/>
			)}

			{/* Unused tiles */}
			<UnusedTiles
				tiles={uTs}
				segment={Segment.TOP}
				tag={hasFront ? FrontBackTag.FRONT : hasBack ? FrontBackTag.BACK : null}
				tileSize={tileSize}
			/>

			{/* Discarded tiles */}
			{dTs.length > 0 && (
				<DiscardedTiles
					className="htss top discarded"
					tiles={dTs}
					segment={Segment.TOP}
				/>
			)}
		</div>
	);
};

export default TopPlayer;
