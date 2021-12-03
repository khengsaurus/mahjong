import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { isEmpty } from 'lodash';
import FBService from 'platform/service/MyFirebaseService';
import { MuiStyles } from 'platform/style/MuiStyles';
import { HomeButton, StyledButton, Title } from 'platform/style/StyledMui';
import { getHandDesc } from 'shared/util';
import PaymentModalInline from './PaymentModalInline';

const AnnounceHuModal = ({ game, playerSeat, show, onClose: handleShow }: IModalProps) => {
	const { hu, draw, on, dealer } = game;

	async function nextRound() {
		game.initRound();
		FBService.updateGame(game);
	}

	return (
		<Dialog
			open={!isEmpty(hu) || draw}
			BackdropProps={{ invisible: true }}
			PaperProps={{
				style: {
					...MuiStyles.small_dialog
				}
			}}
		>
			<DialogContent style={{ paddingBottom: 0 }}>
				{hu.length >= 3 && (
					<>
						<Title
							title={`${game.ps[hu[0]]?.uN} hu, ${hu[1]}台${hu[2] === 1 ? ` 自摸` : ``}`}
							variant="h6"
							padding="3px 0px"
						/>
						{hu.slice(3, hu.length).map((p: string, ix: number) => {
							return <Title title={getHandDesc(p)} variant="subtitle2" padding="2px" key={ix} />;
						})}
					</>
				)}
				{hu.length >= 3 && hu[0] !== playerSeat && <PaymentModalInline game={game} playerSeat={playerSeat} />}
				{draw && <Title title={`Draw!`} variant="subtitle1" padding="3px 0px" />}
				{(!on || dealer === 10) && (
					<Title title={`The game has ended!`} variant="subtitle1" padding="3px 0px" />
				)}
			</DialogContent>
			<DialogActions
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					padding: '0px 15px'
				}}
			>
				<HomeButton />
				{hu.length >= 3 && hu[0] !== playerSeat && (
					<StyledButton label={show ? 'Hide' : 'Show'} onClick={handleShow} />
				)}
				{on && playerSeat === Number(game.dealer) && <StyledButton label={`Next Round`} onClick={nextRound} />}
			</DialogActions>
		</Dialog>
	);
};

export default AnnounceHuModal;
