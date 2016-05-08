import fs from 'fs';
import _ from 'lodash';
import { db } from './database';
import * as Config from './config'

const TABLE = "videos";

const fileTmpl = {
  name: "",
  fav: 0,
  tags: [],
  registered_at: "",
  last_viewed_at: "",
  viewing_num: 0
};

function dateFormat(date) {
  const pad = (val) => { return ("0" + val).slice(-2); }

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate())
  ].join('/')
}

function all() {
  if (!Config.get("dirPath")) { return _([]) }
  return db(Config.get("dirPath"));
}

function find(condition) {
  return db(Config.get("dirPath")).find(condition)
}

function filterByTag(tag) {
  let temp = db(Config.get("dirPath")).chain()
  return db(Config.get("dirPath")).chain().filter( (video) => {
    return _.some(video.tags, { text: tag })
  });
}

function insert(entity) {
  let attrs = Object.assign(_.cloneDeep(fileTmpl), entity)
  attrs.registered_at = dateFormat(attrs.registered_at)
  return db(Config.get("dirPath")).push(attrs);
}

function update(condition, attrs) {
  let updatables = _.pick(attrs, ['name', 'fav', 'tags', 'bookmarks'])
  if (updatables.tags) {
    updatables.tags = _.sortBy(updatables.tags, "text")
  }
  if (updatables.bookmarks) {
    updatables.bookmarks = _.sortBy(updatables.bookmarks)
  }
  return db(Config.get("dirPath")).chain().find(condition).
    assign(updatables).value()
}

function countupViewing(condition) {
  let file = find(condition);
  file.viewing_num = file.viewing_num || 0;
  ++file.viewing_num;
  file.last_viewed_at = dateFormat(new Date())
  return file
}

export { all, find, filterByTag, insert, update, countupViewing }
