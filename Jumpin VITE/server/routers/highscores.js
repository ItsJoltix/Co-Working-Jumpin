
import express from 'express';
import { getAllHighscores, setAHighscore } from '../controllers/highscores.js';
import {getSingleReview} from "../controllers/reviews.js";
import reviewRouter from "./reviews.js";


const highscoreRouter = express.Router();


highscoreRouter.route('/')
    .get(getAllHighscores)
    .post(setAHighscore)

export default highscoreRouter;
