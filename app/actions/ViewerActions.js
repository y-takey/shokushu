import * as types from '../constants/ActionTypes';

export function addBookmark(file, time) {
  return {
    type: types.ADD_BOOKMARK,
    file: file,
    time: Math.round(time)
  };
}

export function removeBookmark(file, bookmark) {
  return {
    type: types.REMOVE_BOOKMARK,
    file: file,
    bookmark: bookmark
  };
}
