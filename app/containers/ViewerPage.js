import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Viewer from '../components/Viewer';
import * as ViewerActions from '../actions/viewer';

function mapStateToProps(state) {
  return {
    filename: state.filename
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ViewerActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Viewer);
