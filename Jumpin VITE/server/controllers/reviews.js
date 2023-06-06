// controllers/reviewController.js

import { getReviews, getReview, createReview } from '../db.js';
import { app } from "../app.js";

export async function getAllReviews(req, res) {
    const sortBy = req.query.sortBy;
    const sortOrder = req.query.sortOrder;

    let reviews = await getReviews();

    if (sortBy === 'score') {
        if (sortOrder === 'asc') {
            reviews.sort((a, b) => a.score - b.score); // ASCENDING SORTEREN VAN SCORE
        } else if (sortOrder === 'desc') {
            reviews.sort((a, b) => b.score - a.score); // DESCENDING SORTEREN VAN SCORE
        }
    } else if (sortBy === 'date') {
        if (sortOrder === 'asc') {
            reviews.sort((a, b) => new Date(a.time) - new Date(b.time)); // ASCENDING SORTEREN VAN DATUM
        } else if (sortOrder === 'desc') {
            reviews.sort((a, b) => new Date(b.time) - new Date(a.time)); // DESCENDING SORTEN VAN DATUM
        }
    } else if (sortBy === '') {
        res.status(200).send(reviews);
        return;
    }

    const formattedReviews = reviews.map(review => {
        return {
            ...review,
            time: formatTime(review.time)
        };
    });

    res.status(200).send(formattedReviews);
}

// FUNCTIE OM DE VERKREGEN DATUM + UUR TE FORMATREN ZODAT DE MS EN DE T EN Z WEG ZIJN
function formatTime(time) {
    return new Date(time).toLocaleString('nl-EU', { timeZone: 'GMT', hour12: false });
}

export async function getSingleReview(req, res) {
    const id = +req.params.id;
    const note = await getReview(id);

    if (note) {
        const formattedNote = {
            ...note[0], // WANT HET IS GENEST ANDERS KAN DE FORMATTIME NIET ZIJN WERK DOEN
            time: formatTime(note[0].time)
        };
        res.status(200).send(formattedNote);
    } else {
        res.status(404).send({ error: 'Review not found' });
    }
}

export async function postAReview(req, res) {
    const { fname, name, email, message, score } = req.body
    const review = await createReview(fname, name, email, message, score);
    res.status(201).send(review)
}
