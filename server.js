require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
// import "express" from express;
const academicConfigRoutes = require('./routes/academicConfig');
const departmentRoutes = require('./routes/departments');
const subjectRoutes = require('./routes/subjects');
const facultyRoutes = require('./routes/faculty');
const timetableRoutes = require('./routes/timetables');
const authRoutes = require('./routes/auth');
const selfRoutes = require('./routes/self');
const publicRoutes = require('./routes/public');
const { ensureDefaultAdmin } = require('./config/seedAdmin');

const Subject = require('./models/Subject');
const Timetable = require('./models/Timetable');

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/me', selfRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/config', academicConfigRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/timetables', timetableRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  await ensureDefaultAdmin();
  try {
    await Subject.collection.dropIndex('code_1');
    console.log('Dropped old subjects code_1 index (fixes E11000 duplicate key).');
  } catch (e) {
    if (e.code !== 27) console.log('Subjects index note:', e.message);
  }
  try {
    await Timetable.collection.dropIndex('classSection_1');
    console.log('Dropped old timetables classSection_1 index (fixes E11000 duplicate key).');
  } catch (e) {
    if (e.code !== 27) console.log('Timetables index note:', e.message);
  }
  app.listen(PORT, () => console.log('Server running on port ' + PORT));
}

start().catch((err) => {
  console.error('Startup error:', err);
  process.exit(1);
});
