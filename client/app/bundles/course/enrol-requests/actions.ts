import {
  ManageCourseUsersPermissions,
  ManageCourseUsersSharedData,
} from 'types/course/course_users';
import { EnrolRequestData } from 'types/course/enrol_requests';
import {
  SaveEnrolRequestsListAction,
  SAVE_ENROL_REQUESTS_LIST,
  UpdateEnrolRequestAction,
  UPDATE_ENROL_REQUEST,
} from './types';

export function saveEnrolRequestsList(
  enrolRequestsList: EnrolRequestData[],
  manageCourseUsersPermissions: ManageCourseUsersPermissions,
  manageCourseUsersData: ManageCourseUsersSharedData,
): SaveEnrolRequestsListAction {
  return {
    type: SAVE_ENROL_REQUESTS_LIST,
    enrolRequestsList,
    manageCourseUsersPermissions,
    manageCourseUsersData,
  };
}

export function updateEnrolRequest(
  enrolRequest: EnrolRequestData,
): UpdateEnrolRequestAction {
  return {
    type: UPDATE_ENROL_REQUEST,
    enrolRequest,
  };
}
