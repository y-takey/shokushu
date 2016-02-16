import { db } from './database';

const TARGET = "config";

function get(key) {
  let rec = db(TARGET).find({ key: key })
  if (!rec) {
    rec = { key: key, value: "" }
    db(TARGET).push(rec)
  }
  return rec.value
}

function set(key, value) {
  let rec = db(TARGET).chain().find({ key: key })
  if (rec) {
    rec.assign({ value: value }).value();
  } else {
    db(TARGET).push({ key: key, value: value });
  }
}

export { get, set }
