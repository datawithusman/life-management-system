import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './database/connection';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect Database
connectDB();

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running', 
    timestamp: new Date(),
    message: '🚀 Life Management System Backend'
  });
});

// API Routes (will be added)
// app.use('/api/auth', require('./routes/auth.routes'));
// app.use('/api/study', require('./routes/study.routes'));
// app.use('/api/professional', require('./routes/professional.routes'));
// app.use('/api/expense', require('./routes/expense.routes'));
// app.use('/api/health', require('./routes/health.routes'));
// app.use('/api/islamic', require('./routes/islamic.routes'));
// app.use('/api/business', require('./routes/business.routes'));
// app.use('/api/tasks', require('./routes/task.routes'));
// app.use('/api/goals', require('./routes/goal.routes'));
// app.use('/api/network', require('./routes/network.routes'));
// app.use('/api/dashboard', require('./routes/dashboard.routes'));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/api/health`);
});

export default app;
