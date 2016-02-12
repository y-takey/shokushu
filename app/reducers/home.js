import fs from 'fs';
import _ from 'lodash';
import { CHANGE_DIR, SORT_BY_NAME, SHOW_DETAIL, UPDATE_FAV, SAVE_ATTRS, UPDATE_NAME, ADD_TAG, DELETE_TAG } from '../actions/home';

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
    files.push(Object.assign(_.cloneDeep(fileTmpl), obj))
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

function saveAttrs(state) {
  let file = state.selectedFile
  let idx = _.findIndex(state.files, { name: file.originName });
  let origin = state.files[idx];
  if (origin.name !== file.name) {
    fs.renameSync(state.dirPath + "/" + origin.name, state.dirPath + "/" + file.name);
  }
  Object.assign(origin, file);
  delete origin.originName
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
  let tags
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
      let file = _.cloneDeep(state.files[action.row])
      file.originName = file.name
      return Object.assign({}, state, { selectedFile: file });
    case UPDATE_FAV:
      newPropeties = updateFav(state, action.file)
      return Object.assign({}, state, newPropeties);
    case SAVE_ATTRS:
      newPropeties = saveAttrs(state)
      return Object.assign({}, state, newPropeties);
    case UPDATE_NAME:
      state.selectedFile.name = action.name
      return Object.assign({}, state, { selectedFile: state.selectedFile });
    case ADD_TAG:
      tags = state.selectedFile.tags;
      tags.push({ id: tags.length + 1, text: action.tag });
      return Object.assign({}, state, { selectedFile: state.selectedFile });
    case DELETE_TAG:
      tags = state.selectedFile.tags;
      tags.splice(action.index, 1);
      _.forEach(_.range(action.index, tags.length), (index) =>
        tags[index].id = index + 1
      )
      return Object.assign({}, state, { selectedFile: state.selectedFile });
    default:
      console.log("default reducer:", action.type)
      return state;
  }
}
