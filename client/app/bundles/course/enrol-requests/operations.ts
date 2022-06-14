import CourseAPI from 'api/course';
import {
  EnrolRequestData,
  ApproveEnrolRequestPatchData,
} from 'types/course/enrol_requests';
import { Operation } from 'types/store';
import * as actions from './actions';

const formatAttributes = (
  data: EnrolRequestData,
): ApproveEnrolRequestPatchData => {
  const payload = {
    course_user: {
      name: data.name,
      phantom: data.phantom, // will be undefined if user doesn't change
      role: data.role, // will be undefined if user doesn't change
      timeline_algorithm: data.timelineAlgorithm, // will be undefined if user doesn't change
    },
  };
  return payload;
};

export function fetchEnrolRequests(): Operation<void> {
  return async (dispatch) =>
    CourseAPI.enrolRequests
      .index()
      .then((response) => {
        const data = response.data;
        dispatch(
          actions.saveEnrolRequestsList(
            data.enrolRequests,
            data.permissions,
            data.manageCourseUsersData,
          ),
        );
      })
      .catch((error) => {
        throw error;
      });
}

export function approveEnrolRequest(
  enrolRequest: EnrolRequestData,
): Operation<void> {
  return async (dispatch) => {
    const enrolRequestData = formatAttributes(enrolRequest);
    CourseAPI.enrolRequests
      .approve(enrolRequestData, enrolRequest.id)
      .then((response) => {
        const enrolRequestToUpdate = response.data;
        dispatch(actions.updateEnrolRequest(enrolRequestToUpdate));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function rejectEnrolRequest(requestId: number): Operation<void> {
  return async (dispatch) =>
    CourseAPI.enrolRequests
      .reject(requestId)
      .then((response) => {
        const enrolRequest = response.data;
        dispatch(actions.updateEnrolRequest(enrolRequest));
      })
      .catch((error) => {
        throw error;
      });
}
