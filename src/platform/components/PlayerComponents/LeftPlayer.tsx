import { DiscardedTiles, HiddenHand, ShownTiles, SuspenseTiles, UnusedTiles } from 'platform/components/Tiles';
import { useDynamicWidth } from 'platform/hooks';
import { lazy, Suspense, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
	AppFlag,
	FrontBackTag,
	Segment,
	Size,
	_HiddenTileWidth,
	_ShownTileHeight,
	_ShownTileWidth
} from 'shared/enums';
import { useTiles } from 'shared/hooks';
import { IStore } from 'shared/store';
import { IPlayerComponentProps } from 'shared/typesPlus';
import './playerComponents.scss';

const ShownHiddenHand = lazy(() => import('platform/components/Tiles/ShownHiddenHand'));

const LeftPlayer = (props: IPlayerComponentProps) => {
	const { player, dealer, hasFront, hasBack, lastThrown } = props;
	const { hTs, sTs, ms, dTs, lTa, uTs, sT } = player;
	const countHandTiles = hTs?.length + (Number(lTa?.r) ? 1 : 0);
	const {
		theme: { tileColor },
		sizes: { tileSize = Size.MEDIUM },
		tHK
	} = useSelector((state: IStore) => state);
	const { flowers, nonFlowers, nonFlowerRefs, flowerRefs } = useTiles({
		sTs,
		ms
	});
	const shownTilesRef = useRef(null);
	useDynamicWidth({
		ref: shownTilesRef,
		countTs: nonFlowers.length + flowers.length,
		tileSize,
		add: dealer ? 1 : 0
	});
	const shownHiddenHandRef = useRef(null);
	useDynamicWidth({
		ref: shownHiddenHandRef,
		countTs: player.allHiddenTiles().length,
		tileSize,
		addPx: _HiddenTileWidth[tileSize]
	});

	return (
		<div className={`column-section-${tileSize || Size.MEDIUM}`}>
			{/* Hidden or shown hand */}
			{process.env.REACT_APP_FLAG.startsWith(AppFlag.DEV_BOT) || sT ? (
				<Suspense
					fallback={
						<SuspenseTiles
							height={_ShownTileHeight[tileSize]}
							width={countHandTiles * _ShownTileWidth[tileSize]}
							color={tileColor}
							segment={Segment.LEFT}
						/>
					}
				>
					<ShownHiddenHand
						className="vtss left"
						{...{ hTs, lTa, tHK }}
						segment={Segment.LEFT}
						lastSuffix="margin-bottom"
						ref={shownHiddenHandRef}
					/>
				</Suspense>
			) : (
				<HiddenHand tiles={countHandTiles} segment={Segment.LEFT} />
			)}

			{/* Shown tiles */}
			{(dealer || sTs?.length > 0) && (
				<ShownTiles
					className="vtss left"
					nonFlowers={nonFlowers}
					flowers={flowers}
					flowerRefs={flowerRefs}
					nonFlowerRefs={nonFlowerRefs}
					segment={Segment.LEFT}
					dealer={dealer}
					tileSize={tileSize}
					lastThrownRef={lastThrown?.r}
					ref={shownTilesRef}
				/>
			)}

			{/* Unused tiles */}
			<UnusedTiles
				tiles={uTs}
				segment={Segment.LEFT}
				tag={hasFront ? FrontBackTag.FRONT : hasBack ? FrontBackTag.BACK : null}
			/>

			{/* Discarded tiles */}
			{dTs?.length > 0 && <DiscardedTiles className="vtss left discarded" tiles={dTs} segment={Segment.LEFT} />}
		</div>
	);
};

export default LeftPlayer;
