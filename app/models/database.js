const remote = require('remote');
const app = remote.require('electron').app;
import path from 'path';
import low from 'lowdb';
import storage from 'lowdb/file-sync';
let dbFilename;
if (process.env.NODE_ENV === 'development') {
  dbFilename = './db.json';
} else {
  dbFilename = path.join(app.getPath('userData'), 'db.json');
}
const db = low(dbFilename, { storage });

export { db, dbFilename };
