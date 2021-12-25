import { Component } from 'react';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import ReactSummernote from 'react-summernote';
import TextFieldLabel from 'material-ui/TextField/TextFieldLabel';
import PropTypes from 'prop-types';

import axios from 'lib/axios';
import { i18nLocale } from 'lib/helpers/server-context';

import '../styles/MaterialSummernote.scss';
import '../styles/MaterialSummernoteModal.scss';

const translations = defineMessages({
  inlineCode: {
    id: 'materialSummernote.InlineCode',
    defaultMessage: 'Inline Code',
  },
});

const propTypes = {
  field: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func,
  name: PropTypes.string,
  inputId: PropTypes.string,
  required: PropTypes.bool,
  value: PropTypes.string,
  airMode: PropTypes.bool,
  airModeColor: PropTypes.bool,
  intl: intlShape,
};

const contextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

class MaterialSummernote extends Component {
  static uploadImage = (image, onImageUploaded) => {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('name', image.name);

    axios
      .post('/attachments', formData)
      .then((response) => response.data)
      .then((data) => {
        if (data.success) {
          onImageUploaded(data.id);
        }
      });
  };

  constructor(props) {
    super(props);
    this.state = { isFocused: false };
    this.reactSummernote = null;
  }

  onChange = (e) => {
    if (this.props.onChange) {
      this.props.onChange(e.target.value);
    }
  };

  onImageUpload = (files) => {
    for (let i = 0; i < files.length; i += 1) {
      this.uploadImage(files[i], (dataId) => {
        const img = document.createElement('img');
        img.setAttribute('src', `/attachments/${dataId}`);

        if (this.reactSummernote != null) {
          this.reactSummernote.editor.summernote('insertNode', img);
        }
      });
    }
  };

  inlineCodeButton = () => {
    const ui = $.summernote.ui;

    const button = ui.button({
      contents:
        '<i class="fa fa-code"' +
        'style="color: #c7254e;' +
        'font-weight: bold;' +
        'background-color: #f9f2f4"/>',
      tooltip: this.props.intl.formatMessage(translations.inlineCode),
      click: () => {
        const node = $(
          window.getSelection().getRangeAt(0).commonAncestorContainer,
        );
        const smrNote = this.reactSummernote.editor;
        if (node.parent().is('code')) {
          node.unwrap();
        } else {
          const range = smrNote.summernote('editor.createRange');
          const text = range.toString();
          if (text !== '') {
            const newNode = $('<code></code>').eq(0);
            newNode.text(text);
            smrNote.summernote('editor.insertNode', newNode.get(0));
          }
        }
      },
    });

    return button.render();
  };

  render() {
    const {
      baseTheme,
      textField: {
        focusColor,
        floatingLabelColor,
        disabledTextColor,
        backgroundColor,
      },
    } = this.context.muiTheme;

    const testFieldLabelColor = this.state.isFocused
      ? focusColor
      : floatingLabelColor;

    return (
      <div
        key={this.props.field}
        style={{
          fontSize: 16,
          width: '100%',
          display: 'inline-block',
          position: 'relative',
          backgroundColor,
          fontFamily: baseTheme.fontFamily,
          cursor: this.props.disabled ? 'not-allowed' : 'auto',
          paddingTop: this.props.label ? '2.5em' : 0,
        }}
      >
        <TextFieldLabel
          disabled={this.props.disabled}
          htmlFor={this.props.field}
          muiTheme={this.context.muiTheme}
          shrink={true}
          style={{
            pointerEvents: 'none',
            color: this.props.disabled
              ? disabledTextColor
              : testFieldLabelColor,
          }}
        >
          {this.props.label}
        </TextFieldLabel>
        <textarea
          disabled={this.props.disabled}
          id={this.props.inputId}
          name={this.props.name}
          onChange={this.onChange}
          required={this.props.required}
          style={{ display: 'none' }}
          value={this.props.value}
        />
        <div className="material-summernote">
          <ReactSummernote
            ref={(ref) => {
              this.reactSummernote = ref;
            }}
            onBlur={() => {
              this.setState({ isFocused: false });
            }}
            onBlurCodeview={() => {
              this.reactSummernote.editor.summernote('codeview.deactivate');
            }}
            onChange={this.props.onChange}
            onFocus={() => {
              this.setState({ isFocused: true });
            }}
            onImageUpload={this.onImageUpload}
            onKeyDown={this.props.onKeyDown}
            options={{
              airMode: this.props.airMode,
              dialogsInBody: true,
              disabled: this.props.disabled,
              fontNames: [
                'Arial',
                'Arial Black',
                'Comic Sans MS',
                'Courier New',
                'Helvetica Neue',
                'Helvetica',
                'Impact',
                'Lucida Grande',
                'Roboto',
                'Tahoma',
                'Times New Roman',
                'Verdana',
              ],
              fontNamesIgnoreCheck: ['Roboto'],
              toolbar: [
                ['style', ['style']],
                ['font', ['bold', 'underline', 'inlineCode', 'clear']],
                ['script', ['superscript', 'subscript']],
                ['fontname', ['fontname']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['table', ['table']],
                ['insert', ['link', 'picture', 'video']],
                ['view', ['fullscreen', 'codeview', 'help']],
              ],
              popover: {
                air: [
                  ['style', ['style']],
                  ['font', ['bold', 'underline', 'inlineCode', 'clear']],
                  ['script', ['superscript', 'subscript']],
                  ...(this.props.airModeColor ? ['color', ['color']] : []),
                  ['para', ['ul', 'ol', 'paragraph']],
                  ['table', ['table']],
                  ['insert', ['link', 'picture']],
                ],
                image: [
                  ['imagesize', ['imageSize100', 'imageSize50', 'imageSize25']],
                  ['remove', ['removeMedia']],
                ],
              },
              buttons: {
                inlineCode: this.inlineCodeButton,
              },
              lang: i18nLocale,
              followingToolbar: false,
            }}
            value={this.props.value}
          />
        </div>
      </div>
    );
  }
}

MaterialSummernote.propTypes = propTypes;
MaterialSummernote.contextTypes = contextTypes;
MaterialSummernote.defaultProps = {
  airModeColor: true,
};

export default injectIntl(MaterialSummernote);
