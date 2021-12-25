import { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Card, CardText } from 'material-ui/Card';
import Subheader from 'material-ui/Subheader';
import PropTypes from 'prop-types';

import { fetchLessonPlan } from 'course/lesson-plan/actions';
import ColumnVisibilityDropdown from 'course/lesson-plan/containers/ColumnVisibilityDropdown';
import EventFormDialog from 'course/lesson-plan/containers/EventFormDialog';
import LessonPlanFilter from 'course/lesson-plan/containers/LessonPlanFilter';
import LessonPlanNav from 'course/lesson-plan/containers/LessonPlanNav';
import MilestoneFormDialog from 'course/lesson-plan/containers/MilestoneFormDialog';
import LessonPlanEdit from 'course/lesson-plan/pages/LessonPlanEdit';
import LessonPlanShow from 'course/lesson-plan/pages/LessonPlanShow';
import LoadingIndicator from 'lib/components/LoadingIndicator';
import TitleBar from 'lib/components/TitleBar';
import DeleteConfirmation from 'lib/containers/DeleteConfirmation';
import NotificationPopup from 'lib/containers/NotificationPopup';
import { lessonPlanTypesGroups } from 'lib/types';

import EnterEditModeButton from './EnterEditModeButton';
import ExitEditModeButton from './ExitEditModeButton';
import NewEventButton from './NewEventButton';
import NewMilestoneButton from './NewMilestoneButton';

const translations = defineMessages({
  empty: {
    id: 'course.lessonPlan.LessonPlanLayout.empty',
    defaultMessage: 'The lesson plan is empty.',
  },
  lessonPlan: {
    id: 'course.lessonPlan.LessonPlanLayout.lessonPlan',
    defaultMessage: 'Lesson Plan',
  },
});

const styles = {
  tools: {
    position: 'fixed',
    bottom: 12,
    right: 24,
    display: 'flex',
    justifyContent: 'flex-end',
    zIndex: 1,
  },
  mainBody: {
    // Allow end part of table to be unobstructed when scrolled all the way to the bottom
    marginBottom: 100,
  },
};

const lessonPlanPath = '/courses/:courseId/lesson_plan';

class LessonPlanLayout extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchLessonPlan());
  }

  renderBody() {
    const { isLoading, groups } = this.props;

    if (isLoading) {
      return <LoadingIndicator />;
    }

    if (!groups || groups.length < 1) {
      return (
        <Subheader>
          <FormattedMessage {...translations.empty} />
        </Subheader>
      );
    }

    return (
      <Switch>
        <Route component={LessonPlanShow} exact={true} path={lessonPlanPath} />
        <Route
          component={LessonPlanEdit}
          exact={true}
          path={`${lessonPlanPath}/edit`}
        />
      </Switch>
    );
  }

  renderHeader() {
    if (!this.props.canManageLessonPlan) {
      return null;
    }

    return (
      <Card>
        <CardText>
          <Route
            component={EnterEditModeButton}
            exact={true}
            path={lessonPlanPath}
          />
          <Route
            component={ExitEditModeButton}
            exact={true}
            path={`${lessonPlanPath}/edit`}
          />
          <NewMilestoneButton />
          <Route component={NewEventButton} path={lessonPlanPath} />
          <Route
            component={ColumnVisibilityDropdown}
            exact={true}
            path={`${lessonPlanPath}/edit`}
          />
        </CardText>
      </Card>
    );
  }

  render() {
    return (
      <div style={styles.mainBody}>
        <TitleBar title={<FormattedMessage {...translations.lessonPlan} />} />
        {this.renderHeader()}
        {this.renderBody()}
        <div style={styles.tools}>
          <LessonPlanNav />
          <LessonPlanFilter />
        </div>
        <NotificationPopup />
        <DeleteConfirmation />
        <EventFormDialog />
        <MilestoneFormDialog />
      </div>
    );
  }
}

LessonPlanLayout.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  groups: lessonPlanTypesGroups.isRequired,
  canManageLessonPlan: PropTypes.bool.isRequired,

  dispatch: PropTypes.func.isRequired,
};

export default withRouter(
  connect((state) => ({
    isLoading: state.lessonPlan.isLoading,
    groups: state.lessonPlan.groups,
    canManageLessonPlan: state.flags.canManageLessonPlan,
  }))(LessonPlanLayout),
);
