import fs from 'fs';
import _ from 'lodash';
const low = require('lowdb')
const storage = require('lowdb/file-sync')
const db = low('db.json', { storage })

import { CHANGE_DIR, SORT_BY_NAME, SHOW_DETAIL, UPDATE_FAV, SAVE_ATTRS, UPDATE_NAME, ADD_TAG, DELETE_TAG } from '../actions/home';

const fileTmpl = { name: "", fav: 0, tags: [], registered_at: "" };

function getConfig(key) {
  let rec = db("config").find({ key: key })
  if (!rec) {
    rec = { key: key, value: "" }
    db("config").push(rec)
  }
  return rec.value
}

function setConfig(key, value) {
  let rec = db("config").chain().find({ key: key })
  rec.assign({ value: value }).value()
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

  let files = [];
  fs.readdirSync(dirPath).map((filename)=> {
    let obj = db("files").find({ name: filename});
    if (!obj) {
      let stats = fs.statSync(dirPath + "/" + filename);
      obj = { name: filename, registered_at: dateFormat(stats.birthtime) }
      db("files").push(Object.assign(_.cloneDeep(fileTmpl), obj))
    }
  })
  return db("files");
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
  db("files").chain().find({ name: file.name }).assign({ fav: file.fav }).value()
  return { files: db("files") };
}

function saveAttrs(state) {
  let file = state.selectedFile
  let origin = db("files").chain().find({ name: file.originName });
  if (origin.name !== file.name) {
    fs.renameSync(state.dirPath + "/" + origin.name, state.dirPath + "/" + file.name);
  }
  origin.assign({ name: file.name, tags: file.tags }).value()
  return { files: db("files") };
}

// file entity is: name, registered_at
let dirPath = getConfig("dirPath");
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
      setConfig("dirPath", action.dirPath)
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
