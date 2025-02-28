import { Card, CardHeader, CardContent } from '@mui/material';
import { red } from '@mui/material/colors';
import PropTypes from 'prop-types';

const styles = {
  card: {
    marginTop: 30,
    marginBottom: 30,
    borderRadius: 5,
  },
  header: {
    borderRadius: '5px 5px 0 0',
    padding: 12,
    backgroundColor: red[200],
  },
  headerTitle: {
    color: red[900],
    fontWeight: 'bold',
  },
};

export default function ErrorCard({
  message,
  cardStyles,
  headerStyles,
  messageStyles,
}) {
  return (
    <Card style={{ ...styles.card, ...cardStyles }}>
      <CardHeader
        style={{ ...styles.header, ...headerStyles }}
        title="Error"
        titleTypographyProps={{ variant: 'body2', style: styles.headerTitle }}
      />
      <CardContent style={messageStyles}>{message}</CardContent>
    </Card>
  );
}

ErrorCard.propTypes = {
  message: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.node,
  ]).isRequired,
  cardStyles: PropTypes.object,
  headerStyles: PropTypes.object,
  messageStyles: PropTypes.object,
};
