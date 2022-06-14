import moment from 'lib/moment';

export function arrayToObjectById(array) {
  return array.reduce((obj, item) => ({ ...obj, [item.id]: item }), {});
}

export function formatDateTime(dateTime) {
  return dateTime ? moment(dateTime).format('DD MMM YYYY, h:mma') : null;
}

export function capitaliseFirstLetter(word) {
  if (word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
  return '';
}

export function parseLanguages(language) {
  switch (language) {
    case 'C/C++':
      return 'c_cpp';
    case 'Java 8':
    case 'Java 11':
    case 'Java':
      return 'java';
    case 'Python 3.9':
    case 'Python 3.7':
    case 'Python 3.6':
    case 'Python 3.5':
    case 'Python 3.4':
    case 'Python 2.7':
      return 'python';
    default:
      return '';
  }
}

/**
 * Workaround to reset arrays in fields in react-hook-form
 * Sets their initialValue to the value in `array`
 */
export function resetArrayFields(array, resetField, path = '') {
  const fieldPath = path === '' ? '' : `${path}.`;
  array.forEach((obj, index) => {
    Object.keys(obj).forEach((fieldName) => {
      resetField(`${fieldPath}${index}.${fieldName}`, {
        defaultValue: obj[fieldName],
      });
    });
  });
}

/**
 * Workaround to reset objects in fields in react-hook-form
 * Sets their initialValue to the value in `fields`
 */
export function resetObjectFields(fields, id, resetField) {
  Object.keys(fields).forEach((fieldName) => {
    if (fieldName === 'files_attributes') {
      // we specifically target files_attributes since it is a nested array
      // and react-hook-form's resetField needs to reset each arrayField individually
      resetArrayFields(fields[fieldName], resetField, `${id}.${fieldName}`);
    } else {
      resetField(`${id}.${fieldName}`, {
        defaultValue: fields[fieldName],
      });
    }
  });
}
