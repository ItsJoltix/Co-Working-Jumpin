// app.js

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import reviewRouter from './routers/reviews.js';
import {createReview} from "./db.js";
import highscoreRouter from "./routers/highscores.js";

const app = express();

// Middleware
app.use(morgan('combined'));
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method}: ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello from the server side!' });
});

app.get('/api/v1/status', (req, res) => {
    res.status(200).json({
        status: 'success',
        data: { review: 'review1' },
    });
    res.status(400).json({
        status: 'fail',
        data: null,
    });
    res.status(500).json({
        status: 'error',
        data: null,
    });
});

// CORS configuration
app.use(
    cors({
        origin: [
            /\.voornaamnaam\.ikdoeict\.be$/, // Matches all subdomains under voornaamnaam.ikdoeict.be
            /^(https?:\/\/)?localhost(:\d+)?$/, // Matches localhost with any port
            'https://jellemichiels.ikdoeict.be',
        ],
        methods: 'GET, POST, PUT, DELETE', // Specify the allowed HTTP methods
        allowedHeaders: 'Content-Type, Authorization', // Specify the allowed request headers
    })
);

// Use the reviewRouter for /api/v1/reviews path
app.use('/api/v1/reviews', reviewRouter);

app.use('/api/v1/highscores', highscoreRouter);

export { app };
