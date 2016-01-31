import React, { Component, PropTypes } from 'react';
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
  };

  stop() {
    console.log("clicked stop");
  };

  stepForward() {
    console.log("clicked stepForward");
  };

  render() {
    // const { increment, incrementIfOdd, incrementAsync, decrement, counter } = this.props;
    console.log("viewer params:", this.props.params)
    return (
      <div>
        <div className={styles.backButton}>
          <Link to="/">
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>
        <div className={`counter ${styles.counter}`}>
          {this.props.params.filename}
        </div>
        <div className={styles.btnGroup}>
          <button className={styles.btn} onClick={this.stepBackward}>
            <i className="fa fa-step-backward"></i>
          </button>
          <button className={styles.btn} onClick={this.play}>
            <i className="fa fa-play"></i>
          </button>
          <button className={styles.btn} onClick={this.stop}>
            <i className="fa fa-stop"></i>
          </button>
          <button className={styles.btn} onClick={this.stepForward}>
            <i className="fa fa-step-forward"></i>
          </button>
        </div>
      </div>
    );
  }
}

export default Viewer;
