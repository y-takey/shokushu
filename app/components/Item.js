import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from 'react-router';
import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import IconButton from 'material-ui/lib/icon-button';
import TagLabels from './TagLabels';

const favStyle= {
  fontSize: 15,
  paddingLeft: 0,
  width: 20
}

export default class Item extends Component {
  constructor(props, context) {
    super(props, context)
  }

  stopPropagation(event) {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
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
          {_.times(5, (i) => {
            return (
              <IconButton key={file.name + i} onClick={ (e) => { this.stopPropagation(e); this.props.updater(file.name, i + 1)} } style={ favStyle } className="fav-star">
                <i className={file.fav > i ? "fa fa-star" : "fa fa-star-o"}></i>
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
