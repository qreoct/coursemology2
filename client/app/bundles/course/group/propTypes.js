import PropTypes from 'prop-types';

// Used in the courseUsers array
export const courseUserShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  role: PropTypes.oneOf([
    'owner',
    'manager',
    'student',
    'teaching_assistant',
    'observer',
  ]),
  isPhantom: PropTypes.bool.isRequired,
});

export const memberShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  courseUserId: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  role: PropTypes.oneOf([
    'owner',
    'manager',
    'student',
    'teaching_assistant',
    'observer',
  ]),
  isPhantom: PropTypes.bool.isRequired,
  groupRole: PropTypes.oneOf(['manager', 'normal']),
});

export const groupShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  members: PropTypes.arrayOf(memberShape),
});

export const categoryShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  groups: PropTypes.arrayOf(groupShape),
});
