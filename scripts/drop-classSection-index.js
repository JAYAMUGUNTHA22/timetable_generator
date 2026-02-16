/**
 * One-time script to drop the classSection index from timetables collection.
 * Run from backend folder: node scripts/drop-classSection-index.js
 * Or with dotenv: node -r dotenv/config scripts/drop-classSection-index.js
 */
require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/college_timetable';

async function run() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const coll = db.collection('timetables');
  const indexes = await coll.indexes();
  for (const idx of indexes) {
    if (idx.name && idx.name.toLowerCase().includes('classsection')) {
      await coll.dropIndex(idx.name);
      console.log('Dropped index:', idx.name);
    }
  }
  console.log('Done. Restart your server and try Generate again.');
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
