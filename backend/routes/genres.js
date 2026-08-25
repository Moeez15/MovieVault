import express from 'express'
import genresController from '../controllers/genres.js';

const router = express.Router();

router.get('/', genresController.getAllGenres);
router.get('/:id', genresController.getGenre);
router.post('/', genresController.createGenre);
router.put('/:id', genresController.updateGenre);
router.delete('/:id', genresController.deleteGenre);

export default router;