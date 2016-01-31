import fs from 'fs';
import { CHANGE_DIR, SORT_BY_NAME } from '../actions/home';

function getFiles(dirPath) {
  if (!dirPath) {
    return [];
  }
  return fs.readdirSync(dirPath);
}

// file entity is: name, registered_at
let dirPath = localStorage.getItem("dirPath")
const initialState = {
  dirPath: dirPath,
  files: getFiles(dirPath),
  tags: []
}

export default function viewer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_DIR:
      console.log("[Reduce#change_dir]", state.dirPath)

      let newPropeties = { dirPath: action.dirPath, files: getFiles(action.dirPath) }
      localStorage.setItem("dirPath", action.dirPath)
      let newState = Object.assign({}, state, newPropeties);

      return newState;
    case SORT_BY_NAME:
      newState = Object.assign({}, obj);
      return newState;
    default:
      return state;
  }
}
