import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import FlatButton from 'material-ui/lib/flat-button';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import CardMedia from 'material-ui/lib/card/card-media';
import Slider from 'material-ui/lib/slider';
import { GridList, GridTile } from 'material-ui/lib/grid-list';
import ControlPanel from './ControlPanel';

const Keys = {
  ENTER: 13,
  ESCAPE: 27,
  LEFT_ARROW: 37,
  UP_ARROW: 38,
  RIGHT_ARROW: 39,
  DOWN_ARROW: 40,
  B: 66,
  F: 70
};

const STEP = 10;
const CONTROL_HEIGHT = 48;

const Style = {
  backgroundColor: '#000000'
}

const ControlPanelStyle = {
  height: `${CONTROL_HEIGHT}px`,
  lineHeight: `${CONTROL_HEIGHT}px`,
  paddingTop: '0px',
  paddingBottom: '10px'
}

class Player extends Component {

  static dispatcher = {
    play() {
      if ( this.state.playing ) {
        this.refs.video.pause();
        this.setState({ playing: false })
      } else {
        this.refs.video.play();
        this.setState({ playing: true })
      }
    },
    stepBackward() {
      this.currentTime = this.currentTime - STEP
    },
    stepForward() {
      this.currentTime = this.currentTime + STEP
    },
    jump(time) {
      this.currentTime = time
    },
    addBookmark(e) {
      this.props.addBookmark(e, this.props.file, this.currentTime)
    },
    prevBookmark(e) {
      let bookmarks = this.props.file.bookmarks
      let currentTime = this.currentTime
      let bookmark = _.findLast(bookmarks, (bookmark) => bookmark < currentTime )
      if (!bookmark) { return }
      this.goBookmark(bookmark)
    },
    nextBookmark(e) {
      let bookmarks = this.props.file.bookmarks
      let currentTime = this.currentTime
      let bookmark = _.find(bookmarks, (bookmark) => bookmark > currentTime )
      if (!bookmark) { return }
      this.goBookmark(bookmark)
    },
    fullscreen() {
      if ( this.state.fullscreen ) {
        document.webkitExitFullscreen();
        this.setState({ fullscreen: false })
      } else {
        this.videoContainer.webkitRequestFullscreen();
        this.setState({ fullscreen: true })
      }
    }
  };

  static videoEvents = {
    loadedmetadata() {
      this.setState({ duration: this.refs.video.duration })
    },
    timeupdate() {
      if (!this.refs.video) { return }
      this.setState({ currentTime: Math.floor(this.currentTime) })
    }
  };

  constructor(props, context) {
    super(props, context)
    this.state = { showBar: true, playing: true, duration: 10, currentTime: 0, fullscreen: false }
    this.dispatcher = _.reduce(Player.dispatcher, (dsp, func, event) => {
      dsp[event] = _.bind(func, this);
      return dsp;
    }, {});
    _.bindAll(this, 'onMouseMove', 'handleKeyDown', 'goBookmark')
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    this.videoContainer = ReactDOM.findDOMNode(this.refs.videocard)
    this.hideActionBar();
    _.forEach(Player.videoEvents, (listener, eventName) => {
      this.refs.video.addEventListener(eventName, _.bind(listener, this))
    })
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    clearTimeout(this.hiddenTimer);
  }

  handleKeyDown(e) {
    if (this.props.evacuate && e.keyCode !== Keys.SPACE) {
      return;
    }
    const eventDispatcher = {
      [Keys.LEFT_ARROW]:  this.dispatcher.stepBackward,
      [Keys.RIGHT_ARROW]: this.dispatcher.stepForward,
      [Keys.UP_ARROW]:    this.dispatcher.prevBookmark,
      [Keys.DOWN_ARROW]:  this.dispatcher.nextBookmark,
      [Keys.ENTER]:       this.dispatcher.play,
      [Keys.ESCAPE]:      this.dispatcher.fullscreen,
      [Keys.B]:           this.dispatcher.addBookmark,
      [Keys.F]:           this.dispatcher.fullscreen
    }

    let dispatcher = eventDispatcher[e.keyCode]

    if (!dispatcher) { return; }

    e.preventDefault();
    e.stopPropagation();
    dispatcher();
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

  get currentTime() {
    return this.refs.video.currentTime;
  }
  set currentTime(time) {
    this.refs.video.currentTime = time;
  }

  control(func) {
    this.dispatcher[func]()
  }

  goBookmark(bookmark) {
    this.currentTime = bookmark
  }

  evacuate() {
    if (this.state.playing) {
      this.dispatcher.play();
    }
    if (this.state.fullscreen) {
      this.dispatcher.fullscreen();
    }
  }

  sizeStyle() {
    return {}

    // ↓ This is a bug. Fix me!! and then delete ↑ code.
    if (!this.refs.video) {
      return {}
    }
    const videoWidth = this.refs.video.videoWidth
    if (!this.state.fullscreen) {
      return { width: `${videoWidth}px` }
    }
    const heightRate = (screen.height + CONTROL_HEIGHT) / this.refs.video.videoHeight;
    const widthRate = screen.width / videoWidth
    const rate = heightRate > widthRate ? widthRate : heightRate
    const width = `${videoWidth * rate}px`
    return { width: width, maxWidth: width, minWidth: width }
  }

  render() {
    const { playing, fullscreen, duration, currentTime } = this.state
    const controlPanel = <ControlPanel
      control={this.dispatcher}
      filePath={this.props.filePath}
      playing={playing}
      fullscreen={fullscreen}
      duration={duration}
      currentTime={currentTime}
    />
    const sizeStyle = this.sizeStyle()
    return (
      <CardMedia ref="videocard" style={ _.assign(Style, sizeStyle) }
        overlayContentStyle={ ControlPanelStyle }
        overlayStyle={ { display: (this.state.showBar ? 'block' : 'none') } }
        overlay={controlPanel}
        onMouseMove={ this.onMouseMove }
      >
        <video autoPlay src={this.props.filePath} ref="video"
          style={ { marginBottom: `${CONTROL_HEIGHT}px` } }></video>
      </CardMedia>
    );
  }
}

export default Player;
