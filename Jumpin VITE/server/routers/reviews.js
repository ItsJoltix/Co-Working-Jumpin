// routers/reviewRouter.js

import express from 'express';
import { getAllReviews, getSingleReview, postAReview } from '../controllers/reviews.js';


const reviewRouter = express.Router();


reviewRouter.route('/')
    .get(getAllReviews)
    .post(postAReview)

reviewRouter.route('/:id')
    .get(getSingleReview)

export default reviewRouter;
