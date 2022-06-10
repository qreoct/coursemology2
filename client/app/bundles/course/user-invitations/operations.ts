import CourseAPI from 'api/course';
import { AxiosResponse } from 'axios';
import {
  InvitationFileEntity,
  InvitationMessage,
} from 'types/course/user_invitations';
import { Operation } from 'types/store';
import * as actions from './actions';

/**
 * Prepares and maps answer value in the react-hook-form into server side format.
 *
 * @param answers
 * @returns
 */
const formatInvitations = (invitations): FormData => {
  const payload = new FormData();

  invitations.forEach((invite, index) => {
    ['name', 'email', 'role', 'phantom', 'timelineAlgorithm'].forEach(
      (field) => {
        if (invite[field] !== undefined && invite[field] !== null) {
          let fieldName = field;
          let value = invite[field];
          if (field === 'timelineAlgorithm') {
            fieldName = 'timeline_algorithm';
          }
          if (field === 'phantom') {
            value = value ? 1 : 0;
          }
          payload.append(
            `course[invitations_attributes][${index}][${fieldName}]`,
            value,
          );
        }
      },
    );
  });
  return payload;

  // console.log('invitations:', invitations);
  // const newInvitations: CourseInvitationPostData = {
  //   invitations_attributes: [],
  // };
  // Object.values(invitations).forEach((invite: any) => {
  //   const newInvite = {
  //     name: invite.name,
  //     email: invite.email,
  //     role: invite.role,
  //     phantom: invite.phantom,
  //     timeline_algorithm: invite.timelineAlgori,
  //   };
  //   console.log('newInvite:', newInvite);
  //   newInvitations.invitations_attributes.push(newInvite);
  // });
  // console.log('newInvitations:', newInvitations);
  // return newInvitations;
};

export function fetchInvitations(): Operation<void> {
  return async (dispatch) =>
    CourseAPI.userInvitations
      .index()
      .then((response) => {
        const data = response.data;
        dispatch(
          actions.saveInvitationList(
            data.invitations,
            data.permissions,
            data.manageCourseUsersData,
          ),
        );
      })
      .catch((error) => {
        throw error;
      });
}

export function inviteUsersFromFile(
  formData: InvitationFileEntity,
): Operation<InvitationMessage> {
  const file = formData.file;
  return async (dispatch) =>
    CourseAPI.userInvitations.invite(file).then((response) => {
      const data = response.data;
      dispatch(
        actions.saveInvitationList(
          data.invitations,
          data.permissions,
          data.manageCourseUsersData,
        ),
      );
      return data.message;
    });
}

export function inviteUsersFromForm(
  formData: any,
): Operation<InvitationMessage> {
  const formattedData = formatInvitations(formData.invitations);
  return async (dispatch) =>
    CourseAPI.userInvitations.invite(formattedData).then((response) => {
      const data = response.data;
      dispatch(
        actions.saveInvitationList(
          data.invitations,
          data.permissions,
          data.manageCourseUsersData,
        ),
      );
      return data.message;
    });
}

export function resendAllInvitations(): Operation<AxiosResponse<any, any>> {
  return async (_) =>
    CourseAPI.userInvitations.resendAllInvitations().catch((error) => {
      throw error;
    });
}

export function resendInvitationEmail(
  invitationId: number,
): Operation<AxiosResponse<any, any>> {
  return async (_) =>
    CourseAPI.userInvitations
      .resendInvitationEmail(invitationId)
      .catch((error) => {
        throw error;
      });
}

export function deleteInvitation(invitationId: number): Operation<void> {
  return async (dispatch) =>
    CourseAPI.userInvitations.delete(invitationId).then(() => {
      dispatch(actions.deleteInvitation(invitationId));
    });
}

export function fetchRegistrationCode(): Operation<void> {
  return async (dispatch) =>
    CourseAPI.userInvitations.getCourseRegistrationKey().then((response) => {
      dispatch(
        actions.saveRegistrationKey(response.data.courseRegistrationKey),
      );
    });
}

export function toggleRegistrationCode(shouldEnable: boolean): Operation<void> {
  return async (dispatch) =>
    CourseAPI.userInvitations
      .toggleCourseRegistrationKey(shouldEnable)
      .then((response) => {
        dispatch(
          actions.saveRegistrationKey(response.data.courseRegistrationKey),
        );
      });
}
