import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from 'react-router';
import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import IconButton from 'material-ui/lib/icon-button';

export default class Item extends Component {
  constructor(props, context) {
    super(props, context)
    // debugger
    this.state = {
      editing: false
    }
  }

  stopPropagation(event) {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
  }

  render() {
    return (
      <TableRow key={this.props.index} onCellClick={ (e) => this.props.shower(this.props.index) }>
        <TableRowColumn style={this.props.columnStyle}>{this.props.index + 1}</TableRowColumn>
        <TableRowColumn>
          <Link to={`/viewer/${this.props.file.name}`}>{this.props.file.name}</Link>
        </TableRowColumn>
        <TableRowColumn>
          {_.times(5, (i) => {
            return (
              <IconButton key={this.props.file.name + i} onClick={ (e) => { this.stopPropagation(e); this.props.updater(this.props.file.name, i + 1)} } style={ { fontSize: 15, paddingLeft: 0, width: 20 } }>
                <i className={this.props.file.fav > i ? "fa fa-star" : "fa fa-star-o"}></i>
              </IconButton>
            )
          })}
        </TableRowColumn>
        <TableRowColumn>
          {this.props.file.registered_at}
        </TableRowColumn>
      </TableRow>
    );
  }
}
