import _ from 'lodash';
import React, { Component } from 'react';
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

export default class Detail extends Component {
  handleDrag(tag, currPos, newPos) {
    // dummy
  }

  render() {
    const { file, updater, updateName, addTag, deleteTag } = this.props;
    let suggestions = ["hoge", "fuga", "foo"];
    return (
      <LeftNav width={300} openRight={true} open={true} >
        <Card>
          <CardText>
            <TextField ref="name" value={file.name} onChange={updateName}/>
            <ReactTags ref="tag" tags={file.tags}
                    suggestions={suggestions}
                    handleDelete={deleteTag}
                    handleAddition={addTag}
                    handleDrag={this.handleDrag}
                    autofocus={true}
                    minQueryLength={1}
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
