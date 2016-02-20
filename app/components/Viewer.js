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
import styles from './Viewer.module.css';
import TagLabels from './TagLabels';
import DummyScreen from './DummyScreen';

// Constants
const Keys = {
  ENTER: 13,
  ESCAPE: 27,
  LEFT_ARROW: 37,
  UP_ARROW: 38,
  RIGHT_ARROW: 39,
  DOWN_ARROW: 40,
  SPACE: 32,
  B: 66
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
      'goBookmark'
    )
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    this.videoContainer = ReactDOM.findDOMNode(this.refs.videocard)
    let track = ReactDOM.findDOMNode(this.refs.slider.refs.track)
    this.trackLeft = this.refs.slider._getTrackLeft()
    this.trackWidth = track.clientWidth;
    this.trackY = track.getBoundingClientRect().top;
    this.hideActionBar();
    this.refs.video.addEventListener("loadedmetadata", () => {
      this.setState({ duration: this.refs.video.duration })
    });
    this.refs.video.addEventListener("timeupdate", () => {
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
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
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
      [Keys.LEFT_ARROW]:  () => this.stepBackward(),
      [Keys.RIGHT_ARROW]: () => this.stepForward(),
      [Keys.UP_ARROW]:    () => this.stepForward(),
      [Keys.DOWN_ARROW]:  () => this.stepForward(),
      [Keys.ENTER]:       () => this.state.playing ? this.stop() : this.play(),
      [Keys.ESCAPE]:      () => this.exitFullscreen(),
      [Keys.SPACE]:       () => this.evacuate(),
      [Keys.B]:           () => this.handleAddBookmark()
    }

    let dispatcher = eventDispatcher[e.keyCode]

    if (!dispatcher) { return; }

    e.preventDefault();
    dispatcher();
  }

  handleFocus(e) {
    console.log("+++ handleFocus")
  }
  handleMouseOver(e) {
    this.setState({ thumbnail: true })
  }
  handleMouseOut(e) {
    this.setState({ thumbnail: false })
  }
  handleSlider(e) {
    let pos = e.clientX - this.trackLeft
    if (pos < 0) pos = 0; else if (pos > this.trackWidth) pos = this.trackWidth;
    let percent = Math.round(pos * 100 / this.trackWidth) / 100
    this.refs.preview.currentTime = this.refs.video.duration * percent
    this.setState({ thumbnailPos: e.clientX })
  }
  handleSliderChange(e, value) {
    this.refs.video.currentTime = Math.floor(value)
  }

  handleAddBookmark(e) {
    this.props.addBookmark(this.state.file, this.refs.video.currentTime)
  }

  goBookmark(bookmark) {
    this.refs.video.currentTime = bookmark
  }

  mmss(sec) {
    const pad = (val) => { return ("0" + val).slice(-2); };
    let ss = sec % 60 || 0;
    let mm = (sec - ss) / 60 || 0;
    return (pad(mm) + ":" + pad(ss))
  }

  createSlider() {
    return (
      <div style={ { display: 'inline-block', width: '60%', height: '55px'} } >
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
    const style = {
      display: this.state.thumbnail ? 'block' : 'none',
      width: width + 'px',
      height: height + 'px',
      position: 'absolute',
      left: (pos - width / 2) + 'px',
      top: (this.trackY - height / 2 - 20) + 'px',
      zIndex: 1000
    };
    let filePath = this.props.dirPath + "/" + this.props.params.filename
    return (
      <div style={style}>
        <video src={filePath} ref="preview" width="213px" height="120px" />
      </div>
    )
  }

  render() {
    const style = {
      marginRight: 20,
    };
    let file = this.props.location.state.file
    let tags = _.map(file.tags, "text");
    let bookmarks = file.bookmarks || []
    let filename = this.props.params.filename
    let filePath = this.props.dirPath + "/" + filename
    let btn = (icon, handler) => {
      return (
        <FloatingActionButton style={style} onClick={handler.bind(this)}>
          <i className={`fa fa-${icon}`}></i>
        </FloatingActionButton>
      )
    }
    let dummyScreen = null;
    if (this.state.evacuate) {
      dummyScreen = <DummyScreen />
    }

    return (
      <div>
        {dummyScreen}
        <div onMouseMove={this.onMouseMove} style={ {display: this.state.evacuate ? 'none' : 'block' } }>
          {this.createThumbnail()}

          <div className={styles.backButton}>
            <Link to="/">
              <i className="fa fa-arrow-left fa-3x" />
            </Link>
          </div>

          <Card>
            <CardMedia ref="videocard" style={ this.state.fullscreen ? { width: screen.width } : {} }
              overlayStyle={ { display: (this.state.showBar ? 'block' : 'none') } }
              overlay={[
                btn("step-backward", this.stepBackward),
                (this.state.playing ? btn("stop", this.stop) : btn("play", this.play)),
                btn("step-forward", this.stepForward),
                (this.state.fullscreen ? btn("compress", this.exitFullscreen) : btn("expand", this.fullscreen)),
                this.createSlider(),
                <span>{this.mmss(this.state.currentTime)}</span>
              ]}
            >
              <video autoPlay src={filePath} ref="video"></video>
            </CardMedia>
            <CardTitle title={filename} />
            <CardText>
              <TagLabels tags={tags} />
              <List subheader="Bookmarks" insetSubheader={true} style={ { width: 300 } }>
                {bookmarks.map( (bookmark) => {
                  return(
                    <ListItem
                      key={bookmark}
                      leftAvatar={<Avatar icon={<i className="fa fa-bookmark" />} />}
                      rightIcon={<i className="fa fa-remove" />}
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
