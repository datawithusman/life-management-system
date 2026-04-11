import express from 'express';
import {
  addCourse,
  getActiveCourses,
  updateCourseProgress,
  getAllCourses,
  addClientFollowup,
  getPendingFollowups,
  getAllClientFollowups,
  updateFollowupStatus,
  addIncomeSource,
  getIncomeSources,
  updateIncomeSource,
  deleteCourse,
} from '../controllers/business.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Middleware - All routes require authentication
router.use(authenticate);

// Courses
router.post('/courses', addCourse);
router.get('/courses/active', getActiveCourses);
router.get('/courses/all', getAllCourses);
router.put('/courses/:courseId/progress', updateCourseProgress);
router.delete('/courses/:courseId', deleteCourse);

// Client Followups
router.post('/followups', addClientFollowup);
router.get('/followups/pending', getPendingFollowups);
router.get('/followups/all', getAllClientFollowups);
router.put('/followups/:followupId', updateFollowupStatus);

// Income Sources
router.post('/income', addIncomeSource);
router.get('/income', getIncomeSources);
router.put('/income/:sourceId', updateIncomeSource);

export default router;
