import express from 'express';
import moviesController from '../controllers/movie.js';

const router = express.Router();

router.get('/', moviesController.getAllMovies);
router.get('/:id', moviesController.getMovie);
router.post('/', moviesController.createMovie);
router.put('/:id', moviesController.updateMovie);
router.delete('/:id', moviesController.deleteMovie);

export default router;