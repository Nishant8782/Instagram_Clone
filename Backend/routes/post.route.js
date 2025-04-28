import express from 'express'

import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';

import { addComments, addPost, bookmarkPost, deletePost, dislikePost, getAllPosts, getComments, getUserPost, likePost } from '../controllers/post.controller.js';

const router = express.Router();

router.route('/addpost').post(isAuthenticated, upload.single('image'), addPost);
router.route('/all').get(isAuthenticated, getAllPosts);
router.route('/userpost/all').get(isAuthenticated, getUserPost);
router.route('/:id/like').get(isAuthenticated, likePost);
router.route('/:id/dislike').get(isAuthenticated, dislikePost);
router.route('/:id/comment').post(isAuthenticated, addComments);
router.route('/:id/comment/all').post(isAuthenticated, getComments);
router.route('/delete/:id').get(isAuthenticated, deletePost);
router.route('/:id/bookmark').get(isAuthenticated, bookmarkPost);

export default router;