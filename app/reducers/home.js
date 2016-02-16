import fs from 'fs';
import _ from 'lodash';
import * as Config from '../models/config'
import * as Video from '../models/video'

import { CHANGE_DIR, FILTER_TAG, SORT_BY_NAME, SHOW_DETAIL,
  UPDATE_FAV, SAVE_ATTRS, UPDATE_NAME, ADD_TAG, DELETE_TAG } from '../actions/home';

function dateFormat(date) {
  const pad = (val) => { return ("0" + val).slice(-2); }

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate())
  ].join('/')
}

function getFiles() {
  let dirPath = Config.get("dirPath")
  if (!dirPath) {
    return _([]);
  }

  fs.readdirSync(dirPath).map((filename)=> {
    let obj = Video.find({ name: filename});
    if (!obj) {
      let stats = fs.statSync(dirPath + "/" + filename);
      obj = { name: filename, registered_at: dateFormat(stats.birthtime) }
      Video.insert(obj)
    }
  })
  return Video.all();
}

function changeDir(state, action) {
  Config.set("dirPath", action.dirPath)
  return { dirPath: action.dirPath, files: getFiles() }
}

function filterTag(state, action) {
  let tag, files;

  if (state.tag === action.tag) {
    tag = undefined;
    files = Video.all();
  } else {
    tag = action.tag
    files = Video.filterByTag(tag)
  }
  return { tag: tag, files: files }
}

function sortBy(state, action) {
  let colName = action.colName
  let sorter = { colName: colName, order: "asc" };
  if (state.sorter.colName == colName && state.sorter.order == "asc") {
    sorter.order = "desc";
  }
  let files = state.files.chain().orderBy([colName], [sorter.order]);
  return { sorter: sorter, files: files, selectedFile: undefined };
}

function showDetail(state, action) {
  let file = _.cloneDeep(state.files.get(action.row));
  file.originName = file.name;
  return { selectedFile: file };
}

function updateFav(state, action) {
  Video.update({ name: action.file.name }, action.file);
  return { files: Video.all() };
}

function saveAttrs(state, atcion) {
  let video = state.selectedFile
  if (video.originName !== video.name) {
    fs.renameSync(state.dirPath + "/" + video.originName, state.dirPath + "/" + video.name);
  }
  Video.update({ name: video.originName }, video);
  return { files: Video.all(), tags: refreshTags() };
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

function addTag(state, action) {
  let tags = state.selectedFile.tags;
  tags.push({ id: tags.length + 1, text: action.tag });
  return { selectedFile: state.selectedFile };
}

function deleteTag(state, action) {
  let tags = state.selectedFile.tags;
  tags.splice(action.index, 1);
  _.forEach(_.range(action.index, tags.length), (index) =>
    tags[index].id = index + 1
  )
  return { selectedFile: state.selectedFile };
}

const initialState = {
  dirPath: Config.get("dirPath"),
  files: getFiles(),
  sorter: { colName: "name", order: "asc" },
  tags: Config.get("tags") || []
}

const dispatcher = {
  [CHANGE_DIR]: changeDir,
  [FILTER_TAG]: filterTag,
  [SORT_BY_NAME]: sortBy,
  [SHOW_DETAIL]: showDetail,
  [UPDATE_FAV]: updateFav,
  [SAVE_ATTRS]: saveAttrs,
  [UPDATE_NAME]: updateName,
  [ADD_TAG]: addTag,
  [DELETE_TAG]: deleteTag
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
