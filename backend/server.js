import express from 'express'
import cors from 'cors'
import './config/dotenv.js'
import genresRouter from './routes/genres.js'
import movieRouter from './routes/movies.js'

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/genres', genresRouter);
app.use('/api/movies', movieRouter);

app.get('/', (req, res) => {
    res.status(200).send('<h1 style="text-align: center; top-margin: 50px">MovieVault API</h1>');
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
})