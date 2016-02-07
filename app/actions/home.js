const remote = require('remote');
const dialog = remote.require('dialog');

export const CHANGE_DIR = 'CHANGE_DIR';
export const SORT_BY_NAME = 'SORT_BY_NAME';
export const SHOW_DETAIL = 'SHOW_DETAIL';
export const UPDATE_FAV = 'UPDATE_FAV';
export const UPDATE_ATTRS = 'UPDATE_ATTRS';

const HEADER_COL_NAME = 2
const HEADER_COL_FAV = 3
const HEADER_COL_DATE = 4

const SORT_COL = {
  [HEADER_COL_NAME]: "name",
  [HEADER_COL_FAV]: "fav",
  [HEADER_COL_DATE]: "registered_at"
}

export function changeDir() {
  let dirPaths = dialog.showOpenDialog({ properties: ["openDirectory"] }) || []
  return {
    type: CHANGE_DIR,
    dirPath: dirPaths[0]
  };
}

export function sortByName(event, row, col) {
  let colName = SORT_COL[col] || "name";
  return {
    type: SORT_BY_NAME,
    colName: colName
  };
}

export function showDetail(row) {
  return {
    type: SHOW_DETAIL,
    row: row
  };
}

export function updateFav(name, fav) {
  return {
    type: UPDATE_FAV,
    file: { name: name, fav: fav }
  }
}

export function updateAttrs(name, attrs) {
  console.log("[updateAttrs] arg:", arguments)
  // debugger
  // let colName = SORT_COL[col] || "name";
  return {
    type: UPDATE_ATTRS,
    file: { name: name, attrs: attrs }
  }
}
