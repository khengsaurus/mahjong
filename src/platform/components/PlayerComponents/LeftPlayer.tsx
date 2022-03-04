import { DiscardedTiles, HiddenHand, ShownHiddenHand, ShownTiles, UnusedTiles } from 'platform/components/Tiles';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { FrontBackTag, Segment, Size } from 'shared/enums';
import { AppContext, useTiles } from 'shared/hooks';
import { IStore } from 'shared/store';
import { IPlayerComponentP } from 'shared/typesPlus';
import './playerComponents.scss';

const LeftPlayer = (props: IPlayerComponentP) => {
	const { player, dealer, hasFront, hasBack, lastThrown, highlight, totalRounds } = props;
	const { hTs = [], sTs = [], ms, dTs = [], lTa = {}, uTs, sT } = player;
	const { showAI } = useContext(AppContext);
	const countHandTiles = hTs.length + (Number(lTa.r) ? 1 : 0);
	const {
		sizes: { tileSize = Size.MEDIUM },
		tHK
	} = useSelector((state: IStore) => state);
	const { flowers, nonFlowers } = useTiles({
		sTs,
		ms
	});

	return (
		<div className={`column-section-${tileSize || Size.MEDIUM}`}>
			{/* Hidden or shown hand */}
			{showAI || sT ? (
				<ShownHiddenHand
					className="vtss left"
					segment={Segment.LEFT}
					lastSuffix="margin-bottom"
					dependencies={[tileSize, showAI || sT, countHandTiles, totalRounds]}
					{...{ hTs, lTa, tHK }}
				/>
			) : (
				<HiddenHand segment={Segment.LEFT} tiles={countHandTiles} tileSize={tileSize} highlight={highlight} />
			)}

			{/* Shown tiles */}
			{(dealer || sTs.length > 0) && (
				<ShownTiles
					className="vtss left"
					segment={Segment.LEFT}
					lastThrownId={lastThrown?.i}
					dependencies={[dealer, sTs.length, totalRounds]}
					{...{ dealer, flowers, nonFlowers, sT, tileSize }}
				/>
			)}

			{/* Unused tiles */}
			<UnusedTiles
				tiles={uTs}
				segment={Segment.LEFT}
				tag={hasFront ? FrontBackTag.FRONT : hasBack ? FrontBackTag.BACK : null}
				tileSize={tileSize}
			/>

			{/* Discarded tiles */}
			{dTs.length > 0 && <DiscardedTiles className="vtss left discarded" tiles={dTs} segment={Segment.LEFT} />}
		</div>
	);
};

export default LeftPlayer;
