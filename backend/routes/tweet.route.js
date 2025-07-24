import express from 'express';
import { CreateTweet, DeleteTweet, getAllTweets, getFollowingTweets, LikeOrDislike, CommentOnTweet } from '../controllers/tweet.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../utils/multer.js';

const router = express.Router();

router.route('/createtweet').post(isAuthenticated, upload.single('image'), CreateTweet);
router.route('/delete/:id').delete(isAuthenticated, DeleteTweet);
router.route('/like/:id').put(isAuthenticated, LikeOrDislike);
router.route('/comment/:id').post(isAuthenticated, CommentOnTweet);
router.route('/alltweets/:id').get(isAuthenticated, getAllTweets);
router.route('/followingtweets/:id').get(isAuthenticated, getFollowingTweets);

export default router;