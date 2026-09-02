import { pool } from '../config/database.js'

const getAllMovies = async (req, res) => {
    try{
        const results = await pool.query(`
            SELECT movies.*, COALESCE(json_agg(genres.name) FILTER (WHERE genres.name IS NOT NULL), '[]') AS genres
            FROM movies
            LEFT JOIN movies_genres ON movies_genres.movie_id = movies.id
            LEFT JOIN genres ON genres.id = movies_genres.genre_id
            GROUP BY movies.id
            ORDER BY movies.id
        `);
        res.status(200).json(results.rows);
        console.log(`Fetched ${results.rows.length} movies`);
    }
    catch(err){
        res.status(500).json({ error: 'Failed to fetch movies' });
        console.error('Failed to fetch movies:', err.message)
    }
}

const getMovie = async (req, res) => {
    try{
        const id = parseInt(req.params.id);
        const results = await pool.query(`
            SELECT movies.*, COALESCE(json_agg(genres.name) FILTER (WHERE genres.name IS NOT NULL), '[]') AS genres
            FROM movies
            LEFT JOIN movies_genres ON movies_genres.movie_id = movies.id
            LEFT JOIN genres ON genres.id = movies_genres.genre_id
            WHERE movies.id = $1
            GROUP BY movies.id
        `, [id]);

        if (results.rows.length === 0) {
            console.log(`Movie ${id} not found`);
            return res.status(404).json({ error: 'Movie not found' });
        }

        res.status(200).json(results.rows[0]);
        console.log(`Fetched movie ${id}`);
    }
    catch(err){
        res.status(500).json({ error: 'Failed to fetch movie' });
        console.error('Failed to fetch movie:', err.message)
    }
}

const createMovie = async (req, res) => {
    try{
        const { imdb_id, title, overview, poster_url, release_date, rating, director, genres } = req.body;
        const results = await pool.query(
            `INSERT INTO movies (imdb_id, title, overview, poster_url, release_date, rating, director)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [imdb_id, title, overview, poster_url, release_date, rating, director]
        );

        const movie = results.rows[0];

        if (Array.isArray(genres) && genres.length > 0) {
            for (const genreId of genres) {
                await pool.query(
                    'INSERT INTO movies_genres (movie_id, genre_id) VALUES ($1, $2)',
                    [movie.id, genreId]
                );
            }
        }

        res.status(201).json(movie);
        console.log(`New movie "${title}" added to movies table successfully!`);
    }
    catch(err){
        res.status(409).json({ error: `Movie "${req.body.title}" could not be created` });
        console.error('Failed to add new movie:', err.message);
    }
}

const updateMovie = async (req, res) => {
    try{
        const { imdb_id, title, overview, poster_url, release_date, rating, director, genres } = req.body;
        const id = parseInt(req.params.id);
        const results = await pool.query(
            `UPDATE movies
             SET imdb_id = $1, title = $2, overview = $3, poster_url = $4, release_date = $5, rating = $6, director = $7
             WHERE id = $8
             RETURNING *`,
            [imdb_id, title, overview, poster_url, release_date, rating, director, id]
        );

        if (results.rows.length === 0) {
            console.log(`Movie ${id} not found`);
            return res.status(404).json({ error: 'Movie not found' });
        }

        if (Array.isArray(genres)) {
            await pool.query('DELETE FROM movies_genres WHERE movie_id = $1', [id]);

            for (const genreId of genres) {
                await pool.query(
                    'INSERT INTO movies_genres (movie_id, genre_id) VALUES ($1, $2)',
                    [id, genreId]
                );
            }
        }

        res.status(200).json(results.rows[0]);
        console.log(`Movie ${id} updated to "${title}"!`);
    }
    catch(err){
        res.status(409).json({ Error: `Movie ${req.body.title} could not be updated`});
        console.error('Failed to update movie:', err.message);
    }
}

const deleteMovie = async (req, res) => {
    try{
        const id = parseInt(req.params.id);
        const results = await pool.query('DELETE FROM movies WHERE id = $1 RETURNING *', [id]);

        if (results.rows.length === 0) {
            console.log(`Movie ${id} not found`);
            return res.status(404).json({ error: 'Movie not found' });
        }

        res.status(200).json(results.rows[0]);
        console.log(`Movie ${id} successfully deleted`);
    }
    catch(err){
        res.status(409).json({ Error: `Movie ${req.params.id} cannnot be deleted`});
        console.error('Failed to delete movie:', err.message);
    }
}

const moviesController = {
    getAllMovies,
    getMovie,
    createMovie,
    updateMovie,
    deleteMovie
};

export default moviesController;
