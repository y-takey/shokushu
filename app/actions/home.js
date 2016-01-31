const remote = require('remote');
const dialog = remote.require('dialog');

export const CHANGE_DIR = 'CHANGE_DIR';
export const SORT_BY_NAME = 'SORT_BY_NAME';

export function changeDir() {
  let dirPaths = dialog.showOpenDialog({ properties: ["openDirectory"] }) || []
  return {
    type: CHANGE_DIR,
    dirPath: dirPaths[0]
  };
}

export function sortByName() {
  return {
    type: SORT_BY_NAME
  };
}
