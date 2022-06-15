import { IconButton, IconButtonProps, Tooltip } from '@mui/material';
import Edit from '@mui/icons-material/Edit';

interface Props extends IconButtonProps {
  onClick: (SyntheticEvent: any) => void;
  tooltip?: string;
}

const EditButton = ({
  onClick,
  tooltip = '',
  ...props
}: Props): JSX.Element => (
  <Tooltip title={tooltip}>
    <IconButton onClick={onClick} color="inherit" {...props}>
      <Edit />
    </IconButton>
  </Tooltip>
);

export default EditButton;
