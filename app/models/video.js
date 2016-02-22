import fs from 'fs';
import _ from 'lodash';
import { db } from './database';
import * as Config from './config'

const TABLE = "videos";

const fileTmpl = { name: "", fav: 0, tags: [], registered_at: "" };


function all() {
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
  return db(Config.get("dirPath")).push(attrs);
}

function update(condition, attrs) {
  let updatables = _.pick(attrs, ['name', 'fav', 'tags', 'bookmarks'])
  return db(Config.get("dirPath")).chain().find(condition).
    assign(updatables).value()
}

export { all, find, filterByTag, insert, update }
