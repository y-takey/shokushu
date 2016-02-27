const remote = require('remote');
const app = remote.require('electron').app;
import path from 'path';
import low from 'lowdb';
import storage from 'lowdb/file-sync';
const dbFilename = path.join(app.getAppPath(), 'db.json');
const db = low(dbFilename, { storage });

export { db, dbFilename };
