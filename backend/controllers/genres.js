import { pool } from '../config/database.js'

const getAllGenres = async (req, res) => {
    try{
        const results = await pool.query('SELECT * FROM genres');
        res.status(200).json(results.rows);
        console.log(`Fetched ${results.rows.length} genres`);
    }
    catch(err){
        res.status(500).json({ error: 'Failed to fetch genres' });
        console.error('Failed to fetch genres:', err.message)
    }

}

const getGenre = async (req, res) => {
    try{
        const id = parseInt(req.params.id);
        const results = await pool.query('SELECT * FROM genres WHERE id = $1', [id]);

        if (results.rows.length === 0) {
            console.log(`Genre ${id} not found`);
            return res.status(404).json({ error: 'Genre not found' });
        }

        res.status(200).json(results.rows[0]);
        console.log(`Fetched genre ${id}`);
    }
    catch(err){
        res.status(500).json({ error: 'Failed to fetch genre' });
        console.error('Failed to fetch genre:', err.message)
    }
}

const createGenre = async (req, res) => {
    try{
        const { name } = req.body;
        const results = await pool.query('INSERT INTO genres (name) VALUES ($1) RETURNING *', [name]);
        res.status(201).json(results.rows[0]);
        console.log(`New genre "${name}" added to genres table successfully!`);
    }
    catch(err){
        res.status(409).json({ error: `Genre "${req.body.name}" already exists` });
        console.error('Failed to add new genre:', err.message);
    }
}

const updateGenre = async (req, res) => {
    try{
        const { name } = req.body;
        const id = parseInt(req.params.id);
        const results = await pool.query('UPDATE genres SET name = $1 WHERE id = $2 RETURNING *', [name, id]);

        if (results.rows.length === 0) {
            console.log(`Genre ${id} not found`);
            return res.status(404).json({ error: 'Genre not found' });
        }

        res.status(200).json(results.rows[0]);
        console.log(`Genre ${id} updated to "${name}"!`);
    }
    catch(err){
        res.status(409).json({ Error: `Genre ${req.body.name} not found`});
        console.error('Failed to update genre:', err.message);
    }
}

const deleteGenre = async (req, res) => {
    try{
        const id = parseInt(req.params.id);
        const results = await pool.query('DELETE FROM genres WHERE id = $1 RETURNING *', [id]);

        if (results.rows.length === 0) {
            console.log(`Genre ${id} not found`);
            return res.status(404).json({ error: 'Genre not found' });
        }

        res.status(200).json(results.rows[0]);
        console.log(`Genre ${id} successfully deleted`);
    }
    catch(err){
        res.status(409).json({ Error: `Genre ${req.params.id} cannnot be deleted`});
        console.error('Failed to delete genre:', err.message);
    }
}

const genresController = {
    getAllGenres,
    getGenre,
    createGenre,
    updateGenre,
    deleteGenre
};


export default genresController;