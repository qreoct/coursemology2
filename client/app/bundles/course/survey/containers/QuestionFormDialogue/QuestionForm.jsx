import { Component } from 'react';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import MenuItem from 'material-ui/MenuItem';
import Subheader from 'material-ui/Subheader';
import DisplayTextField from 'material-ui/TextField';
import PropTypes from 'prop-types';
import { Field, FieldArray, Form, reduxForm } from 'redux-form';

import { formNames, questionTypes } from 'course/survey/constants';
import translations from 'course/survey/translations';
import SelectField from 'lib/components/redux-form/SelectField';
import TextField from 'lib/components/redux-form/TextField';
import Toggle from 'lib/components/redux-form/Toggle';
import formTranslations from 'lib/translations/form';

import QuestionFormDeletedOptions from './QuestionFormDeletedOptions';
import QuestionFormOptions from './QuestionFormOptions';

const styles = {
  questionType: {
    width: '50%',
  },
  numberOfResponsesDiv: {
    display: 'flex',
  },
  numberOfResponsesField: {
    style: { flex: 1 },
    inputStyle: { width: '80%' },
    underlineStyle: { width: '80%' },
  },
  toggle: {
    marginTop: 10,
  },
  hint: {
    fontSize: 14,
    marginBottom: 12,
  },
};

const questionFormTranslations = defineMessages({
  required: {
    id: 'course.surveys.QuestionForm.required',
    defaultMessage: 'Required',
  },
  requiredHint: {
    id: 'course.surveys.QuestionForm.requiredHint',
    defaultMessage:
      'When selected, student must answer this question in order to complete the survey.',
  },
  gridView: {
    id: 'course.surveys.QuestionForm.gridView',
    defaultMessage: 'Grid View',
  },
  gridViewHint: {
    id: 'course.surveys.QuestionForm.gridViewHint',
    defaultMessage:
      'When selected, question options will be display as grid instead of a list. \
      This option is meant for questions with images as options.',
  },
  lessThanFilledOptions: {
    id: 'course.surveys.QuestionForm.lessThanFilledOptions',
    defaultMessage: 'Should be less than the valid option count',
  },
  noMoreThanFilledOptions: {
    id: 'course.surveys.QuestionForm.noMoreThanFilledOptions',
    defaultMessage: 'Should not be more than the valid option count',
  },
  atLeastOne: {
    id: 'course.surveys.QuestionForm.atLeastOne',
    defaultMessage: 'Should be at least 1',
  },
  atLeastZero: {
    id: 'course.surveys.QuestionForm.atLeastZero',
    defaultMessage: 'Should be at least 0',
  },
  notLessThanMin: {
    id: 'course.surveys.QuestionForm.notLessThanMin',
    defaultMessage: 'Should not be less than minimum',
  },
  noRestriction: {
    id: 'course.surveys.QuestionForm.noRestriction',
    defaultMessage: 'No Restriction',
  },
  optionCount: {
    id: 'course.surveys.QuestionForm.optionCount',
    defaultMessage: 'Valid Option Count',
  },
  optionsToKeep: {
    id: 'course.surveys.QuestionForm.optionsToKeep',
    defaultMessage: 'Options To Keep',
  },
  optionsToDelete: {
    id: 'course.surveys.QuestionForm.optionsToDelete',
    defaultMessage: 'Options To Delete',
  },
});

const countFilledOptions = (options) =>
  options.filter(
    (option) => option && (option.option || option.file || option.image_url),
  ).length;

const validate = (values) => {
  const { MULTIPLE_CHOICE, MULTIPLE_RESPONSE } = questionTypes;
  const errors = {};

  const requiredFields = ['question_type', 'description'];
  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = formTranslations.required;
    }
  });

  const filledOptions = countFilledOptions(values.options);
  if (
    (values.question_type === MULTIPLE_CHOICE ||
      values.question_type === MULTIPLE_RESPONSE) &&
    filledOptions < 1
  ) {
    errors.options = [{ option: formTranslations.required }];
  }

  if (values.question_type === MULTIPLE_RESPONSE && values.min_options) {
    if (values.min_options >= filledOptions) {
      errors.min_options = questionFormTranslations.lessThanFilledOptions;
    } else if (values.min_options < 0) {
      errors.min_options = questionFormTranslations.atLeastZero;
    }
  }

  if (values.question_type === MULTIPLE_RESPONSE && values.max_options) {
    if (values.max_options < 1) {
      errors.max_options = questionFormTranslations.atLeastOne;
    } else if (values.max_options > filledOptions) {
      errors.max_options = questionFormTranslations.noMoreThanFilledOptions;
    } else if (values.min_options && values.min_options > values.max_options) {
      errors.max_options = questionFormTranslations.notLessThanMin;
    }
  }

  return errors;
};

class QuestionForm extends Component {
  renderMultipleChoiceFields() {
    return (
      <div>
        {this.renderTiledViewToggle()}
        {this.renderValidOptionCount()}
        {this.renderOptionFields({ multipleChoice: true })}
      </div>
    );
  }

  renderMultipleResponseFields() {
    const { intl } = this.props;
    return (
      <div>
        {this.renderTiledViewToggle()}
        <div style={styles.numberOfResponsesDiv}>
          {this.renderValidOptionCount()}
          {this.renderNumberOfResponsesField(
            'min_options',
            intl.formatMessage(translations.minOptions),
          )}
          {this.renderNumberOfResponsesField(
            'max_options',
            intl.formatMessage(translations.maxOptions),
          )}
        </div>
        {this.renderOptionFields({ multipleResponse: true })}
      </div>
    );
  }

  renderNumberOfResponsesField(name, floatingLabelText) {
    const { intl, disabled } = this.props;
    return (
      <Field
        component={TextField}
        type="number"
        {...styles.numberOfResponsesField}
        placeholder={intl.formatMessage(questionFormTranslations.noRestriction)}
        {...{ name, floatingLabelText, disabled }}
      />
    );
  }

  renderOptionFields(props) {
    const { disabled, addToOptionsToDelete } = this.props;

    return (
      <div>
        {this.renderOptionsToDelete(props)}
        <FieldArray
          component={QuestionFormOptions}
          name="options"
          {...{ disabled, addToOptionsToDelete }}
          {...props}
        />
      </div>
    );
  }

  renderOptionsToDelete(props) {
    const { intl, disabled, formValues, addToOptions } = this.props;
    if (
      formValues &&
      // eslint-disable-next-line react/prop-types
      formValues.optionsToDelete &&
      // eslint-disable-next-line react/prop-types
      formValues.optionsToDelete.length > 0
    ) {
      return (
        <div>
          <Subheader>
            {intl.formatMessage(questionFormTranslations.optionsToDelete)}
          </Subheader>
          <FieldArray
            component={QuestionFormDeletedOptions}
            name="optionsToDelete"
            {...{ disabled, addToOptions }}
            {...props}
          />
          <Subheader>
            {intl.formatMessage(questionFormTranslations.optionsToKeep)}
          </Subheader>
        </div>
      );
    }
    return null;
  }

  renderSpecificFields(questionType) {
    const { MULTIPLE_CHOICE, MULTIPLE_RESPONSE } = questionTypes;
    const renderer = {
      [MULTIPLE_CHOICE]: this.renderMultipleChoiceFields,
      [MULTIPLE_RESPONSE]: this.renderMultipleResponseFields,
    }[questionType];

    return renderer ? renderer.call(this) : null;
  }

  renderTiledViewToggle() {
    const { intl, disabled } = this.props;
    return (
      <>
        <Field
          component={Toggle}
          label={intl.formatMessage(questionFormTranslations.gridView)}
          labelPosition="right"
          name="grid_view"
          parse={Boolean}
          style={styles.toggle}
          {...{ disabled }}
        />
        <p style={styles.hint}>
          {intl.formatMessage(questionFormTranslations.gridViewHint)}
        </p>
      </>
    );
  }

  renderValidOptionCount() {
    const { intl, formValues } = this.props;
    const numberOfFilledOptions = formValues
      ? // eslint-disable-next-line react/prop-types
        countFilledOptions(formValues.options)
      : 0;

    return (
      <DisplayTextField
        disabled={true}
        name="filled_options"
        value={numberOfFilledOptions}
        {...styles.numberOfResponsesField}
        floatingLabelText={intl.formatMessage(
          questionFormTranslations.optionCount,
        )}
      />
    );
  }

  render() {
    const { handleSubmit, intl, onSubmit, disabled, formValues } = this.props;
    const { TEXT, MULTIPLE_CHOICE, MULTIPLE_RESPONSE } = questionTypes;
    const questionType = formValues && formValues.question_type;

    return (
      <Form encType="multipart/form-data" onSubmit={handleSubmit(onSubmit)}>
        <Field
          component={SelectField}
          floatingLabelText={intl.formatMessage(translations.questionType)}
          name="question_type"
          style={styles.questionType}
          {...{ disabled }}
        >
          <MenuItem
            primaryText={intl.formatMessage(translations.textResponse)}
            value={TEXT}
          />
          <MenuItem
            primaryText={intl.formatMessage(translations.multipleChoice)}
            value={MULTIPLE_CHOICE}
          />
          <MenuItem
            primaryText={intl.formatMessage(translations.multipleResponse)}
            value={MULTIPLE_RESPONSE}
          />
        </Field>
        <Field
          component={TextField}
          floatingLabelText={intl.formatMessage(translations.questionText)}
          fullWidth={true}
          multiLine={true}
          name="description"
          rows={2}
          {...{ disabled }}
        />
        <Field
          component={Toggle}
          label={intl.formatMessage(questionFormTranslations.required)}
          labelPosition="right"
          name="required"
          parse={Boolean}
          style={styles.toggle}
          {...{ disabled }}
        />
        <p style={styles.hint}>
          {intl.formatMessage(questionFormTranslations.requiredHint)}
        </p>
        {this.renderSpecificFields(questionType)}
      </Form>
    );
  }
}

QuestionForm.propTypes = {
  formValues: PropTypes.shape({
    question_type: PropTypes.string,
  }),
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  addToOptions: PropTypes.func.isRequired,
  addToOptionsToDelete: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  disabled: PropTypes.bool,
};

export default reduxForm({
  form: formNames.SURVEY_QUESTION,
  validate,
})(injectIntl(QuestionForm));
