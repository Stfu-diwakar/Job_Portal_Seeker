const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const errorHandler = require('./middleware/errorHandler');
const seedDatabase = require('./data/seedData');
const Job = require('./models/Job');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health / Status Check Route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Full Stack Job Portal API',
    version: '1.0.0',
    timestamp: new Date()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// 404 Route Not Found
app.use((req, res, next) => {
  res.status(404).json({
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Centralized Error Handling Middleware (Section 13)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Initialize Server
let server;
const startServer = async () => {
  await connectDB();

  // Auto-seed if job collection is empty
  try {
    const jobCount = await Job.countDocuments();
    if (jobCount === 0) {
      console.log('[Server] No jobs detected. Automatically populating initial seed data...');
      await seedDatabase();
    }
  } catch (err) {
    console.warn('[Server] Auto-seed check encountered:', err.message);
  }

  if (process.env.NODE_ENV !== 'test') {
    server = app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(`🚀 Job Portal API running on port ${PORT}`);
      console.log(`🌐 API base: http://localhost:${PORT}/api`);
      console.log(`=========================================`);
    });
  }

  return app;
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = { app, startServer };
