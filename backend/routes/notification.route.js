// new 
import express from 'express';
import { createFollowRequest, respondToFollowRequest, getNotifications } from '../controllers/notification.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

router.route('/followrequest/:id').post(isAuthenticated, createFollowRequest);
router.route('/respond/:id').post(isAuthenticated, respondToFollowRequest);
router.route('/:id').get(isAuthenticated, getNotifications);

export default router;