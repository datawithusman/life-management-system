import express from 'express';
import {
  addWorkout,
  getTodayWorkouts,
  getMonthlyWorkoutStats,
  getAllWorkouts,
  addHealthMetric,
  getLatestMetric,
  getMetricHistory,
  deleteWorkout,
} from '../controllers/health.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Middleware - All routes require authentication
router.use(authenticate);

// Workouts
router.post('/workouts', addWorkout);
router.get('/workouts/today', getTodayWorkouts);
router.get('/workouts/monthly-stats', getMonthlyWorkoutStats);
router.get('/workouts/all', getAllWorkouts);
router.delete('/workouts/:workoutId', deleteWorkout);

// Health Metrics
router.post('/metrics', addHealthMetric);
router.get('/metrics/latest', getLatestMetric);
router.get('/metrics/history', getMetricHistory);

export default router;
