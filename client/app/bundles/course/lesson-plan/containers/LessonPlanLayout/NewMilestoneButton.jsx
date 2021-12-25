import { Component } from 'react';
import {
  defineMessages,
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';

import { createMilestone, showMilestoneForm } from 'course/lesson-plan/actions';

const translations = defineMessages({
  newMilestone: {
    id: 'course.lessonPlan.NewMilestoneButton.newMilestone',
    defaultMessage: 'New Milestone',
  },
  success: {
    id: 'course.lessonPlan.NewMilestoneButton.success',
    defaultMessage: 'Milestone created.',
  },
  failure: {
    id: 'course.lessonPlan.NewMilestoneButton.failure',
    defaultMessage: 'Failed to create milestone.',
  },
});

const styles = {
  button: {
    marginRight: 16,
  },
};

class NewMilestoneButton extends Component {
  createMilestoneHandler = (data) => {
    const { dispatch } = this.props;
    const successMessage = <FormattedMessage {...translations.success} />;
    const failureMessage = <FormattedMessage {...translations.failure} />;
    return dispatch(createMilestone(data, successMessage, failureMessage));
  };

  showForm = () => {
    const { dispatch, intl } = this.props;
    return dispatch(
      showMilestoneForm({
        onSubmit: this.createMilestoneHandler,
        formTitle: intl.formatMessage(translations.newMilestone),
        initialValues: {},
      }),
    );
  };

  render() {
    if (!this.props.canManageLessonPlan) {
      return <div />;
    }

    return (
      <RaisedButton
        label={<FormattedMessage {...translations.newMilestone} />}
        onClick={this.showForm}
        primary={true}
        style={styles.button}
      />
    );
  }
}

NewMilestoneButton.propTypes = {
  canManageLessonPlan: PropTypes.bool.isRequired,

  dispatch: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

export default connect((state) => ({
  canManageLessonPlan: state.flags.canManageLessonPlan,
}))(injectIntl(NewMilestoneButton));
