import express from 'express';
import {
  recordPractice,
  getTodayPractices,
  getWeeklyStats,
  getAllPractices,
  addQuranProgress,
  getQuranProgress,
  getCurrentQuranSurah,
  deletePractice,
} from '../controllers/islamic.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Middleware - All routes require authentication
router.use(authenticate);

// Islamic Practices
router.post('/practices', recordPractice);
router.get('/practices/today', getTodayPractices);
router.get('/practices/weekly-stats', getWeeklyStats);
router.get('/practices/all', getAllPractices);
router.delete('/practices/:practiceId', deletePractice);

// Quran Progress
router.post('/quran', addQuranProgress);
router.get('/quran/progress', getQuranProgress);
router.get('/quran/current', getCurrentQuranSurah);

export default router;
