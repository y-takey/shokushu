import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Viewer from '../components/Viewer';
import * as ViewerActions from '../actions/ViewerActions';

function mapStateToProps(state) {
  return {
    dirPath: state.home.dirPath,
    similars: state.viewer.similars,
    file: state.viewer.file
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ViewerActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Viewer);
