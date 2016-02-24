import low from 'lowdb';
import storage from 'lowdb/file-sync';
const dbFilename = "./db.json"
const db = low(dbFilename, { storage });

export { db, dbFilename };
