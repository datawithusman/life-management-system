import express from 'express';
import {
  createLinkedInPost,
  getPendingLinkedInPosts,
  markPostAsPosted,
  createNetworkingEvent,
  getUpcomingEvents,
  markEventAsAttended,
  createProfessionalGoal,
  getProfessionalGoals,
  updateProfessionalGoal,
} from '../controllers/professional.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Middleware - All routes require authentication
router.use(authenticate);

// LinkedIn Posts
router.post('/posts', createLinkedInPost);
router.get('/posts/pending', getPendingLinkedInPosts);
router.put('/posts/:postId/posted', markPostAsPosted);

// Networking Events
router.post('/events', createNetworkingEvent);
router.get('/events/upcoming', getUpcomingEvents);
router.put('/events/:eventId/attended', markEventAsAttended);

// Professional Goals
router.post('/goals', createProfessionalGoal);
router.get('/goals', getProfessionalGoals);
router.put('/goals/:goalId', updateProfessionalGoal);

export default router;
