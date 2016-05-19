import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Slider from 'material-ui/lib/slider';
import Thumbnail from './Thumbnail';

class ShokushuSlider extends Component {

  constructor(props) {
    super(props)
    this.state = { thumbnail: { show: false, posX: 0, posY: 0, time: 0 } }
    _.bindAll(this, 'onMouseOver', 'onMouseOut', 'onMouseMove', 'onChange')
  }

  componentDidMount() {
    this.track = ReactDOM.findDOMNode(this.refs.slider.refs.track)
    this.slider = ReactDOM.findDOMNode(this.refs.slider)
  }

  onMouseOver(e) {
    this.state.thumbnail.show = true
    this.setState({ thumbnail: this.state.thumbnail })
  }

  onMouseOut(e) {
    this.state.thumbnail.show = false
    this.setState({ thumbnail: this.state.thumbnail })
  }

  onMouseMove(e) {
    let posX = Math.round(e.clientX / 10) * 10
    if (posX === this.state.thumbnail.PosX) { return }

    let trackWidth = this.track.clientWidth;
    let pos = posX - this.refs.slider._getTrackLeft()
    if (pos < 0) {
      pos = 0;
    } else if (pos > trackWidth) {
      pos = trackWidth;
    }
    let percent = Math.round(pos * 100 / trackWidth) / 100
    let posY = 0;
    if (this.slider) {
      posY = this.slider.offsetTop
    }
    this.setState({ thumbnail: {
      show: this.state.thumbnail.show,
      posX: posX,
      posY: posY,
      time: this.props.duration * percent
    }})
  }

  onChange(e, value) {
    this.props.jump(Math.floor(value))
  }

  render() {
    const { filePath, fullscreen, duration, currentTime } = this.props;
    return (
      <div>
        <Thumbnail
          filePath={filePath}
          fullscreen={fullscreen}
          {...this.state.thumbnail}
        />
        <Slider
          ref="slider"
          max={duration}
          value={currentTime}
          onChange={this.onChange}
          onFocus={ () => {} }
          onMouseOver={this.onMouseOver}
          onMouseOut={this.onMouseOut}
          onMouseMove={this.onMouseMove}
        />
      </div>
    );
  }
}

export default ShokushuSlider;
