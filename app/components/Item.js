import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from 'react-router';
import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TagLabels from './TagLabels';
import FavStars from './FavStars';

export default class Item extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    const { index, file } = this.props
    let tags = _.map(file.tags, "text");

    return (
      <TableRow key={index} onCellClick={ (e) => this.props.shower(index) }>
        <TableRowColumn style={this.props.columnStyle}>{index + 1}</TableRowColumn>
        <TableRowColumn>
          <Link to={`/viewer/${file.name}`} state={ { file: file } } style={ { fontSize: 16 } }>{file.name}</Link>
          <TagLabels tags={tags} />
        </TableRowColumn>
        <TableRowColumn>
          <FavStars fav={file.fav} onClick={ (i) => { this.props.updater(file.name, i + 1)} } />
        </TableRowColumn>
        <TableRowColumn>
          {this.props.file.registered_at}
        </TableRowColumn>
      </TableRow>
    );
  }
}
