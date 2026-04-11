import express from 'express';
import {
  addStudySession,
  getStudySessions,
  getTodayStudyHours,
  createStudyGoal,
  getStudyGoals,
  updateStudyGoal,
  deleteStudySession,
} from '../controllers/study.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Middleware - All routes require authentication
router.use(authenticate);

// Study Sessions
router.post('/sessions', addStudySession);
router.get('/sessions', getStudySessions);
router.get('/today', getTodayStudyHours);
router.delete('/sessions/:sessionId', deleteStudySession);

// Study Goals
router.post('/goals', createStudyGoal);
router.get('/goals', getStudyGoals);
router.put('/goals/:goalId', updateStudyGoal);

export default router;
