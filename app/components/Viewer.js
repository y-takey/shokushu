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

class Viewer extends Component {
  static propTypes = {
    increment: PropTypes.func.isRequired,
    incrementIfOdd: PropTypes.func.isRequired,
    incrementAsync: PropTypes.func.isRequired,
    decrement: PropTypes.func.isRequired
  };

  stepBackward() {
    console.log("clicked stepBackward");
  };

  play() {
    console.log("clicked play");
    this.refs.video.play();
  };

  stop() {
    console.log("clicked stop");
    this.refs.video.pause();
  };

  stepForward() {
    console.log("clicked stepForward");
  };

  fullscreen() {
    this.refs.video.webkitRequestFullscreen();
  }

  render() {
    // const { increment, incrementIfOdd, incrementAsync, decrement, counter } = this.props;
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
      <div>
        <div className={styles.backButton}>
          <Link to="/">
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>

        <Card>
          <CardMedia
            overlay={[
              btn("step-backward", this.stepBackward),
              btn("play", this.play),
              btn("stop", this.stop),
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
          <CardActions>
            <FloatingActionButton style={style} onClick={this.stepBackward.bind(this)}>
              <i className="fa fa-step-backward"></i>
            </FloatingActionButton>
            <FloatingActionButton style={style} onClick={this.play.bind(this)}>
              <i className="fa fa-play"></i>
            </FloatingActionButton>
            <FloatingActionButton style={style} onClick={this.stop.bind(this)}>
              <i className="fa fa-stop"></i>
            </FloatingActionButton>
            <FloatingActionButton style={style} onClick={this.stepForward.bind(this)}>
              <i className="fa fa-step-forward"></i>
            </FloatingActionButton>
            <FloatingActionButton style={style} onClick={this.fullscreen.bind(this)}>
              <i className="fa fa-expand"></i>
            </FloatingActionButton>
          </CardActions>
        </Card>

      </div>
    );
  }
}

export default Viewer;
