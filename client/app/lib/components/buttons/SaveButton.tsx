import { IconButton, IconButtonProps, Tooltip } from '@mui/material';
import Save from '@mui/icons-material/Save';

interface Props extends IconButtonProps {
  onClick: (SyntheticEvent: any) => void;
  tooltip?: string;
}

const SaveButton = ({
  onClick,
  tooltip = '',
  ...props
}: Props): JSX.Element => (
  <Tooltip title={tooltip}>
    <IconButton onClick={onClick} color="inherit" {...props}>
      <Save />
    </IconButton>
  </Tooltip>
);

export default SaveButton;
