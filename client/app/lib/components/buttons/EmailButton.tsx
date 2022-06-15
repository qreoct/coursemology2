import { IconButton, IconButtonProps, Tooltip } from '@mui/material';
import Email from '@mui/icons-material/Email';

interface Props extends IconButtonProps {
  onClick: (SyntheticEvent: any) => void;
  tooltip?: string;
}

const EmailButton = ({
  onClick,
  tooltip = '',
  ...props
}: Props): JSX.Element => (
  <Tooltip title={tooltip}>
    <IconButton onClick={onClick} color="inherit" {...props}>
      <Email />
    </IconButton>
  </Tooltip>
);

export default EmailButton;
