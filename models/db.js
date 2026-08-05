const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '..', 'database', 'database.db');
const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Ensure schema exists even if seed.js was never run manually
const schema = fs.readFileSync(schemaPath, 'utf8');
db.exec(schema);

module.exports = db;
