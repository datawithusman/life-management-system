import express from 'express';
import {
  addConnection,
  getAllConnections,
  getConnectionDetails,
  updateConnection,
  getConnectionsNeedingFollowup,
  getConnectionsByStrength,
  searchConnections,
  deleteConnection,
  addTag,
} from '../controllers/network.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Middleware - All routes require authentication
router.use(authenticate);

// Connections
router.post('/', addConnection);
router.get('/', getAllConnections);
router.get('/followup/pending', getConnectionsNeedingFollowup);
router.get('/strength', getConnectionsByStrength);
router.get('/search', searchConnections);
router.get('/:connectionId', getConnectionDetails);
router.put('/:connectionId', updateConnection);
router.delete('/:connectionId', deleteConnection);

// Tags
router.post('/:connectionId/tags', addTag);

export default router;
