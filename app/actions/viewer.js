export const ADD_BOOKMARK = 'ADD_BOOKMARK';
export const REMOVE_BOOKMARK = 'REMOVE_BOOKMARK';

export function addBookmark(file, time) {
  return {
    type: ADD_BOOKMARK,
    file: file,
    time: Math.round(time)
  };
}

export function removeBookmark(file, bookmark) {
  return {
    type: REMOVE_BOOKMARK,
    file: file,
    bookmark: bookmark
  };
}
