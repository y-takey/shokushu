import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from 'react-router';
import IconButton from 'material-ui/lib/icon-button';
import TextField from 'material-ui/lib/text-field';
import List from 'material-ui/lib/lists/list';
import LeftNav from 'material-ui/lib/left-nav';
import Color from 'material-ui/lib/styles/colors';
import Infinite from 'react-infinite';
import Item from './Item';
import Sidebar from './Sidebar';
import TagLabels from './TagLabels';
import Detail from './Detail';

import ThemeManager from 'material-ui/lib/styles/theme-manager';
const CustomTheme = {
  fontFamily: "Menlo, Consolas, 'DejaVu Sans Mono', monospace"
}

const buttonStyle = {
  color: Color.cyan500
}

const sidebarWidth = 180;

export default class Home extends Component {

  static get childContextTypes() {
    return { muiTheme: React.PropTypes.object };
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(CustomTheme)
    }
  }

  listItems() {
    const { updateFav, showDetail } = this.props
    const { files } = this.props.home
    return files.value().map( (file, index) => {
      return <Item
        key={index}
        file={file}
        index={index}
        updater={updateFav}
        shower={showDetail}
      />
    })
  }

  detailItem() {
    const { saveAttrs, closeDetail, updateName, addTag, deleteTag } = this.props
    const { selectedFile, tags } = this.props.home

    if (!selectedFile) { return null; }

    return <Detail
      file={selectedFile}
      tags={tags}
      updater={saveAttrs}
      updateName={updateName}
      addTag={addTag}
      deleteTag={deleteTag}
      closer={closeDetail}
    />
  }

  render() {
    const { changeDir, reloadDir, filterBy, sortBy } = this.props
    const { dirPath, tags, sorter, filter } = this.props.home
    // body's height - dirPath's height - e.t.c(margin, padding)
    let containerHight = document.body.clientHeight - 48 - 50

    return (
      <div style={ { paddingLeft: sidebarWidth } } >
      <IconButton
        iconClassName="fa fa-folder-open"
        tooltip="select"
        iconStyle={ buttonStyle }
        onClick={ changeDir }
      />
      <TextField value={dirPath} disabled={true} style={ { width: '75%' } } inputStyle={ { color: "#424242" } } />
      <IconButton
        iconClassName="fa fa-refresh"
        tooltip="refresh"
        iconStyle={ buttonStyle }
        onClick={ reloadDir }
      />

      <Sidebar sortBy={sortBy} sorter={sorter} filterBy={filterBy} filter={filter} tags={tags} width={sidebarWidth} />

      <List>
      <Infinite containerHeight={containerHight} elementHeight={ 68 }>
        { this.listItems() }
      </Infinite>
      </List>
      { this.detailItem() }
      </div>
    );
  }
}
