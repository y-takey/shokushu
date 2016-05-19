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

function similars_with_name(file) {
  const prefix = file.name.slice(0, file.name.length * 0.5)
  return all().filter((other) => {
    return _.startsWith(other.name, prefix) &&
      other.name !== file.name
  })
}

function similars_with_tags(file) {
  const FAV_LIMIT = 4
  const text = f => f.text
  const originTags = file.tags.map(text)
  let date = new Date();
  date.setMonth(date.getMonth() - 1);
  const formattedDate = dateFormat(date);
  return all().filter((other) => {
    return (!other.fav || other.fav >= FAV_LIMIT) &&
      (!other.last_viewed_at || other.last_viewed_at < formattedDate) &&
      (!_.isEmpty(_.intersection(originTags, other.tags.map(text)))) &&
      other.name !== file.name
  });
}

function similars(file) {
  const MAX_SIZE = 20
  let ret = similars_with_name(file)
  let ret2 = similars_with_tags(file)
  // delete duplicated
  _.pullAll(ret2, ret)

  return _.flatten([ret, _.sampleSize(ret2, MAX_SIZE - ret.length)])
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

export { all, find, filterByTag, insert, update, countupViewing, similars }
