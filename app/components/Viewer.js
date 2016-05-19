import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Card from 'material-ui/lib/card/card';
import CardTitle from 'material-ui/lib/card/card-title';
import CardText from 'material-ui/lib/card/card-text';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import { GridList, GridTile } from 'material-ui/lib/grid-list';
import Player from './Player';
import TagLabels from './TagLabels';
import Bookmarks from './Bookmarks';
import Recommendation from './Recommendation';
import DummyScreen from './DummyScreen';

// Constants
const Keys = {
  BACK_SPACE: 8,
  SPACE: 32
};

class Viewer extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = { evacuate: false, file: this.props.location.state.file }
    _.bindAll(this, 'handleKeyDown', 'evacuate',
      'goBookmark', 'addBookmark', 'removeBookmark', 'goBack')
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    this.props.recommendVideo(this.state.file);
    setTimeout( () => {
      this.props.viewVideo(this.state.file)
    }, 3000);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.params.filename !== this.props.params.filename) {
      this.props.recommendVideo(this.state.file);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  // emergency escape!!
  evacuate() {
    if (this.state.evacuate) {
      this.setState({ evacuate: false })
    } else {
      this.refs.player.evacuate()
      this.setState({ evacuate: true })
    }
  }

  handleKeyDown(e) {
    if (this.state.evacuate && e.keyCode !== Keys.SPACE) {
      return;
    }
    const eventDispatcher = {
      [Keys.BACK_SPACE]:  this.goBack,
      [Keys.SPACE]:       this.evacuate,
    }

    let dispatcher = eventDispatcher[e.keyCode]

    if (!dispatcher) { return; }

    e.preventDefault();
    e.stopPropagation();
    dispatcher();
  }

  goBack() {
    this.props.history.push('/')
  }

  goBookmark(bookmark) {
    this.refs.player.goBookmark(bookmark)
  }

  addBookmark(e, file, time) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    this.props.addBookmark(file, time)
  }

  removeBookmark(e, bookmark) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    this.props.removeBookmark(this.state.file, bookmark);
  }

  render() {
    let file = this.props.file || this.state.file
    let tags = _.map(file.tags, "text");
    let bookmarks = file.bookmarks || []
    let recommendation = this.props.similars || []
    let filename = this.props.params.filename
    let filePath = this.props.dirPath + "/" + filename
    let dummyScreen = null;
    if (this.state.evacuate) {
      dummyScreen = <DummyScreen />
    }

    return (
      <div>
        {dummyScreen}
        <div style={ {display: this.state.evacuate ? 'none' : 'block' } }>

          <FloatingActionButton onClick={this.goBack} style={ { marginBottom: 8 } }>
            <i className={"fa fa-remove"} />
          </FloatingActionButton>

          <Card>
            <Player ref="player" file={file} filePath={filePath} addBookmark={this.addBookmark} />
            <CardTitle title={filename} />
            <CardText>
              <TagLabels tags={tags} />
              <GridList cols={2} padding={5} cellHeight={400}>
                <GridTile style={ { height: 'auto', overflow: 'scroll' } }>
                  <Bookmarks bookmarks={bookmarks} goBookmark={this.goBookmark} removeBookmark={this.removeBookmark} />
                </GridTile>
                <GridTile style={ { height: 'auto', overflow: 'scroll' } }>
                  <Recommendation recommendation={recommendation} />
                </GridTile>
              </GridList>
            </CardText>
          </Card>
        </div>
      </div>
    );
  }
}

export default Viewer;
