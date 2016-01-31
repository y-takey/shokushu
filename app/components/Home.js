import React, { Component } from 'react';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/lib/raised-button';
import Table from 'material-ui/lib/table/table';
import TableHeader from 'material-ui/lib/table/table-header';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableBody from 'material-ui/lib/table/table-body';
import styles from './Home.module.css';
import Item from './Item';


export default class Home extends Component {

  static tableSettings = {
    fixedHeader: true,
    fixedFooter: true,
    stripedRows: true,
    showRowHover: false,
    selectable: true,
    multiSelectable: false,
    enableSelectAll: false,
    deselectOnClickaway: true,
    height: '400px',
    columnStyle: {
      width: '50px'
    }
  };

  onHeaderClick(event, row, col) {
    console.log(`[onRowSelection] clicked. row=${row} col=${col}`)
    switch (col) {
      case 1:
        console.log("  -> is ID.");
        break;
      case 2:
        console.log("  -> is Name.");
        break;
    }
  }
  render() {
    const { changeDir } = this.props
    const { dirPath, files } = this.props.home

    return (
      <div>
      ディレクトリ:{dirPath}<RaisedButton label="変更" secondary={true} onClick={changeDir} />
      <Table
        height={Home.tableSettings.height}
        fixedHeader={Home.tableSettings.fixedHeader}
        fixedFooter={Home.tableSettings.fixedFooter}
        selectable={Home.tableSettings.selectable}
        multiSelectable={Home.tableSettings.multiSelectable}
      >
        <TableHeader displaySelectAll={false} adjustForCheckbox={false} enableSelectAll={Home.tableSettings.enableSelectAll}>
          <TableRow onCellClick={this.onHeaderClick}>
            <TableHeaderColumn tooltip="The ID" style={Home.tableSettings.columnStyle}>ID</TableHeaderColumn>
            <TableHeaderColumn tooltip="The Name">Name</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          deselectOnClickaway={Home.tableSettings.deselectOnClickaway}
          showRowHover={Home.tableSettings.showRowHover}
          stripedRows={Home.tableSettings.stripedRows}
        >
          {files.map( (filename, index) => {
            return <Item key={filename} filename={filename} index={index} columnStyle={Home.tableSettings.columnStyle} />;
          })}
        </TableBody>
      </Table>
      </div>
    );
  }
}
