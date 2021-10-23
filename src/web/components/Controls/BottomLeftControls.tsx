import React, { useContext } from 'react';
import { AppContext } from 'shared/hooks/AppContext';
import { MuiStyles } from 'web/style/MuiStyles';
import { ControlButton } from 'web/style/StyledMui';
import './controls.scss';

const BottomLeftControls = (props: IBottomLeftControls) => {
	const { handleChi, handlePong, handleHu, disableChi, disablePong, disableHu, pongText, confirmHu, showHu } = props;
	const { controlsSize } = useContext(AppContext);

	return (
		<div className={`bottom-left-controls-${controlsSize}`}>
			<ControlButton
				label={pongText}
				callback={handlePong}
				disabled={disablePong}
				style={{ ...MuiStyles[`buttons_${controlsSize}`] }}
			/>
			<ControlButton
				label={`吃`}
				callback={handleChi}
				disabled={disableChi}
				style={{ ...MuiStyles[`buttons_${controlsSize}`] }}
			/>
			{confirmHu && !showHu && (
				<ControlButton
					label="开!"
					callback={handleHu}
					disabled={disableHu}
					style={{ ...MuiStyles[`buttons_${controlsSize}`] }}
				/>
			)}
		</div>
	);
};

export default BottomLeftControls;
