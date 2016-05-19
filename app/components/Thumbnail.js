import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

const WIDTH = 213;
const HEIGHT = 120;

class Thumbnail extends Component {
  componentDidUpdate(prevProps) {
    if (prevProps.time !== this.props.time) {
      _.defer( () => this.refs.preview.currentTime = this.props.time );
    }
  }

  calcStyle() {
    if (!this.props.show) {
      return { display: 'none' }
    }

    let posX= this.props.posX || 0
    let top = 0;
    if (this.props.posY) {
      // let margin = this.props.fullscreen ? 60 : 90;
      top = (this.props.posY - HEIGHT)
    }
    return {
      display:  'block',
      width:    `${WIDTH}px`,
      height:   `${HEIGHT}px`,
      position: 'absolute',
      left:     `${(posX - WIDTH / 2)}px`,
      top:      `${top}px`,
      zIndex: 1000
    };
  }

  render() {
    return (
      <div style={this.calcStyle()}>
        <video src={this.props.filePath} ref="preview" width={`${WIDTH}px`} height={`${HEIGHT}px`} />
      </div>
    );
  }
}

export default Thumbnail;
