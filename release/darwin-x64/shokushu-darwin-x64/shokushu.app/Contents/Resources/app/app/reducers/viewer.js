import * as Video from '../models/video'
import * as types from '../constants/ActionTypes';

function view(state, action) {
  let file = Video.countupViewing({ name: action.file.name });
  return { file: file }
}

function addBookmark(state, action) {
  let bookmarks = action.file.bookmarks || []
  let time = action.time
  if (_.includes(bookmarks, time)) {
    return
  }
  bookmarks.push(time)
  Video.update({ name: action.file.name }, { bookmarks: _.sortBy(bookmarks) });
  action.file.bookmarks = bookmarks
  return { file: action.file }
}

function removeBookmark(state, action) {
  let bookmarks = action.file.bookmarks || []
  _.pull(bookmarks, action.bookmark)
  Video.update({ name: action.file.name }, { bookmarks: bookmarks });
  action.file.bookmarks = bookmarks
  return { file: action.file }
}

const dispatcher = {
  [types.VIEW_VIDEO]: view,
  [types.ADD_BOOKMARK]: addBookmark,
  [types.REMOVE_BOOKMARK]: removeBookmark
}

export default function viewer(state = {}, action) {
  let proc = dispatcher[action.type];
  if (!proc) {
    return state;
  }

  let newProp = proc(state, action);
  return Object.assign({}, state, newProp);
}
