import { AxiosResponse } from 'axios';
import {
  ManageCourseUsersPermissions,
  ManageCourseUsersSharedData,
} from 'types/course/course_users';
import {
  ApproveEnrolRequestPatchData,
  EnrolRequestData,
} from 'types/course/enrol_requests';
import BaseCourseAPI from './Base';

export default class UserInvitationsAPI extends BaseCourseAPI {
  _baseUrlPrefix: string = `/courses/${this.getCourseId()}/enrol_requests`;

  /**
   * Fetches data from enrol requests index
   */
  index(): Promise<
    AxiosResponse<{
      enrolRequests: EnrolRequestData[];
      permissions: ManageCourseUsersPermissions;
      manageCourseUsersData: ManageCourseUsersSharedData;
    }>
  > {
    return this.getClient().get(this._baseUrlPrefix);
  }

  /**
   * Approve a course enrol request
   * success response: EnrolRequestData - Data of the changed course enrolment
   * error response: { errors: [] } - An array of errors will be returned upon error.
   */
  approve(
    enrolRequest: ApproveEnrolRequestPatchData,
    requestId: number,
  ): Promise<AxiosResponse<EnrolRequestData>> {
    return this.getClient().patch(
      `${this._baseUrlPrefix}/${requestId}/approve`,
      enrolRequest,
    );
  }

  /**
   * Reject a course enrol request
   * success response: EnrolRequestData - Data of the changed course enrolment
   * error response: { errors: [] } - An array of errors will be returned upon error.
   */
  reject(requestId: number): Promise<AxiosResponse<EnrolRequestData>> {
    return this.getClient().patch(`${this._baseUrlPrefix}/${requestId}/reject`);
  }
}
