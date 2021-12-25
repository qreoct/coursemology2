import {
  defineMessages,
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import { Field, Form, reduxForm } from 'redux-form';

import { formNames } from 'course/survey/constants';
import translations from 'course/survey/translations';
import DateTimePicker from 'lib/components/redux-form/DateTimePicker';
import TextField from 'lib/components/redux-form/TextField';
import Toggle from 'lib/components/redux-form/Toggle';
import formTranslations from 'lib/translations/form';

const styles = {
  columns: {
    display: 'flex',
  },
  oneColumn: {
    flex: 1,
  },
  toggle: {
    marginTop: 16,
  },
  hint: {
    fontSize: 14,
    marginBottom: 12,
  },
};

const surveyFormTranslations = defineMessages({
  startEndValidationError: {
    id: 'course.surveys.SurveyForm.startEndValidationError',
    defaultMessage: "Must be after 'Opens At'",
  },
  allowResponseAfterEndHint: {
    id: 'course.surveys.SurveyForm.allowResponseAfterEndHint',
    defaultMessage:
      'Allow students to submit responses after the survey has expired. \
      If this is enabled, students who submit before the deadline will get both the base and bonus \
      points, whereas students who submit after the deadline will only be awarded the base points.',
  },
  allowModifyAfterSubmitHint: {
    id: 'course.surveys.SurveyForm.allowModifyAfterSubmitHint',
    defaultMessage:
      'Allow students to modify their responses after they have submitted it. If \
      this is disabled, you will have to manually unsubmit their responses to allow them to \
      edit it.',
  },
  anonymousHint: {
    id: 'course.surveys.SurveyForm.anonymousHint',
    defaultMessage:
      'If you make the survey anonymous, you will be able to see aggregate survey \
      results but not individual responses. You may not toggle this setting once there is one \
      or more student submissions.',
  },
  hasStudentResponse: {
    id: 'course.surveys.SurveyForm.hasStudentResponse',
    defaultMessage:
      'At least one student has responded to this survey. You may not remove anonymity.',
  },
  timeBonusExpTooltip: {
    id: 'course.surveys.SurveyForm.timeBonusExpTooltip',
    defaultMessage:
      'You must allow responses after the survey expires to set bonus points.',
  },
});

const validate = (values) => {
  const errors = {};

  const requiredFields = ['title', 'start_at'];
  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = formTranslations.required;
    }
  });

  if (values.end_at && new Date(values.start_at) >= new Date(values.end_at)) {
    errors.end_at = surveyFormTranslations.startEndValidationError;
  }

  if (values.allow_response_after_end && !values.end_at) {
    errors.end_at = formTranslations.required;
  }

  return errors;
};

const propTypes = {
  formValues: PropTypes.shape({
    start_at: PropTypes.instanceOf(Date),
    end_at: PropTypes.instanceOf(Date),
    allow_response_after_end: PropTypes.bool,
  }),
  shiftEndDate: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  disableAnonymousToggle: PropTypes.bool,
  disabled: PropTypes.bool,
};

const SurveyForm = ({
  handleSubmit,
  intl,
  onSubmit,
  disabled,
  disableAnonymousToggle,
  shiftEndDate,
  formValues,
}) => (
  <Form onSubmit={handleSubmit(onSubmit)}>
    <Field
      component={TextField}
      floatingLabelText={intl.formatMessage(translations.title)}
      fullWidth={true}
      name="title"
      {...{ disabled }}
    />
    <br />
    <Field
      component={TextField}
      floatingLabelText={intl.formatMessage(translations.description)}
      fullWidth={true}
      multiLine={true}
      name="description"
      rows={2}
      {...{ disabled }}
    />
    <div style={styles.columns}>
      <Field
        afterChange={(_, newStartAt) =>
          shiftEndDate(formNames.SURVEY, newStartAt, formValues)
        }
        component={DateTimePicker}
        floatingLabelText={intl.formatMessage(translations.opensAt)}
        name="start_at"
        style={styles.oneColumn}
        {...{ disabled }}
      />
      <Field
        component={DateTimePicker}
        floatingLabelText={intl.formatMessage(translations.expiresAt)}
        name="end_at"
        style={styles.oneColumn}
        {...{ disabled }}
      />
    </div>
    <div style={styles.columns}>
      <div style={styles.oneColumn}>
        <Field
          component={TextField}
          floatingLabelText={intl.formatMessage(translations.basePoints)}
          name="base_exp"
          onWheel={(event) => event.currentTarget.blur()}
          type="number"
          {...{ disabled }}
        />
      </div>
      <div
        data-for="timeBonusExpTooltip"
        data-tip={true}
        data-tip-disable={formValues && formValues.allow_response_after_end}
        style={styles.oneColumn}
      >
        <Field
          component={TextField}
          disabled={formValues && !formValues.allow_response_after_end}
          floatingLabelText={intl.formatMessage(translations.bonusPoints)}
          name="time_bonus_exp"
          onWheel={(event) => event.currentTarget.blur()}
          type="number"
        />
        <ReactTooltip id="timeBonusExpTooltip">
          <FormattedMessage {...surveyFormTranslations.timeBonusExpTooltip} />
        </ReactTooltip>
      </div>
    </div>
    <Field
      component={Toggle}
      disabled={disabled}
      label={intl.formatMessage(translations.allowResponseAfterEnd)}
      labelPosition="right"
      name="allow_response_after_end"
      parse={Boolean}
      style={styles.toggle}
    />
    <div style={styles.hint}>
      {intl.formatMessage(surveyFormTranslations.allowResponseAfterEndHint)}
    </div>
    <Field
      component={Toggle}
      disabled={disabled}
      label={intl.formatMessage(translations.allowModifyAfterSubmit)}
      labelPosition="right"
      name="allow_modify_after_submit"
      parse={Boolean}
      style={styles.toggle}
    />
    <div style={styles.hint}>
      {intl.formatMessage(surveyFormTranslations.allowModifyAfterSubmitHint)}
    </div>
    <Field
      component={Toggle}
      disabled={disableAnonymousToggle || disabled}
      label={intl.formatMessage(translations.anonymous)}
      labelPosition="right"
      name="anonymous"
      parse={Boolean}
      style={styles.toggle}
    />
    <div style={styles.hint}>
      {disableAnonymousToggle
        ? intl.formatMessage(surveyFormTranslations.hasStudentResponse)
        : intl.formatMessage(surveyFormTranslations.anonymousHint)}
    </div>
  </Form>
);

SurveyForm.propTypes = propTypes;

export default reduxForm({
  form: formNames.SURVEY,
  validate,
})(injectIntl(SurveyForm));
