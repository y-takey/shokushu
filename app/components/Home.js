import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';
import Table from 'material-ui/lib/table/table';
import TableHeader from 'material-ui/lib/table/table-header';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableBody from 'material-ui/lib/table/table-body';
import LeftNav from 'material-ui/lib/left-nav';
import styles from './Home.module.css';
import Item from './Item';
import TagLabels from './TagLabels';
import Detail from './Detail';

import ThemeManager from 'material-ui/lib/styles/theme-manager';
const CustomTheme = {
  fontFamily: "Menlo, Consolas, 'DejaVu Sans Mono', monospace"
}

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
      width: '10px'
    }
  };

  static get childContextTypes() {
    return { muiTheme: React.PropTypes.object };
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(CustomTheme)
    }
  }

  render() {
    const { changeDir, filterTag, sortByName, updateFav, showDetail, saveAttrs, updateName, addTag, deleteTag } = this.props
    const { dirPath, tag, files, selectedFile, tags } = this.props.home

    let detail = null;
    if (selectedFile) {
      detail = <Detail
        file={selectedFile}
        tags={tags}
        updater={saveAttrs}
        updateName={updateName}
        addTag={addTag}
        deleteTag={deleteTag}
      />
    }

    return (
      <div style={ { paddingLeft: 150 } } >
      <RaisedButton label="change" secondary={true} onClick={changeDir} />&nbsp;
      <TextField value={dirPath} disabled={true} style={ { width: '80%' } } inputStyle={ { color: "#424242" } } />

      <LeftNav open={true} width={150}>
        <TagLabels tags={_.keys(tags)} activeTag={tag} handler={filterTag} />
      </LeftNav>

      <Table
        height={Home.tableSettings.height}
        fixedHeader={Home.tableSettings.fixedHeader}
        fixedFooter={Home.tableSettings.fixedFooter}
        selectable={Home.tableSettings.selectable}
        multiSelectable={Home.tableSettings.multiSelectable}
      >
        <TableHeader displaySelectAll={false} adjustForCheckbox={false} enableSelectAll={Home.tableSettings.enableSelectAll}>
          <TableRow onCellClick={sortByName}>
            <TableHeaderColumn style={Home.tableSettings.columnStyle}></TableHeaderColumn>
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
          {files.value().map( (file, index) => {
            return <Item key={file.name} file={file} index={index} columnStyle={Home.tableSettings.columnStyle} updater={updateFav} shower={showDetail}/>;
          })}
        </TableBody>
      </Table>
      { detail }
      </div>
    );
  }
}
