import getTileSrc from 'shared/images';

interface HandTileProps {
	card: string;
	selected: boolean;
	last: boolean;
	callback: () => void;
}

const HandTile = (props: HandTileProps) => {
	const { card, selected, last, callback } = props;
	return (
		<div
			className={`self-hidden-tile${selected ? ` selected` : ` unselected`}${last ? ` last` : ``}`}
			onClick={callback}
		>
			<img className="self-hidden-tile-bg" src={getTileSrc(card)} alt="tile" />
		</div>
	);
};

export default HandTile;