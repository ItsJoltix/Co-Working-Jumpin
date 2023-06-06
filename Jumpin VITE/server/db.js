// db.js

import mysql from 'mysql2';

// Create a connection pool
export const pool = mysql.createPool({
    host: 'localhost',
    user: 'express',
    password: 'Azerty123',
    database: 'smartgame',
}).promise();

export async function getReviews(){
    const [rows] = await pool.query(`SELECT * FROM reviews`)
    return rows;
}


export async function getReview(id){
    const [rows] = await pool.query(`SELECT * FROM reviews WHERE idreviews = ?`, [id])
    return rows
}
export async function createReview(fname, name, email, message, score) {
    const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' '); // NIET ENKEL TIJD MAAR OOK DATUM --> BETER VOOR SORTEREN
    const result = await pool.query(`
        INSERT INTO reviews (firstname, name, email, message, time, score) VALUES (?,?,?,?,?,?)`,
        [fname, name, email, message, currentTime, parseInt(score)]
    );
    return result[0];
}


export async function getHighscores(idlevel){
    const [rows] = await pool.query(`
    SELECT *
    FROM highscores
    WHERE idlevel = ?
    ORDER BY tijd ASC
    LIMIT 5
    
    `, [idlevel]);
    return rows;
}
export async function setHighscore(idlevel, naam, tijd) {
    const result = await pool.query(`
        INSERT INTO highscores(idlevel, naam, tijd) VALUES (?,?,?)`,
        [idlevel, naam, tijd]
    );
    return result[0];
}


