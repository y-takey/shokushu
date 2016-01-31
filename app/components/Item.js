import React, { Component } from 'react';
import { Link } from 'react-router';
import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';

export default class Item extends Component {
  render() {
    return (
      <TableRow key={this.props.index}>
        <TableRowColumn style={this.props.columnStyle}>{this.props.index + 1}</TableRowColumn>
        <TableRowColumn>
          <Link to={`/viewer/${this.props.filename}`}>{this.props.filename}</Link>
        </TableRowColumn>
      </TableRow>
    );
  }
}
