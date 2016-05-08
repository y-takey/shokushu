import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';
import FlatButton from 'material-ui/lib/flat-button';
import CardText from 'material-ui/lib/card/card-text';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import Slider from 'material-ui/lib/slider';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import { Link } from 'react-router';
import TagLabels from './TagLabels';
import DummyScreen from './DummyScreen';

// Constants
const Keys = {
  BACK_SPACE: 8,
  ENTER: 13,
  ESCAPE: 27,
  LEFT_ARROW: 37,
  UP_ARROW: 38,
  RIGHT_ARROW: 39,
  DOWN_ARROW: 40,
  SPACE: 32,
  B: 66,
  F: 70
};

const STEP = 10;

class Viewer extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = { showBar: true, playing: true, duration: 10, currentTime: 0, thumbnail: false, sliderPos: 0, fullscreen: false }
    _.bindAll(this, 'onMouseMove', 'hideActionBar',
      'stepBackward', 'play', 'stop', 'stepForward',
      'handleKeyDown', 'handleFocus', 'handleMouseOver',
      'handleMouseOut', 'handleSlider', 'handleSliderChange', 'createThumbnail',
      'goBookmark', 'goBack'
    )
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    this.videoContainer = ReactDOM.findDOMNode(this.refs.videocard)
    this.track = ReactDOM.findDOMNode(this.refs.slider.refs.track)
    this.hideActionBar();
    this.refs.video.addEventListener("loadedmetadata", () => {
      this.setState({ duration: this.refs.video.duration })
    });
    this.refs.video.addEventListener("timeupdate", () => {
      if (!this.refs.video) { return }
      this.setState({ currentTime: Math.floor(this.refs.video.currentTime) })
    });
    this.state = {
      file: this.props.location.state.file,
      howBar: true,
      playing: true,
      duration: 10,
      currentTime: 0,
      thumbnail: false,
      thumbnailPos: null,
      fullscreen: false
    }
    setTimeout( () => {
      this.props.viewVideo(this.state.file)
    }, 3000);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('timeupdate');
    clearTimeout(this.hiddenTimer);
  }

  onMouseMove() {
    this.setState({ showBar: true })
    this.hideActionBar();
  }

  // hide action bar after 3 sec from last operation
  hideActionBar() {
    clearTimeout(this.hiddenTimer);
    this.hiddenTimer = setTimeout( () => {
      this.setState({ showBar: false, thumbnail: false })
    }, 3000);
  }

  stepBackward() {
    this.refs.video.currentTime -= STEP
  };

  play() {
    this.refs.video.play();
    this.setState({ playing: true })
  };

  stop() {
    this.refs.video.pause();
    this.setState({ playing: false })
  };

  stepForward() {
    this.refs.video.currentTime += STEP
  };

  fullscreen() {
    this.videoContainer.webkitRequestFullscreen();
    this.setState({ fullscreen: true })
  }
  exitFullscreen() {
    document.webkitExitFullscreen();
    this.setState({ fullscreen: false })
  }
  evacuate() {
    if (this.state.evacuate) {
      this.setState({ evacuate: false })
    } else {
      this.stop()
      this.exitFullscreen();
      this.setState({ evacuate: true })
    }
  }

  handleKeyDown(e) {
    if (this.state.evacuate && e.keyCode !== Keys.SPACE) {
      return;
    }
    const eventDispatcher = {
      [Keys.BACK_SPACE]:  () => this.goBack(),
      [Keys.LEFT_ARROW]:  () => this.stepBackward(),
      [Keys.RIGHT_ARROW]: () => this.stepForward(),
      [Keys.UP_ARROW]:    () => this.handlePrevBookmark(),
      [Keys.DOWN_ARROW]:  () => this.handleNextBookmark(),
      [Keys.ENTER]:       () => this.state.playing ? this.stop() : this.play(),
      [Keys.ESCAPE]:      () => this.exitFullscreen(),
      [Keys.SPACE]:       () => this.evacuate(),
      [Keys.B]:           () => this.handleAddBookmark(),
      [Keys.F]:           () => this.fullscreen()
    }

    let dispatcher = eventDispatcher[e.keyCode]

    if (!dispatcher) { return; }

    e.preventDefault();
    dispatcher();
  }

  goBack() {
    this.props.history.goBack()
  }

  handleFocus(e) {
    // dummy func
  }
  handleMouseOver(e) {
    this.setState({ thumbnail: true })
  }
  handleMouseOut(e) {
    this.setState({ thumbnail: false })
  }
  handleSlider(e) {
    let roundedX = Math.round(e.clientX / 10) * 10
    if (roundedX === this.state.thumbnailPos) { return }

    let trackWidth = this.track.clientWidth;
    let pos = roundedX - this.refs.slider._getTrackLeft()
    if (pos < 0) pos = 0; else if (pos > trackWidth) pos = trackWidth;
    let percent = Math.round(pos * 100 / trackWidth) / 100
    this.refs.preview.currentTime = this.refs.video.duration * percent
    this.setState({ thumbnailPos: roundedX })
  }
  handleSliderChange(e, value) {
    this.refs.video.currentTime = Math.floor(value)
  }

  handleAddBookmark(e) {
    this.props.addBookmark(this.state.file, this.refs.video.currentTime)
  }

  handlePrevBookmark(e) {
    let bookmarks = this.state.file.bookmarks
    let currentTime = this.refs.video.currentTime
    let bookmark = _.findLast(bookmarks, (bookmark) => bookmark < currentTime )
    if (!bookmark) { return }
    this.goBookmark(bookmark)
  }

  handleNextBookmark(e) {
    let bookmarks = this.state.file.bookmarks
    let currentTime = this.refs.video.currentTime
    let bookmark = _.find(bookmarks, (bookmark) => bookmark > currentTime )
    if (!bookmark) { return }
    this.goBookmark(bookmark)
  }

  goBookmark(bookmark) {
    this.refs.video.currentTime = bookmark
  }

  removeBookmark(e, bookmark) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    this.props.removeBookmark(this.state.file, bookmark);
  }

  mmss(sec) {
    const pad = (val) => { return ("0" + val).slice(-2); };
    let ss = sec % 60 || 0;
    let mm = (sec - ss) / 60 || 0;
    return (pad(mm) + ":" + pad(ss))
  }

  createSlider() {
    return (
      <div>
        <Slider
          ref="slider"
          max={this.state.duration}
          value={this.state.currentTime}
          onChange={this.handleSliderChange}
          onFocus={this.handleFocus}
          onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseOut}
          onMouseMove={this.handleSlider}
        />
      </div>
    )
  }

  createThumbnail() {
    let pos = this.state.thumbnailPos || 0
    const width = 213;
    const height = 120;
    let top = 0;
    if (this.track && this.state.thumbnail) {
      let margin = this.state.fullscreen ? 60 : 90;
      top = (this.track.getBoundingClientRect().top + document.body.scrollTop - height - margin)
    }
    const style = {
      display: this.state.thumbnail ? 'block' : 'none',
      width: width + 'px',
      height: height + 'px',
      position: 'absolute',
      left: '' + (pos - width / 2) + 'px',
      top: '' + top + 'px',
      zIndex: 1000
    };
    let filePath = this.props.dirPath + "/" + this.props.params.filename
    return (
      <div style={style}>
        <video src={filePath} ref="preview" width="213px" height="120px" />
      </div>
    )
  }

  controlButtons() {
    let btn = (icon, shortcut, handler) => {
      return (
        <FlatButton primary={true} onClick={handler.bind(this)} className="video-btn">
          <i className={`fa fa-${icon}`} /><br />
          <span className="video-btn-shortcut">{shortcut}</span><br />
        </FlatButton>
      )
    }
    return (
      <table className="video-control-panel">
        <tbody>
        <tr>
          <td width="40%">
            { btn("step-backward", "←", this.stepBackward) }
            { this.state.playing ?
              btn("stop", "ENT", this.stop) :
              btn("play", "ENT", this.play) }
            { btn("step-forward", "→", this.stepForward) }
            { btn("bookmark", "B", this.handleAddBookmark) }
            { btn("fast-backward", "↑", this.handlePrevBookmark) }
            { btn("fast-forward", "↓", this.handleNextBookmark) }
            { this.state.fullscreen ?
              btn("compress", "ESC", this.exitFullscreen) :
              btn("expand", "F", this.fullscreen) }
          </td>
          <td width="50%">
            { this.createSlider() }
          </td>
          <td>
            <span className="video-current-time">&nbsp;&nbsp;{this.mmss(this.state.currentTime)}</span>
          </td>
        </tr>
        </tbody>
      </table>
    )
  }

  render() {
    let file = this.props.file || this.props.location.state.file
    let tags = _.map(file.tags, "text");
    let bookmarks = file.bookmarks || []
    let filename = this.props.params.filename
    let filePath = this.props.dirPath + "/" + filename
    let dummyScreen = null;
    if (this.state.evacuate) {
      dummyScreen = <DummyScreen />
    }

    return (
      <div>
        {dummyScreen}
        <div onMouseMove={this.onMouseMove} style={ {display: this.state.evacuate ? 'none' : 'block' } }>

          <FloatingActionButton onClick={this.goBack} style={ { marginBottom: 8 }}>
            <i className={"fa fa-remove"} />
          </FloatingActionButton>

          <Card>
            <CardMedia ref="videocard" style={ this.state.fullscreen ? { width: screen.width } : {} }
              overlayStyle={ { display: (this.state.showBar ? 'block' : 'none') } }
              overlay={this.controlButtons()}
            >
              {this.createThumbnail()}
              <video autoPlay src={filePath} ref="video"></video>
            </CardMedia>
            <CardTitle title={filename} />
            <CardText>
              <TagLabels tags={tags} />
              <List subheader="Bookmarks" insetSubheader={false} style={ { width: 300 } }>
                {bookmarks.map( (bookmark) => {
                  return(
                    <ListItem
                      key={bookmark}
                      leftAvatar={<Avatar icon={<i className="fa fa-bookmark" />} />}
                      rightIcon={<i className="fa fa-remove" onClick={ (e) => this.removeBookmark(e, bookmark) } />}
                      primaryText={this.mmss(bookmark)}
                      onClick={ () => this.goBookmark(bookmark) }
                    />
                  )
                })}
              </List>
            </CardText>
          </Card>
        </div>
      </div>
    );
  }
}

export default Viewer;
