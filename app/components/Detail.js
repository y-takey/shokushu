import _ from 'lodash';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import LeftNav from 'material-ui/lib/left-nav';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import FlatButton from 'material-ui/lib/flat-button';
import CardText from 'material-ui/lib/card/card-text';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import TextField from 'material-ui/lib/text-field';
import { WithContext as ReactTags } from 'react-tag-input';

const style = {
  marginRight: 20,
};

const suggestions = ["hoge", "fuga", "foo"];

export default class Detail extends Component {
  constructor(props, context) {
    super(props, context)
    _.bindAll(this, "showAllSuggestions", "handleAddition")
  }

  handleDrag(tag, currPos, newPos) {
    // dummy
  }
  showAllSuggestions() {
    this.refs.tag.refs.child.setState({
      selectionMode: true,
      suggestions: suggestions,
      query: "&nbsp;"
    })
  }
  componentDidMount() {
    let input = ReactDOM.findDOMNode(this.refs.tag).getElementsByTagName("input")[0];

    input.addEventListener('focus', this.showAllSuggestions);
    _.defer(() => { input.blur(); input.focus() });
  }
  handleAddition(tag) {
    this.props.addTag(tag);
    _.delay(this.showAllSuggestions, 300);
  }
  render() {
    const { file, updater, updateName, addTag, deleteTag } = this.props;
    return (
      <LeftNav width={300} openRight={true} open={true} >
        <Card>
          <CardText>
            <TextField ref="name" value={file.name} onChange={updateName}/>
            <ReactTags ref="tag" tags={file.tags}
                    suggestions={suggestions}
                    handleDelete={deleteTag}
                    handleAddition={this.handleAddition}
                    handleDrag={this.handleDrag}
                    autofocus={true}
                    minQueryLength={1}
                    onFocus={this.handleFocus}
                    autocomplete={1} />
          </CardText>
          <CardActions>
            <FloatingActionButton style={style}>
              <i className={"fa fa-remove"} />
            </FloatingActionButton>
            <FloatingActionButton style={style} secondary={true} onClick={updater}>
              <i className={"fa fa-check"} />
            </FloatingActionButton>
          </CardActions>
        </Card>
      </LeftNav>
    );
  }
}
