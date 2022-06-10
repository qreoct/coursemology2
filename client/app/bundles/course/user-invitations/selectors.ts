/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  ManageCourseUsersPermissions,
  ManageCourseUsersTabData,
} from 'types/course/course_users';
import { AppState } from 'types/store';
import { selectEntities } from 'utilities/store';

function getLocalState(state: AppState) {
  return state.invitations;
}

export function getAllInvitationsEntities(state: AppState) {
  console.log('local state:', getLocalState(state).invitations);
  return selectEntities(
    getLocalState(state).invitations,
    getLocalState(state).invitations.ids,
  );
}

export function getManageCourseUserPermissions(state: AppState) {
  return getLocalState(state).permissions as ManageCourseUsersPermissions;
}

export function getManageCourseUsersTabData(state: AppState) {
  return getLocalState(state).manageCourseUsersData as ManageCourseUsersTabData;
}

export function getCourseRegistrationKey(state: AppState) {
  return getLocalState(state).courseRegistrationKey;
}
