import { IconButton, IconButtonProps, Tooltip } from '@mui/material';
import Done from '@mui/icons-material/Done';

interface Props extends IconButtonProps {
  onClick: (SyntheticEvent: any) => void;
  tooltip?: string;
}

const AcceptButton = ({
  onClick,
  tooltip = '',
  ...props
}: Props): JSX.Element => (
  <Tooltip title={tooltip}>
    <IconButton onClick={onClick} color="inherit" {...props}>
      <Done />
    </IconButton>
  </Tooltip>
);

export default AcceptButton;
