import express from 'express';
import moviesController from '../controllers/movie.js';

const router = express.Router();

router.get('/', moviesController.getAllMovies);
router.get('/:id', moviesController.getMovie);
router.post('/:id', moviesController.createMovie);
router.put('/', moviesController.updateMovie);
router.delete('/', moviesController.deleteMovie);

export default router;