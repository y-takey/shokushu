import low from 'lowdb';
import storage from 'lowdb/file-sync';
const db = low('db.json', { storage });

export { db };
