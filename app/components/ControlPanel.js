import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import FlatButton from 'material-ui/lib/flat-button';
import Slider from './Slider';
import { mmss } from '../utils/formatter';

const CellStyle = {
  verticalAlign: 'top',
  height: '48px',
  marginTop: '0px',
}

class ControlPanel extends Component {
  btn(icon, shortcut, handler) {
    return (
      <FlatButton primary={true} onClick={handler} className="video-btn">
        <i className={`fa fa-${icon}`} /><br />
        <span className="video-btn-shortcut">{shortcut}</span><br />
      </FlatButton>
    )
  }

  render() {
    const { filePath, control, playing, fullscreen, duration, currentTime } = this.props;
    return (
      <table className="video-control-panel">
        <tbody>
        <tr>
          <td width="40%" style={ CellStyle }>
            { this.btn("step-backward", "←", control.stepBackward) }
            { this.btn(playing ? "stop" : "play", "ENT", control.play) }
            { this.btn("step-forward", "→", control.stepForward) }
            { this.btn("bookmark", "B", control.addBookmark) }
            { this.btn("fast-backward", "↑", control.prevBookmark) }
            { this.btn("fast-forward", "↓", control.nextBookmark) }
            { this.btn(fullscreen ? "compress" : "expand", "F", control.fullscreen) }
          </td>
          <td width="50%" style={ CellStyle }>
            <Slider
              filePath={filePath}
              fullscreen={fullscreen}
              duration={duration}
              currentTime={currentTime}
              jump={control.jump}
            />
          </td>
          <td  style={ CellStyle }>
            <span className="video-current-time">
              &nbsp;&nbsp;{mmss(currentTime)} / {mmss(duration)}
            </span>
          </td>
        </tr>
        </tbody>
      </table>
    );
  }
}

export default ControlPanel;
