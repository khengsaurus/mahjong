import Checkbox from '@material-ui/core/Checkbox';
import { FormRow } from 'platform/style/StyledComponents';
import { Title } from 'platform/style/StyledMui';

interface CheckBoxProps {
	title: string;
	value: boolean;
	onChange: () => void;
	titleVariant?: 'subtitle2' | 'h6' | 'subtitle1';
	titlePadding?: string;
	defaultChecked?: boolean;
}

const CheckBox = ({
	title,
	value,
	onChange,
	titleVariant = 'subtitle2',
	titlePadding = '0px',
	defaultChecked = false
}: CheckBoxProps) => {
	return (
		<FormRow>
			<Title title={title} variant={titleVariant} padding={titlePadding} />
			<Checkbox value={value} onChange={onChange} defaultChecked={defaultChecked} />
		</FormRow>
	);
};

export default CheckBox;