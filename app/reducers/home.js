import fs from 'fs';
import _ from 'lodash';
import { CHANGE_DIR, SORT_BY_NAME, SHOW_DETAIL, UPDATE_FAV, UPDATE_ATTRS } from '../actions/home';

const fileTmpl = { name: "", fav: 0, tags: [], registered_at: "" };

function saveFiles(files) {
  localStorage.setItem("files", JSON.stringify(files));
}

function loadFiles() {
  let files = localStorage.getItem("files");
  if (files) {
    files = JSON.parse(files);
  } else {
    files = [];
  }
  return _(files);
}

function dateFormat(date) {
  const pad = (val) => { return ("0" + val).slice(-2); }

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate())
  ].join('/')
}

function getFiles(dirPath) {
  if (!dirPath) {
    return [];
  }

  let master = loadFiles();
  let files = [];
  fs.readdirSync(dirPath).map((filename)=> {
    let obj = master.find({ name: filename});
    if (!obj) {
      let stats = fs.statSync(dirPath + "/" + filename);
      obj = { name: filename, registered_at: dateFormat(stats.birthtime) }
    }
    files.push(Object.assign({}, fileTmpl, obj))
  })
  return files;
}

function sortBy(state, colName) {
  let sorter = { colName: colName, order: "asc" };
  if (state.sorter.colName == colName && state.sorter.order == "asc") {
    sorter.order = "desc";
  }
  let files = _.orderBy(state.files, [colName], [sorter.order]);
  return { sorter: sorter, files: files };
}

function updateFav(state, file) {
  let idx = _.findIndex(state.files, { name: file.name })
  state.files[idx].fav = file.fav
  saveFiles(state.files)
  return { files: state.files };
}

function updateAttrs(state, file) {
  let idx = _.findIndex(state.files, { name: file.name });
  let origin = state.files[idx];
  if (file.name !== file.attrs.name) {
    fs.renameSync(state.dirPath + "/" + file.name, state.dirPath + "/" + file.attrs.name);
  }
  Object.assign(origin, file.attrs);
  saveFiles(state.files);
  return { files: state.files };
}

// file entity is: name, registered_at
let dirPath = localStorage.getItem("dirPath");
const initialState = {
  dirPath: dirPath,
  files: getFiles(dirPath),
  sorter: { colName: "name", order: "asc" },
  tags: []
}

export default function home(state = initialState, action) {
  let newPropeties
  switch (action.type) {
    case CHANGE_DIR:
      newPropeties = { dirPath: action.dirPath, files: getFiles(action.dirPath) }
      localStorage.setItem("dirPath", action.dirPath)
      let newState = Object.assign({}, state, newPropeties);

      return newState;
    case SORT_BY_NAME:
      newPropeties = sortBy(state, action.colName)
      newPropeties.selectedIndex = undefined;
      return Object.assign({}, state, newPropeties);
    case SHOW_DETAIL:
      return Object.assign({}, state, { selectedIndex: action.row });
    case UPDATE_FAV:
      newPropeties = updateFav(state, action.file)
      return Object.assign({}, state, newPropeties);
    case UPDATE_ATTRS:
      newPropeties = updateAttrs(state, action.file)
      return Object.assign({}, state, newPropeties);
    default:
      return state;
  }
}
