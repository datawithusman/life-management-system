import express from 'express';
import {
  createGoal,
  getAllGoals,
  getGoalsByCategory,
  getGoalDetails,
  updateGoalProgress,
  completeMilestone,
  addMilestone,
  deleteGoal,
  getInProgressGoals,
} from '../controllers/goal.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Middleware - All routes require authentication
router.use(authenticate);

// Goals
router.post('/', createGoal);
router.get('/', getAllGoals);
router.get('/in-progress', getInProgressGoals);
router.get('/category/:category', getGoalsByCategory);
router.get('/:goalId', getGoalDetails);
router.put('/:goalId/progress', updateGoalProgress);
router.delete('/:goalId', deleteGoal);

// Milestones
router.post('/:goalId/milestones', addMilestone);
router.put('/:goalId/milestones/:milestoneIndex/complete', completeMilestone);

export default router;
