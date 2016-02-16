import fs from 'fs';
import _ from 'lodash';
import { db } from './database';

const TABLE = "videos";

const fileTmpl = { name: "", fav: 0, tags: [], registered_at: "" };


function all() {
  return db(TABLE);
}

function find(condition) {
  return db(TABLE).find(condition)
}

function filterByTag(tag) {
  let temp = db(TABLE).chain()
  return db(TABLE).chain().filter( (video) => {
    return _.some(video.tags, { text: tag })
  });
}

function insert(entity) {
  attrs = Object.assign(_.cloneDeep(fileTmpl), entity)
  return db(TABLE).push(attrs);
}

function update(condition, attrs) {
  let updatables = _.pick(attrs, ['name', 'fav', 'tags'])
  return db(TABLE).chain().find(condition).
    assign(updatables).value()
}

export { all, find, filterByTag, insert, update }
