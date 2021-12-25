import { Component } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { createDragDropManager } from 'dnd-core';
import Subheader from 'material-ui/Subheader';
import PropTypes from 'prop-types';

import * as surveyActions from 'course/survey/actions/surveys';
import { surveyShape } from 'course/survey/propTypes';
import surveyTranslations from 'course/survey/translations';
import LoadingIndicator from 'lib/components/LoadingIndicator';

import Section from './Section';
import SurveyDetails from './SurveyDetails';

const translations = defineMessages({
  empty: {
    id: 'course.surveys.SurveyShow.empty',
    defaultMessage: 'This survey does not have any questions.',
  },
});

class SurveyShow extends Component {
  componentDidMount() {
    const { dispatch, surveyId } = this.props;
    dispatch(surveyActions.fetchSurvey(surveyId));
  }

  renderBody(survey) {
    const { intl, isLoading, disabled } = this.props;
    const { sections, canUpdate } = survey;
    if (isLoading) {
      return <LoadingIndicator />;
    }
    if (!canUpdate) {
      return null;
    }
    if (!sections || sections.length < 1) {
      return <Subheader>{intl.formatMessage(translations.empty)}</Subheader>;
    }
    const lastIndex = sections.length - 1;

    return (
      <>
        <Subheader>
          {intl.formatMessage(surveyTranslations.questions)}
        </Subheader>
        {sections.map((section, index) => (
          <Section
            key={section.id}
            first={index === 0}
            last={index === lastIndex}
            {...{ section, index, survey, disabled }}
          />
        ))}
      </>
    );
  }

  render() {
    const { survey, disabled, courseId, manager } = this.props;
    const managerToUse = manager ?? createDragDropManager(HTML5Backend);
    return (
      <DndProvider manager={managerToUse}>
        <SurveyDetails {...{ survey, courseId, disabled }} />
        {this.renderBody(survey)}
      </DndProvider>
    );
  }
}

SurveyShow.propTypes = {
  dispatch: PropTypes.func.isRequired,
  survey: surveyShape,
  intl: intlShape.isRequired,
  isLoading: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  courseId: PropTypes.string.isRequired,
  surveyId: PropTypes.string.isRequired,

  // Used for injecting dependencies for testing DnD
  manager: PropTypes.object,
};

const mapStateToProps = (state) => ({
  isLoading: state.surveysFlags.isLoadingSurvey,
  disabled: state.surveysFlags.disableSurveyShow,
});
export const ConnectedSurveyShow = connect(mapStateToProps)(
  injectIntl(SurveyShow),
);
export default ConnectedSurveyShow;
