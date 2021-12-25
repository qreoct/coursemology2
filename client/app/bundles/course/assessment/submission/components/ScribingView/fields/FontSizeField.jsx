import { injectIntl, intlShape } from 'react-intl';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import PropTypes from 'prop-types';

import { scribingTranslations as translations } from '../../../translations';

const propTypes = {
  intl: intlShape.isRequired,
  fontSizeValue: PropTypes.number,
  onChangeFontSize: PropTypes.func,
};

const styles = {
  select: {
    width: '210px',
  },
};

const FontSizeField = (props) => {
  const { intl, fontSizeValue, onChangeFontSize } = props;
  const menuItems = [];

  for (let i = 1; i <= 60; i++) {
    menuItems.push(<MenuItem key={i} primaryText={i} value={i} />);
  }

  return (
    <div>
      <SelectField
        floatingLabelText={intl.formatMessage(translations.fontSize)}
        maxHeight={150}
        onChange={onChangeFontSize}
        style={styles.select}
        value={fontSizeValue}
      >
        {menuItems}
      </SelectField>
    </div>
  );
};

FontSizeField.propTypes = propTypes;
export default injectIntl(FontSizeField);
