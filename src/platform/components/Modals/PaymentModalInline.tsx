import SendIcon from '@mui/icons-material/Send';
import { FormControl, IconButton, MenuItem, Select } from '@mui/material';
import { isEmpty } from 'lodash';
import { MuiStyles } from 'platform/style/MuiStyles';
import { FormRow } from 'platform/style/StyledComponents';
import { StyledText } from 'platform/style/StyledMui';
import { useMemo, useState } from 'react';
import { Amounts } from 'shared/enums';
import { Game } from 'shared/models';
import { getDefaultAmt } from 'shared/util';
import { sendChips } from './PaymentModal';

interface PaymentModalInlineProps {
	game: Game;
	playerSeat: number;
	updateGame: (game: Game) => void;
}

const PaymentModalInline = ({ game, playerSeat, updateGame }: PaymentModalInlineProps) => {
	const { hu, pay, thB } = game;

	const { winner, defaultAmt } = useMemo(() => {
		return {
			winner: isEmpty(hu) ? null : Number(hu[0]),
			defaultAmt: getDefaultAmt(hu, pay, playerSeat, thB)
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(hu), pay, playerSeat, thB]);

	const [amountStr, setAmountStr] = useState<string>(`${defaultAmt}`);
	const [amount, setAmount] = useState(defaultAmt);

	function handleSelectAmount(event: React.ChangeEvent<HTMLInputElement>) {
		let selectedAmountStr = (event.target as HTMLInputElement).value;
		setAmountStr(selectedAmountStr);
		setAmount(Number(selectedAmountStr) || 0);
	}

	return (
		<FormRow style={{ padding: '6px 0px 2px' }}>
			<StyledText variant="subtitle1" title={`Send chips:`} padding="2px" />
			<FormControl>
				<Select
					value={amountStr}
					onChange={handleSelectAmount}
					label="Chips"
					variant="standard"
					IconComponent={() => null}
					style={{ ...MuiStyles.small_dropdown_select, marginLeft: '5px' }}
				>
					{Amounts.map(amount => (
						<MenuItem key={`amount-${amount}`} style={{ ...MuiStyles.small_dropdown_item }} value={amount}>
							{amount}
						</MenuItem>
					))}
				</Select>
			</FormControl>
			<IconButton
				style={{ marginLeft: '5px' }}
				onClick={() => {
					sendChips(game, playerSeat, winner, amount, updateGame, () => {
						setAmount(0);
						setAmountStr('');
					});
				}}
				disabled={!Number(amount)}
				size="small"
				disableRipple
			>
				<SendIcon />
			</IconButton>
		</FormRow>
	);
};

export default PaymentModalInline;
