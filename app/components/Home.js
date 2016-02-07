import _ from 'lodash';
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
import Detail from './Detail';

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

  render() {
    const { changeDir, sortByName, updateFav, showDetail, updateAttrs } = this.props
    const { dirPath, files, selectedIndex } = this.props.home

    let detail = null;
    if (selectedIndex >= 0) {
      let file = files[selectedIndex]
      detail = <Detail file={file} tags={_.clone(file.tags)} updater={updateAttrs} />
    }

    return (
      <div>
      ディレクトリ:{dirPath}  <RaisedButton label="変更" secondary={true} onClick={changeDir} />
      <Table
        height={Home.tableSettings.height}
        fixedHeader={Home.tableSettings.fixedHeader}
        fixedFooter={Home.tableSettings.fixedFooter}
        selectable={Home.tableSettings.selectable}
        multiSelectable={Home.tableSettings.multiSelectable}
      >
        <TableHeader displaySelectAll={false} adjustForCheckbox={false} enableSelectAll={Home.tableSettings.enableSelectAll}>
          <TableRow onCellClick={sortByName}>
            <TableHeaderColumn style={Home.tableSettings.columnStyle}>ID</TableHeaderColumn>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Fav</TableHeaderColumn>
            <TableHeaderColumn>registered at</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          deselectOnClickaway={Home.tableSettings.deselectOnClickaway}
          showRowHover={Home.tableSettings.showRowHover}
          stripedRows={Home.tableSettings.stripedRows}
        >
          {files.map( (file, index) => {
            return <Item key={file.name} file={file} index={index} columnStyle={Home.tableSettings.columnStyle} updater={updateFav} shower={showDetail}/>;
          })}
        </TableBody>
      </Table>
      { detail }
      </div>
    );
  }
}
