import { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import formTranslations from 'lib/translations/form';
import ConfirmationDialog from 'lib/components/ConfirmationDialog';

const propTypes = {
  title: PropTypes.string,
  hideForm: PropTypes.func,
  submitForm: PropTypes.func,
  skipConfirmation: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  intl: PropTypes.object.isRequired,
  children: PropTypes.node,
  form: PropTypes.string,
};

class FormDialogue extends Component {
  constructor(props) {
    super(props);

    this.state = {
      discardConfirmationOpen: false,
    };
  }

  handleDiscard = () => {
    this.setState({ discardConfirmationOpen: false });
    this.props.hideForm();
  };

  handleDiscardCancel = () => {
    this.setState({ discardConfirmationOpen: false });
  };

  handleFormClose = () => {
    const { hideForm, disabled, skipConfirmation } = this.props;
    if (disabled) {
      return;
    }

    if (skipConfirmation) {
      hideForm();
    } else {
      this.setState({ discardConfirmationOpen: true });
    }
  };

  render() {
    const { intl, title, disabled, form, open, submitForm, children } =
      this.props;
    const formActions = [
      <Button
        color="secondary"
        key="form-dialogue-cancel-button"
        onClick={this.handleFormClose}
        {...{ disabled }}
      >
        {intl.formatMessage(formTranslations.cancel)}
      </Button>,
      <Button
        ref={(button) => {
          this.submitButton = button;
        }}
        color="primary"
        className="btn-submit"
        key="form-dialogue-submit-button"
        {...(form ? { form, type: 'submit' } : { onClick: submitForm })}
        {...{ disabled }}
      >
        {intl.formatMessage(formTranslations.submit)}
      </Button>,
    ];

    return (
      <>
        <Dialog
          fullWidth
          maxWidth="md"
          open={open}
          onClose={this.handleFormClose}
          style={{
            top: 40,
          }}
        >
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>{children}</DialogContent>
          <DialogActions>{formActions}</DialogActions>
        </Dialog>
        <ConfirmationDialog
          confirmDiscard
          open={this.state.discardConfirmationOpen}
          onCancel={this.handleDiscardCancel}
          onConfirm={this.handleDiscard}
        />
      </>
    );
  }
}

FormDialogue.propTypes = propTypes;

export default injectIntl(FormDialogue);
