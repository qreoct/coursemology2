import actions from '../constants';

// Extract answer values from JSON response
function buildInitialValues(answers) {
  return answers.reduce(
    (obj, answer) => ({
      ...obj,
      [answer.fields.id]: answer.fields,
    }),
    {},
  );
}

function buildAnswerStatus(answers) {
  return answers.reduce(
    (obj, answer) => ({
      ...obj,
      [answer.fields.questionId]: {
        isLatestAnswer: answer.answerStatus.isLatestAnswer,
      },
    }),
    {},
  );
}

const initialState = {
  initial: {},
  status: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_SUBMISSION_SUCCESS:
    case actions.SAVE_DRAFT_SUCCESS:
    case actions.FINALISE_SUCCESS:
    case actions.UNSUBMIT_SUCCESS:
    case actions.SAVE_GRADE_SUCCESS:
    case actions.MARK_SUCCESS:
    case actions.UNMARK_SUCCESS:
    case actions.PUBLISH_SUCCESS: {
      const initialValues = buildInitialValues(action.payload.answers);
      const answerStatus = buildAnswerStatus(action.payload.answers);
      return {
        ...state,
        initial: initialValues,
        status: {
          ...state.status,
          ...answerStatus
        },
      };
    }
    case actions.IMPORT_FILES_SUCCESS:
    case actions.AUTOGRADE_SUCCESS:
    case actions.RESET_SUCCESS:
    case actions.DELETE_FILE_SUCCESS: {
      const answerStatus = buildAnswerStatus([action.payload]);
      return {
        ...state,
        status: {
          ...state.status,
          ...answerStatus
        },
      };
    }
    default:
      return state;
  }
}
