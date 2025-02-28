import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ReadOnlyEditorComponent from '../components/ReadOnlyEditor';
import { topicShape } from '../propTypes';

class ReadOnlyEditorContainer extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.annotations !== this.props.annotations;
  }

  render() {
    const { answerId, fileId, annotations, content } = this.props;
    // content has <div> tags at first and last index, increasing line count
    return (
      <ReadOnlyEditorComponent
        answerId={answerId}
        fileId={fileId}
        annotations={Object.values(annotations)}
        content={content}
      />
    );
  }
}

ReadOnlyEditorContainer.propTypes = {
  annotations: PropTypes.objectOf(topicShape),
  answerId: PropTypes.number.isRequired,
  content: PropTypes.arrayOf(PropTypes.string),
  fileId: PropTypes.number.isRequired,
};

function mapStateToProps(state, ownProps) {
  const { fileId } = ownProps;

  return {
    annotations: state.annotations[fileId].topics,
  };
}

const ReadOnlyEditor = connect(mapStateToProps)(ReadOnlyEditorContainer);
export default ReadOnlyEditor;
