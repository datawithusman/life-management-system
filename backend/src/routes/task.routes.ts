import express from 'express';
import {
  createTask,
  getTodayTasks,
  getUpcomingTasks,
  getAllTasks,
  completeTask,
  updateTask,
  deleteTask,
  getTasksByCategory,
} from '../controllers/task.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Middleware - All routes require authentication
router.use(authenticate);

// Tasks
router.post('/', createTask);
router.get('/today', getTodayTasks);
router.get('/upcoming', getUpcomingTasks);
router.get('/all', getAllTasks);
router.get('/by-category', getTasksByCategory);
router.put('/:taskId/complete', completeTask);
router.put('/:taskId', updateTask);
router.delete('/:taskId', deleteTask);

export default router;
