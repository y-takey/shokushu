import fs from 'fs';
import _ from 'lodash';
import { db, dbFilename } from '../models/database';
import * as Config from '../models/config'
import * as Video from '../models/video'
import * as types from '../constants/ActionTypes';

function dateFormat(date) {
  const pad = (val) => { return ("0" + val).slice(-2); }

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate())
  ].join('/')
}

function getFiles(state, { filter, sorter } = {} ) {
  filter = filter || state.filter;
  sorter = sorter || state.sorter;
  let files;

  if (filter.tag) {
    files = Video.filterByTag(filter.tag)
  } else {
    files = Video.all().chain()
  }
  if (filter.fav) {
    files = files.filter({ fav: filter.fav })
  }

  return files.orderBy([sorter.colName], [sorter.order]);
}

function loadFiles() {
  let dirPath = Config.get("dirPath")
  if (!dirPath) { return }

  fs.readdirSync(dirPath).map((filename)=> {
    let obj = Video.find({ name: filename});
    if (obj) { return }
    if (!filename.match(/.+\.(mp4|ogv|webm)$/i)) { return }

    let stats = fs.statSync(dirPath + "/" + filename);
    obj = { name: filename, registered_at: dateFormat(stats.birthtime) }
    Video.insert(obj)
  })
}

function reloadDir(state, action) {
  loadFiles()
  return { files: getFiles(state) }
}

function changeDir(state, action) {
  if (!action.dirPath) { return state }

  Config.set("dirPath", action.dirPath)
  loadFiles()
  return { dirPath: action.dirPath, files: getFiles(state) }
}

function filterBy(state, action) {
  let filter = state.filter || {}

  if (filter[action.key] === action.value) {
    delete filter[action.key];
  } else {
    filter[action.key] = action.value;
  }

  return { filter: filter, files: getFiles(state, { filter: filter }) }
}

function sortBy(state, action) {
  let colName = action.colName
  let sorter = { colName: colName, order: "asc" };
  if (state.sorter.colName == colName && state.sorter.order == "asc") {
    sorter.order = "desc";
  }

  return { sorter: sorter, files: getFiles(state, { sorter: sorter }),
    selectedFile: undefined };
}

function showDetail(state, action) {
  let file = _.cloneDeep(state.files.get(action.row).value());
  file.originName = file.name;
  return { selectedFile: file };
}

function updateFav(state, action) {
  let attrs = _.pick(action.file, ['fav'])
  Video.update({ name: action.file.name }, attrs);
  return { files: getFiles(state) };
}

function saveAttrs(state, atcion) {
  let video = state.selectedFile
  if (video.originName !== video.name) {
    fs.renameSync(state.dirPath + "/" + video.originName, state.dirPath + "/" + video.name);
  }
  Video.update({ name: video.originName }, video);
  return { files: getFiles(state), tags: refreshTags(), selectedFile: undefined };
}

function closeDetail(state, action) {
  return { selectedFile: undefined };
}

function refreshTags() {
  let tags = Video.all().transform( (result, video)=> {
    _.each(video.tags, (tag)=> {
      result[tag.text] = result[tag.text] || 0;
      result[tag.text]++;
    })
  }, {})
  Config.set("tags", tags);
  return tags;
}

function updateName(state, action) {
  state.selectedFile.name = action.name
  return { selectedFile: state.selectedFile };
}

function updateTags(state, action) {
  state.selectedFile.tags = action.tags;
  return { selectedFile: state.selectedFile };
}

function exportJSON(state, action) {
  db.write(action.filename)

  return state
}

function importJSON(state, action) {
  if (!action.filename) { return state }

  fs.writeFileSync(dbFilename, fs.readFileSync(action.filename))
  db.read()

  return { files: getFiles(state) }
}

const initialSorter = { colName: "name", order: "asc" }
const initialFilter = {}
const initialState = {
  dirPath: Config.get("dirPath"),
  sorter: initialSorter,
  filter: initialFilter,
  files: getFiles(null, { sorter: initialSorter, filter: initialFilter }),
  tags: Config.get("tags") || []
}

const dispatcher = {
  [types.CHANGE_DIR]: changeDir,
  [types.RELOAD_DIR]: reloadDir,
  [types.FILTER_BY]: filterBy,
  [types.SORT_BY]: sortBy,
  [types.SHOW_DETAIL]: showDetail,
  [types.UPDATE_FAV]: updateFav,
  [types.SAVE_ATTRS]: saveAttrs,
  [types.CLOSE_DETAIL]: closeDetail,
  [types.UPDATE_NAME]: updateName,
  [types.UPDATE_TAGS]: updateTags,
  [types.EXPORT_JSON]: exportJSON,
  [types.IMPORT_JSON]: importJSON
}

export default function home(state = initialState, action) {
  let proc = dispatcher[action.type];
  if (!proc) {
    console.log("default reducer:", action.type)
    return state;
  }

  let newProp = proc(state, action);
  return Object.assign({}, state, newProp);
}
