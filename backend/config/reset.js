import { pool } from './database.js'
import './dotenv.js'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import fs from 'fs'

const currentPath = fileURLToPath(import.meta.url)
const moviesFile = fs.readFileSync(path.join(dirname(currentPath), 'data/movies.json'))
const moviesData = JSON.parse(moviesFile)

const dropAllTables = async () => {
    const dropTablesQuery = `
        DROP TABLE IF EXISTS movies_genres;
        DROP TABLE IF EXISTS movies;
        DROP TABLE IF EXISTS genres;
    `

    try {
        const res = await pool.query(dropTablesQuery)
        console.log('🧹 all tables dropped successfully')
    } catch (err) {
        console.error('⚠️ error dropping tables', err)
    }
}

const createGenresTable = async () => {
    const createGenresTableQuery = `
        CREATE TABLE IF NOT EXISTS genres (
            id serial PRIMARY KEY,
            name varchar(100) NOT NULL UNIQUE
        );
    `

    try {
        const res = await pool.query(createGenresTableQuery)
        console.log('🎉 genres table created successfully')
    } catch (err) {
        console.error('⚠️ error creating genres table', err)
    }
}

const createMoviesTable = async () => {
    const createMoviesTableQuery = `
        CREATE TABLE IF NOT EXISTS movies (
            id serial PRIMARY KEY,
            imdb_id varchar(20) UNIQUE,
            title varchar(200) NOT NULL,
            overview text,
            poster_url text,
            release_date date,
            rating numeric(3, 1),
            director varchar(200)
        );
    `

    try {
        const res = await pool.query(createMoviesTableQuery)
        console.log('🎉 movies table created successfully')
    } catch (err) {
        console.error('⚠️ error creating movies table', err)
    }
}

const createMoviesGenresTable = async () => {
    const createMoviesGenresTableQuery = `
        CREATE TABLE IF NOT EXISTS movies_genres (
            movie_id int NOT NULL,
            genre_id int NOT NULL,
            PRIMARY KEY (movie_id, genre_id),
            FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
            FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
        );
    `

    try {
        const res = await pool.query(createMoviesGenresTableQuery)
        console.log('🎉 movies_genres table created successfully')
    } catch (err) {
        console.error('⚠️ error creating movies_genres table', err)
    }
}

const createSchema = async () => {
    await createGenresTable()
    await createMoviesTable()
    await createMoviesGenresTable()
}

const seedGenresTable = async () => {
    const genreNames = [...new Set(moviesData.flatMap((movie) => movie.genres))]

    for (const name of genreNames) {
        try {
            const res = await pool.query('INSERT INTO genres (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [name])
            console.log(`✅ genre "${name}" added successfully`)
        } catch (err) {
            console.error(`⚠️ error inserting genre "${name}"`, err)
        }
    }
}

const seedMoviesTable = async () => {
    for (const movie of moviesData) {
        const insertMovieQuery = {
            text: `INSERT INTO movies (imdb_id, title, overview, poster_url, release_date, rating, director)
                   VALUES ($1, $2, $3, $4, $5, $6, $7)
                   RETURNING id`
        }

        const values = [
            movie.imdb_id,
            movie.title,
            movie.overview,
            movie.poster_url,
            movie.release_date,
            movie.rating,
            movie.director
        ]

        try {
            const res = await pool.query(insertMovieQuery, values)
            const movieId = res.rows[0].id
            console.log(`✅ ${movie.title} added successfully`)

            for (const genreName of movie.genres) {
                await pool.query(
                    `INSERT INTO movies_genres (movie_id, genre_id)
                     SELECT $1, id FROM genres WHERE name = $2`,
                    [movieId, genreName]
                )
            }
        } catch (err) {
            console.error(`⚠️ error inserting movie "${movie.title}"`, err)
        }
    }
}

const seed = async () => {
    await seedGenresTable()
    await seedMoviesTable()
}

const resetDatabase = async () => {
    await dropAllTables()
    await createSchema()
    await seed()
    await pool.end()
}

resetDatabase()
