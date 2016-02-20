import * as Video from '../models/video'
import { ADD_BOOKMARK, REMOVE_BOOKMARK } from '../actions/viewer';
import { SHOW_DETAIL } from '../actions/home';

function addBookmark(state, action) {
  console.log("[viewer#addBookmark]")
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
  console.log("[viewer#removeBookmark]")
  return { bookmarks: [] }
}


// const initialState = {
//   dirPath: Config.get("dirPath"),
//   files: getFiles(),
//   sorter: { colName: "name", order: "asc" },
//   tags: Config.get("tags") || []
// }

console.log("viewer this 1:", this)

const dispatcher = {
  [ADD_BOOKMARK]: addBookmark,
  [REMOVE_BOOKMARK]: removeBookmark
}

export default function home(state = {}, action) {
  console.log("viewer this 2:", this)
  let proc = dispatcher[action.type];
  if (!proc) {
    console.log("[viewer]default reducer:", action.type)
    return state;
  }

  let newProp = proc(state, action);
  return Object.assign({}, state, newProp);
}
