import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Viewer from '../components/Viewer';
import * as ViewerActions from '../actions/viewer';

function mapStateToProps(state) {
  console.log("[mapStateToProps] state:", state)
  return {
    dirPath: state.home.dirPath
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ViewerActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Viewer);
