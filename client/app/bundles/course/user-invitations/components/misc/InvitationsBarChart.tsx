import BarChart from 'lib/components/BarChart';
import { defineMessages, FormattedMessage } from 'react-intl';
import palette from 'theme/palette';

const translations = defineMessages({
  accepted: {
    id: 'course.userInvitations.components.misc.InvitationsBarChart.accepted',
    defaultMessage: 'Accepted Invitations',
  },
  pending: {
    id: 'course.userInvitations.components.misc.InvitationsBarChart.pending',
    defaultMessage: 'Pending',
  },
});

const InvitationsBarChart = (props: {
  accepted: any;
  pending: any;
}): JSX.Element => {
  const { accepted, pending } = props;
  const data = [
    {
      count: accepted,
      color: palette.invitationStatus.accepted,
      label: <FormattedMessage {...translations.accepted} />,
    },
    {
      count: pending,
      color: palette.invitationStatus.pending,
      label: <FormattedMessage {...translations.pending} />,
    },
  ];

  return <BarChart data={data} />;
};

export default InvitationsBarChart;
