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
  constructor(props, context) {
    super(props, context);
    console.log("[Detail#constructor] constructor");
    // this.tags = _.clone(props.file.tags);
  }
  handleDelete(i) {
    console.log("[handleDelete] i=", i)
    this.props.tags.splice(i, 1);
    _.forEach(_.range(i, this.props.tags.length), (index) =>
      this.props.tags[index].id = index + 1
    )
  }
  handleAddition(tag) {
    console.log("[handleDelete] tag=", tag)
    this.props.tags.push({ id: this.props.tags.length + 1, text: tag });
  }
  handleDrag(tag, currPos, newPos) {
    console.log(`[handleDelete] tag=${tag} currPos=${currPos} newPos=${newPos}`)
  }
  handleClick() {
    // debugger
    let attrs = { name: this.refs.name.getValue(), tags: this.props.tags }
    this.props.updater(this.props.file.name, attrs)
  }

  render() {
    console.log("[Detail#render]");
    const { file, updater } = this.props;
    let suggestions = ["hoge", "fuga", "foo"];
    return (
      <LeftNav width={300} openRight={true} open={true} >
        <Card>
          <CardText>
            <TextField ref="name" defaultValue={file.name} />
            <ReactTags ref="tag" tags={this.props.tags}
                    suggestions={suggestions}
                    handleDelete={this.handleDelete}
                    handleAddition={this.handleAddition}
                    handleDrag={this.handleDrag}
                    autofocus={true}
                    minQueryLength={1}
                    autocomplete={1} />
          </CardText>
          <CardActions>
            <FloatingActionButton style={style}>
              <i className={"fa fa-remove"} />
            </FloatingActionButton>
            <FloatingActionButton style={style} secondary={true} onClick={this.handleClick.bind(this)}>
              <i className={"fa fa-check"} />
            </FloatingActionButton>
          </CardActions>
        </Card>
      </LeftNav>
    );
  }
}
