export const ADD_BOOKMARK = 'ADD_BOOKMARK';
export const REMOVE_BOOKMARK = 'REMOVE_BOOKMARK';

export function addBookmark(file, time) {
  return {
    type: ADD_BOOKMARK,
    file: file,
    time: Math.round(time)
  };
}

export function removeBookmark() {
  return {
    type: REMOVE_BOOKMARK,
    index: 1
  };
}
