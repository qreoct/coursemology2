/* eslint-disable import/no-unresolved, import/extensions, import/no-extraneous-dependencies */
import CourseAPI from 'api/course';
import pollJob from 'lib/helpers/job-helpers';
/* eslint-enable import/extensions, import/no-extraneous-dependencies, import/no-unresolved */
import actionTypes from '../constants';
import translations from '../translations';

const JOB_POLL_DELAY = 500;
const JOB_STAGGER_DELAY = 400;

export function setNotification(message, errors) {
  return {
    type: actionTypes.SET_NOTIFICATION,
    message,
    errors,
  };
}

/**
 * Prepares and maps answer value in the react-hook-form into server side format.
 * 1) In VoiceResponse, attribute answer.file is generated by component SingleFileInput.
 *    The data is in a format of { url, file, name }, and we only need to assign the file
 *    attribute into answer.file
 */
const formatAnswer = (answer) => {
  const newAnswer = { ...answer };
  // voice upload
  const fileObj = newAnswer.file;
  if (fileObj) {
    delete newAnswer.file;
    const { file } = fileObj;
    if (file) {
      newAnswer.file = file;
    }
  }
  return newAnswer;
};

const formatAnswers = (answers = {}) => {
  const newAnswers = [];
  Object.values(answers).forEach((answer) => {
    const newAnswer = formatAnswer(answer);
    newAnswers.push(newAnswer);
  });
  return newAnswers;
};

function buildErrorMessage(error) {
  if (!error || !error.response || !error.data) {
    return '';
  }

  if (typeof error.response.data.error === 'string') {
    return error.response.data.error;
  }

  return Object.values(error.response.data.errors)
    .reduce((flat, errors) => flat.concat(errors), [])
    .join(', ');
}

/**
 * Resets the following fields in react-hook-form
 * and sets their initialValue to this value
 */
const resetFields = (fields, id, resetField) => {
  Object.keys(fields).forEach(
    (fieldName) => {
      console.log(`reset ${id}.${fieldName} to `, fields[fieldName]);
      resetField(`${id}.${fieldName}`, {
        defaultValue: fields[fieldName],
      })
    }
  );
  console.log("reset fields successfully complete :)");
}

function getEvaluationResult(submissionId, answerId, questionId, resetField) {
  return (dispatch) => {
    CourseAPI.assessment.submissions
      .reloadAnswer(submissionId, { answer_id: answerId })
      .then((response) => response.data)
      .then((data) => {
        dispatch({
          type: actionTypes.AUTOGRADE_SUCCESS,
          payload: data,
          questionId,
        });
        if (resetField !== undefined) {
          resetFields(data.fields, answerId, resetField);
        }
      })
      .catch(() => {
        dispatch(setNotification(translations.requestFailure));
        dispatch({ type: actionTypes.AUTOGRADE_FAILURE, questionId });
      });
  };
}

export function fetchSubmission(id) {
  return (dispatch) => {
    dispatch({ type: actionTypes.FETCH_SUBMISSION_REQUEST });

    return CourseAPI.assessment.submissions
      .edit(id)
      .then((response) => response.data)
      .then((data) => {
        data.answers
          .filter((a) => a.autograding && a.autograding.path)
          .forEach((answer, index) => {
            setTimeout(() => {
              pollJob(
                answer.autograding.path,
                JOB_POLL_DELAY,
                () =>
                  dispatch(
                    getEvaluationResult(
                      id,
                      answer.fields.id,
                      answer.questionId,
                    ),
                  ),
                () =>
                  dispatch({
                    type: actionTypes.AUTOGRADE_FAILURE,
                    questionId: answer.questionId,
                  }),
              );
            }, JOB_STAGGER_DELAY * index);
          });

        dispatch({
          type: actionTypes.FETCH_SUBMISSION_SUCCESS,
          payload: data,
        });
      })
      .catch(() => dispatch({ type: actionTypes.FETCH_SUBMISSION_FAILURE }));
  };
}

export function autogradeSubmission(id) {
  return (dispatch) => {
    dispatch({ type: actionTypes.AUTOGRADE_SUBMISSION_REQUEST });

    return CourseAPI.assessment.submissions
      .autoGrade(id)
      .then((response) => response.data)
      .then((data) => {
        pollJob(
          data.redirect_url,
          JOB_POLL_DELAY,
          () => {
            dispatch({ type: actionTypes.AUTOGRADE_SUBMISSION_SUCCESS });
            fetchSubmission(id)(dispatch);
            dispatch(setNotification(translations.autogradeSubmissionSuccess));
          },
          () => dispatch({ type: actionTypes.AUTOGRADE_SUBMISSION_FAILURE }),
        );
      })
      .catch(() =>
        dispatch({ type: actionTypes.AUTOGRADE_SUBMISSION_FAILURE }),
      );
  };
}

export function saveDraft(submissionId, rawAnswers) {
  const answers = formatAnswers(rawAnswers);
  const payload = { submission: { answers } };
  return (dispatch) => {
    dispatch({ type: actionTypes.SAVE_DRAFT_REQUEST });

    return CourseAPI.assessment.submissions
      .update(submissionId, payload)
      .then((response) => response.data)
      .then((data) => {
        if (data.redirect_url && data.format === 'html') {
          window.location = data.redirect_url;
        }
        dispatch({ type: actionTypes.SAVE_DRAFT_SUCCESS, payload: data });
        dispatch(setNotification(translations.updateSuccess));
      })
      .catch((error) => {
        dispatch({ type: actionTypes.SAVE_DRAFT_FAILURE });
        dispatch(
          setNotification(translations.updateFailure, buildErrorMessage(error)),
        );
      });
  };
}

export function finalise(submissionId, rawAnswers) {
  const answers = formatAnswers(rawAnswers);
  const payload = { submission: { answers, finalise: true } };
  return (dispatch) => {
    dispatch({ type: actionTypes.FINALISE_REQUEST });

    return CourseAPI.assessment.submissions
      .update(submissionId, payload)
      .then((response) => response.data)
      .then((data) => {
        if (data.redirect_url && data.format === 'html') {
          window.location = data.redirect_url;
        }
        dispatch({ type: actionTypes.FINALISE_SUCCESS, payload: data });
        dispatch(setNotification(translations.updateSuccess));
      })
      .catch((error) => {
        dispatch({ type: actionTypes.FINALISE_FAILURE });
        dispatch(
          setNotification(translations.updateFailure, buildErrorMessage(error)),
        );
      });
  };
}

export function unsubmit(submissionId) {
  const payload = { submission: { unsubmit: true } };
  return (dispatch) => {
    dispatch({ type: actionTypes.UNSUBMIT_REQUEST });

    return CourseAPI.assessment.submissions
      .update(submissionId, payload)
      .then((response) => response.data)
      .then((data) => {
        dispatch({ type: actionTypes.UNSUBMIT_SUCCESS, payload: data });
        dispatch(setNotification(translations.updateSuccess));
      })
      .catch((error) => {
        dispatch({ type: actionTypes.UNSUBMIT_FAILURE });
        dispatch(
          setNotification(translations.updateFailure, buildErrorMessage(error)),
        );
      });
  };
}

export function submitAnswer(submissionId, answerId, rawAnswer, resetField) {
  const answer = formatAnswer(rawAnswer);
  const payload = { answer };
  const questionId = answer.questionId;

  return (dispatch) => {
    dispatch({ type: actionTypes.AUTOGRADE_REQUEST, questionId });

    return CourseAPI.assessment.submissions
      .submitAnswer(submissionId, payload)
      .then((response) => response.data)
      .then((data) => {
        if (data.redirect_url && data.format === 'html') {
          window.location = data.redirect_url;
        } else if (data.redirect_url) {
          pollJob(
            data.redirect_url,
            JOB_POLL_DELAY,
            () =>
              dispatch(
                getEvaluationResult(submissionId, answer.id, questionId, resetField),
              ),
            (errorData) => {
              dispatch({
                type: actionTypes.AUTOGRADE_FAILURE,
                questionId,
                payload: errorData,
              });
              dispatch(setNotification(translations.requestFailure));
            },
          )
        } else {
          dispatch({
            type: actionTypes.AUTOGRADE_SUCCESS,
            payload: data,
            questionId,
          });
          // When an answer is submitted, the value of that field needs to be updated.
          // setValue(`${answerId}`, data.fields);
          
          // When an answer is submitted, update default value of field for form
          // Need to individually reset fields https://github.com/react-hook-form/react-hook-form/issues/7841
          resetFields(data.fields, answerId, resetField);
        }
      })
      .catch(() => {
        dispatch({ type: actionTypes.AUTOGRADE_FAILURE, questionId });
        dispatch(setNotification(translations.requestFailure));
      });
  };
}

export function resetAnswer(submissionId, answerId, questionId, setValue) {
  const payload = { answer_id: answerId, reset_answer: true };
  return (dispatch) => {
    dispatch({ type: actionTypes.RESET_REQUEST, questionId });

    return CourseAPI.assessment.submissions
      .reloadAnswer(submissionId, payload)
      .then((response) => response.data)
      .then((data) => {
        dispatch({
          type: actionTypes.RESET_SUCCESS,
          payload: data,
          questionId,
        });
        setValue(`${answerId}`, data.fields);
        // resetFields(data.fields, answerId, resetField);
      })
      .catch(() => dispatch({ type: actionTypes.RESET_FAILURE, questionId }));
  };
}

export function deleteFile(answerId, fileId, answers, setValue) {
  const answer = Object.values(answers).find((ans) => ans.id === answerId);
  const payload = { answer: { id: answerId, file_id: fileId } };

  return (dispatch) => {
    dispatch({ type: actionTypes.DELETE_FILE_REQUEST });

    return CourseAPI.assessment.answer.programming
      .deleteProgrammingFile(answerId, payload)
      .then((response) => response.data)
      .then((data) => {
        const responsePayload = { questionId: answer.questionId, answer: data };
        dispatch({
          type: actionTypes.DELETE_FILE_SUCCESS,
          payload: responsePayload,
        });

        // When an uploaded programming file is deleted, we need to update the field value
        // excluding the deleted file.
        const newFilesAttributes = answer.files_attributes.filter(
          (file) => file.id !== fileId,
        );
        setValue(`${answerId}.files_attributes`, newFilesAttributes);

        dispatch(setNotification(translations.deleteFileSuccess));
      })
      .catch((error) => {
        dispatch({ type: actionTypes.DELETE_FILE_FAILURE });
        dispatch(
          setNotification(
            translations.deleteFileFailure,
            buildErrorMessage(error),
          ),
        );
      });
  };
}

// Ensure that there are no existing files with the same filenames
function validateFiles(files) {
  const filenames = files.map((file) => file.filename);
  const uniqueFilenames = filenames.filter(
    (name, index, self) => self.indexOf(name) === index,
  );
  return filenames.length === uniqueFilenames.length;
}

// Used to ensure that only java files can be uploaded.
function validateJavaFiles(files) {
  const regex = new RegExp('\\.java');
  return files.filter((file) => !regex.test(file.filename)).length === 0;
}

// Imports staged files into the question to be evaluated
export function importFiles(answerId, answerFields, language, setValue) {
  const answer = Object.values(answerFields).find((ans) => ans.id === answerId);
  const files = answerFields[answerId].files_attributes;
  const payload = { answer: { id: answerId, ...answer } };

  return (dispatch) => {
    dispatch({ type: actionTypes.IMPORT_FILES_REQUEST });

    if (!validateFiles(files)) {
      dispatch({ type: actionTypes.IMPORT_FILES_FAILURE });
      dispatch(setNotification(translations.similarFileNameExists));
    } else if (language === 'Java' && !validateJavaFiles(files)) {
      dispatch({ type: actionTypes.IMPORT_FILES_FAILURE });
      dispatch(setNotification(translations.invalidJavaFileUpload));
    } else {
      CourseAPI.assessment.answer.programming
        .createProgrammingFiles(answerId, payload)
        .then((response) => response.data)
        .then((data) => {
          dispatch({ type: actionTypes.IMPORT_FILES_SUCCESS, payload: data });

          // When multiple programming files are successfully uploaded,
          // the value of that fields needs to be updated.
          // Moreover, as the files were previously staged, we need to
          // mark the files as unstaged now so that the editors for the uploaded files
          // can appear.
          const newFilesAttributes = data.fields.files_attributes.map(
            (file) => ({ ...file, staged: false }),
          );
          setValue(`${answerId}.files_attributes`, newFilesAttributes);
          // import_files field is reset to remove files from dropbox.
          setValue(`${answerId}.import_files`, []);

          dispatch(setNotification(translations.importFilesSuccess));
        })
        .catch((error) => {
          dispatch({ type: actionTypes.IMPORT_FILES_FAILURE });
          dispatch(
            setNotification(
              translations.importFilesFailure,
              buildErrorMessage(error),
            ),
          );
        });
    }
  };
}

export function saveGrade(submissionId, grades, exp, published) {
  const expParam = published ? 'points_awarded' : 'draft_points_awarded';
  const payload = {
    submission: {
      answers: grades,
      [expParam]: exp,
    },
  };

  return (dispatch) => {
    dispatch({ type: actionTypes.SAVE_GRADE_REQUEST });

    return CourseAPI.assessment.submissions
      .update(submissionId, payload)
      .then((response) => response.data)
      .then((data) => {
        dispatch({ type: actionTypes.SAVE_GRADE_SUCCESS, payload: data });
        dispatch(setNotification(translations.updateSuccess));
      })
      .catch((error) => {
        dispatch({ type: actionTypes.SAVE_GRADE_FAILURE });
        dispatch(
          setNotification(translations.updateFailure, buildErrorMessage(error)),
        );
      });
  };
}

export function mark(submissionId, grades, exp) {
  const payload = {
    submission: {
      answers: grades,
      draft_points_awarded: exp,
      mark: true,
    },
  };

  return (dispatch) => {
    dispatch({ type: actionTypes.MARK_REQUEST });

    return CourseAPI.assessment.submissions
      .update(submissionId, payload)
      .then((response) => response.data)
      .then((data) => {
        dispatch({ type: actionTypes.MARK_SUCCESS, payload: data });
        dispatch(setNotification(translations.updateSuccess));
      })
      .catch((error) => {
        dispatch({ type: actionTypes.MARK_FAILURE });
        dispatch(
          setNotification(translations.updateFailure, buildErrorMessage(error)),
        );
      });
  };
}

export function unmark(submissionId) {
  const payload = { submission: { unmark: true } };
  return (dispatch) => {
    dispatch({ type: actionTypes.UNMARK_REQUEST });

    return CourseAPI.assessment.submissions
      .update(submissionId, payload)
      .then((response) => response.data)
      .then((data) => {
        dispatch({ type: actionTypes.UNMARK_SUCCESS, payload: data });
        dispatch(setNotification(translations.updateSuccess));
      })
      .catch((error) => {
        dispatch({ type: actionTypes.UNMARK_FAILURE });
        dispatch(
          setNotification(translations.updateFailure, buildErrorMessage(error)),
        );
      });
  };
}

export function publish(submissionId, grades, exp) {
  const payload = {
    submission: {
      answers: grades,
      draft_points_awarded: exp,
      publish: true,
    },
  };
  return (dispatch) => {
    dispatch({ type: actionTypes.PUBLISH_REQUEST });

    return CourseAPI.assessment.submissions
      .update(submissionId, payload)
      .then((response) => response.data)
      .then((data) => {
        dispatch({ type: actionTypes.PUBLISH_SUCCESS, payload: data });
        dispatch(setNotification(translations.updateSuccess));
      })
      .catch((error) => {
        dispatch({ type: actionTypes.PUBLISH_FAILURE });
        dispatch(
          setNotification(
            translations.getPastAnswersFailure,
            buildErrorMessage(error),
          ),
        );
      });
  };
}

export function setRecording(payload = {}) {
  const { recordingComponentId } = payload;
  return (dispatch) =>
    dispatch({
      type: actionTypes.RECORDER_SET_RECORDING,
      payload: { recordingComponentId },
    });
}

export function setNotRecording() {
  return (dispatch) => dispatch({ type: actionTypes.RECORDER_SET_UNRECORDING });
}

export function recorderComponentMount() {
  return (dispatch) => dispatch({ type: actionTypes.RECORDER_COMPONENT_MOUNT });
}

export function recorderComponentUnmount() {
  return (dispatch) =>
    dispatch({ type: actionTypes.RECORDER_COMPONENT_UNMOUNT });
}

export function enterStudentView() {
  return (dispatch) => {
    dispatch({ type: actionTypes.ENTER_STUDENT_VIEW });
  };
}

export function exitStudentView() {
  return (dispatch) => {
    dispatch({ type: actionTypes.EXIT_STUDENT_VIEW });
  };
}

export function toggleViewHistoryMode(
  viewHistory,
  submissionQuestionId,
  questionId,
  answersLoaded,
) {
  return (dispatch) => {
    if (!answersLoaded) {
      dispatch({
        type: actionTypes.GET_PAST_ANSWERS_REQUEST,
        payload: { questionId },
      });

      CourseAPI.assessment.submissionQuestions
        .getPastAnswers(submissionQuestionId)
        .then((response) => response.data)
        .then((data) => {
          dispatch({
            type: actionTypes.GET_PAST_ANSWERS_SUCCESS,
            payload: { answers: data.answers, questionId },
          });
          dispatch({
            type: actionTypes.TOGGLE_VIEW_HISTORY_MODE,
            payload: { viewHistory, questionId },
          });
        })
        .catch((error) => {
          dispatch({
            type: actionTypes.GET_PAST_ANSWERS_FAILURE,
            payload: { questionId },
          });
          dispatch(
            setNotification(
              translations.getPastAnswersFailure,
              buildErrorMessage(error),
            ),
          );
        });
    } else {
      dispatch({
        type: actionTypes.TOGGLE_VIEW_HISTORY_MODE,
        payload: { viewHistory, questionId },
      });
    }
  };
}
