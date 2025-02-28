import { memo } from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  InputLabel,
  FormHelperText,
  Select,
  MenuItem,
} from '@mui/material';
import { formatErrorMessage } from 'lib/components/form/fields/utils/mapError';
import propsAreEqual from './utils/propsAreEqual';

const styles = {
  selectFieldStyle: {
    margin: '14px 10px 12px 0px',
  },
  errorText: { margin: 0 },
};

const FormSelectField = (props) => {
  const { field, fieldState, disabled, label, options, renderIf, ...custom } =
    props;
  const isError = !!fieldState.error;
  if (!renderIf) {
    return null;
  }

  return (
    <FormControl
      disabled={disabled}
      error={isError}
      fullWidth
      style={styles.selectFieldStyle}
      variant="standard"
    >
      <InputLabel>{label}</InputLabel>
      <Select
        {...field}
        onChange={(event) => field.onChange(event.target.value)}
        {...custom}
        variant="standard"
      >
        {options &&
          options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
      </Select>
      {isError && (
        <FormHelperText error={isError} style={styles.errorText}>
          {formatErrorMessage(fieldState.error.message)}
        </FormHelperText>
      )}
    </FormControl>
  );
};

FormSelectField.defaultProps = {
  renderIf: true,
};

FormSelectField.propTypes = {
  field: PropTypes.object.isRequired,
  fieldState: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  label: PropTypes.node,
  options: PropTypes.arrayOf(PropTypes.object),
  renderIf: PropTypes.bool,
};

export default memo(FormSelectField, propsAreEqual);
