const remote = require('remote');
const dialog = remote.require('dialog');
const OUTPUT_FILENAME = "./shokushu.json";

import * as types from '../constants/ActionTypes';

export function changeDir() {
  let dirPaths = dialog.showOpenDialog({ properties: ["openDirectory"] }) || []
  return {
    type: types.CHANGE_DIR,
    dirPath: dirPaths[0]
  };
}

export function reloadDir() {
  return {
    type: types.RELOAD_DIR
  };
}

export function filterBy(key, value) {
  return {
    type: types.FILTER_BY,
    key: key,
    value: value
  };
}

export function sortBy(col) {
  return {
    type: types.SORT_BY,
    colName: col
  };
}

export function showDetail(row) {
  return {
    type: types.SHOW_DETAIL,
    row: row
  };
}

export function updateFav(name, fav) {
  return {
    type: types.UPDATE_FAV,
    file: { name: name, fav: fav }
  }
}

export function closeDetail() {
  return {
    type: types.CLOSE_DETAIL
  }
}
export function saveAttrs(name, attrs) {
  return {
    type: types.SAVE_ATTRS
  }
}

export function updateName(event) {
  return {
    type: types.UPDATE_NAME,
    name: event.target.value
  }
}

function updateTags(tags) {
  return {
    type: types.UPDATE_TAGS,
    tags
  }
}

function getCurrentTags(getState) {
  const { home: { selectedFile: { tags } } } = getState()
  return tags
}

export function addTag(tag) {
  return (dispatch, getState) => {
    let tags = getCurrentTags(getState)

    if (_.find(tags, { text: tag })) {
      return;
    }
    tags.push({ id: tags.length + 1, text: tag });

    dispatch(updateTags(tags));
  }
}

export function deleteTag(i) {
  return (dispatch, getState) => {
    let tags = getCurrentTags(getState)

    tags.splice(i, 1);
    _.forEach(_.range(i, tags.length), (index) =>
      tags[index].id = index + 1
    )

    dispatch(updateTags(tags));
  }
}

export function exportJSON() {
  let filename = dialog.showSaveDialog({ defaultPath: OUTPUT_FILENAME });
  return {
    type: types.EXPORT_JSON,
    filename
  }
}

export function importJSON() {
  const options = {
    defaultPath: OUTPUT_FILENAME,
    filters: [{ name: "JSON", extensions: ['json']}],
    properties: ["openFile"]
  }
  let filename = dialog.showOpenDialog(options) || [];
  return {
    type: types.IMPORT_JSON,
    filename: filename[0]
  }
}
