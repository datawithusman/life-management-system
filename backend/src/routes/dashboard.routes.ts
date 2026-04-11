import express from 'express';
import { getDashboardOverview, getWeeklySummary } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Middleware - All routes require authentication
router.use(authenticate);

// Dashboard Endpoints
router.get('/overview', getDashboardOverview);
router.get('/weekly-summary', getWeeklySummary);

export default router;
