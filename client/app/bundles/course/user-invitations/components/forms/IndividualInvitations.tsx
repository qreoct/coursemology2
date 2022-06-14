import { FC } from 'react';
import { defineMessages, injectIntl, WrappedComponentProps } from 'react-intl';
import { Button, Divider, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  IndividualInviteRowData,
  IndividualInvites,
} from 'types/course/user_invitations';
import { ManageCourseUsersPermissions } from 'types/course/course_users';
import { UseFieldArrayAppend, UseFieldArrayRemove } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { AppState } from 'types/store';
import IndividualInvitation from './IndividualInvitation';
import { getManageCourseUsersSharedData } from '../../selectors';

interface Props extends WrappedComponentProps {
  isLoading: boolean;
  permissions: ManageCourseUsersPermissions;
  fieldsConfig: {
    control: any;
    fields: IndividualInviteRowData[];
    append: UseFieldArrayAppend<IndividualInvites, 'invitations'>;
    remove: UseFieldArrayRemove;
  };
}

const translations = defineMessages({
  addInvitation: {
    id: 'course.userInvitations.IndividualInvitations.add',
    defaultMessage: 'Add Row',
  },
  invite: {
    id: 'course.userInvitations.IndividualInvitations.remove',
    defaultMessage: 'Invite All Users',
  },
});

const IndividualInvitations: FC<Props> = (props) => {
  const { isLoading, permissions, fieldsConfig, intl } = props;
  const { append, fields } = fieldsConfig;

  const sharedData = useSelector((state: AppState) =>
    getManageCourseUsersSharedData(state),
  );
  const defaultTimelineAlgorithm = sharedData.defaultTimelineAlgorithm;

  return (
    <>
      {fields.map(
        (field, index): JSX.Element => (
          <IndividualInvitation
            key={field.id}
            {...{ permissions, field, index, fieldsConfig }}
          />
        ),
      )}

      <Divider sx={{ margin: '12px 0px' }} />
      <Grid container alignItems="center">
        <LoadingButton
          className="btn-submit"
          loading={isLoading}
          variant="contained"
          sx={{ marginRight: '4px' }}
          form="invite-users-individual-form"
          key="invite-users-individual-form-submit-button"
          type="submit"
        >
          {intl.formatMessage(translations.invite)}
        </LoadingButton>
        <Button
          color="primary"
          onClick={(): void =>
            append({
              name: '',
              email: '',
              role: 'student',
              phantom: false,
              ...(permissions.canManagePersonalTimes && {
                timelineAlgorithm: defaultTimelineAlgorithm,
              }),
            })
          }
        >
          {intl.formatMessage(translations.addInvitation)}
        </Button>
      </Grid>
    </>
  );
};

export default injectIntl(IndividualInvitations);
