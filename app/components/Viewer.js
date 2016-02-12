import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';
import FlatButton from 'material-ui/lib/flat-button';
import CardText from 'material-ui/lib/card/card-text';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import { Link } from 'react-router';
import styles from './Viewer.module.css';

// Constants
const Keys = {
  ENTER: 13,
  LEFT_ARROW: 37,
  UP_ARROW: 38,
  RIGHT_ARROW: 39,
  DOWN_ARROW: 40,
  SPACE: 32
};

const STEP = 10;

class Viewer extends Component {
  static propTypes = {
    increment: PropTypes.func.isRequired,
    incrementIfOdd: PropTypes.func.isRequired,
    incrementAsync: PropTypes.func.isRequired,
    decrement: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context)
    this.state = { showBar: true, playing: false }
    _.bindAll(this, 'onMouseMove', 'hideActionBar', 'stepBackward', 'play', 'stop', 'stepForward', 'handleKeyDown')
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    this.hideActionBar();
    this.state = { showBar: true, playing: false }
  }

  componentWillUnMount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  onMouseMove() {
    this.setState({ showBar: true })
    this.hideActionBar();
  }

  // hide action bar after 3 sec from last operation
  hideActionBar() {
    clearTimeout(this.hiddenTimer);
    this.hiddenTimer = setTimeout( () => {
      this.setState({showBar: false})
    }, 3000);

  }

  stepBackward() {
    console.log("clicked stepBackward now:", this.refs.video.currentTime);
    this.refs.video.currentTime -= STEP
  };

  play() {
    console.log("clicked play");
    this.refs.video.play();
    this.setState({ playing: true })
  };

  stop() {
    console.log("clicked stop");
    this.refs.video.pause();
    this.setState({ playing: false })
  };

  stepForward() {
    console.log("clicked stepForward now:", this.refs.video.currentTime);
    this.refs.video.currentTime += STEP
  };

  fullscreen() {
    this.refs.video.webkitRequestFullscreen();
  }

  handleKeyDown(e) {
    console.log("-- key is :", e.keyCode)
    switch (e.keyCode) {
      case Keys.LEFT_ARROW:
        e.preventDefault();
        this.stepBackward();
        console.log("downed key is LEFT_ARROW");
        return;
      case Keys.RIGHT_ARROW:
        e.preventDefault();
        this.stepForward();
        console.log("downed key is RIGHT_ARROW");
        return;
      case Keys.UP_ARROW:
        e.preventDefault();
        console.log("downed key is UP_ARROW");
        return;
      case Keys.DOWN_ARROW:
        e.preventDefault();
        console.log("downed key is DOWN_ARROW");
        return;
      case Keys.ENTER:
        e.preventDefault();
        this.state.playing ? this.stop() : this.play();
        console.log("downed key is ENTER");
        return;
      default:
        console.log("other key is downed:", e.keyCode)
    }
  }

  render() {
    const style = {
      marginRight: 20,
    };

    let filename = this.props.params.filename
    let filePath = this.props.dirPath + "/" + filename
    let btn = (icon, handler) => {
      return (
        <FloatingActionButton style={style} onClick={handler.bind(this)}>
          <i className={`fa fa-${icon}`}></i>
        </FloatingActionButton>
      )
    }
    return (
      <div onMouseMove={this.onMouseMove}>
        <div className={styles.backButton}>
          <Link to="/">
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>

        <Card>
          <CardMedia overlayStyle={ { display: (this.state.showBar ? 'block' : 'none') } }
            overlay={[
              btn("step-backward", this.stepBackward),
              (this.state.playing ? btn("stop", this.stop) : btn("play", this.play)),
              btn("step-forward", this.stepForward),
              btn("expand", this.fullscreen)
            ]}
          >
            <video controls autoPlay src={filePath} ref="video"></video>
          </CardMedia>
          <CardTitle title={filename} />
          <CardText>
            tags...
          </CardText>
        </Card>

      </div>
    );
  }
}

export default Viewer;
