import './dotenv.js'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import fs from 'fs'

const currentPath = fileURLToPath(import.meta.url)
const outputPath = path.join(dirname(currentPath), 'data/movies.json')

const movieTitles = [
  "Inception",
  "The Dark Knight",
  "Parasite",
  "The Grand Budapest Hotel",
  "Everything Everywhere All at Once",
  "Oppenheimer",
  "Dune",
  "Dune: Part Two",
  "No Country for Old Men",
  "Whiplash",
  "La La Land",
  "Mad Max: Fury Road",
  "Get Out",
  "Moonlight",
  "The Social Network",
  "Interstellar",
  "Spider-Man: Into the Spider-Verse",
  "Knives Out",
  "1917",
  "Joker",
  "Roma",
  "The Shape of Water",
  "Spotlight",
  "Birdman",
  "Gravity",
  "Her",
  "12 Years a Slave",
  "The Revenant",
  "Arrival",
  "Blade Runner 2049",
  "A Star Is Born",
  "Three Billboards Outside Ebbing, Missouri",
  "Call Me by Your Name",
  "Lady Bird",
  "The Favourite",
  "Green Book",
  "Once Upon a Time in Hollywood",
  "Marriage Story",
  "Nomadland",
  "Sound of Metal",
  "The Power of the Dog",
  "CODA",
  "Top Gun: Maverick",
  "The Banshees of Inisherin",
  "Poor Things",
  "The Zone of Interest",
  "Anatomy of a Fall",
  "Past Lives",
  "Killers of the Flower Moon",
  "American Fiction"
];

const fetchMovie = async (title) => {
    const url = `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&type=movie&apikey=${process.env.OMDB_API_KEY}`
    const res = await fetch(url)
    const data = await res.json()

    if (data.Response === 'False') {
        console.warn(`⚠️ not found: ${title} (${data.Error})`)
        return null
    }

    return {
        imdb_id: data.imdbID,
        title: data.Title,
        overview: data.Plot !== 'N/A' ? data.Plot : null,
        poster_url: data.Poster !== 'N/A' ? data.Poster : null,
        release_date: /^\d{4}$/.test(data.Year) ? `${data.Year}-01-01` : null,
        rating: data.imdbRating !== 'N/A' ? parseFloat(data.imdbRating) : null,
        director: data.Director !== 'N/A' ? data.Director : null,
        genres: data.Genre !== 'N/A' ? data.Genre.split(', ') : []
    }
}

const fetchAllMovies = async () => {
    const movies = []

    for (const title of movieTitles) {
        try {
            const movie = await fetchMovie(title)
            if (movie) {
                movies.push(movie)
                console.log(`✅ ${title} fetched`)
            }
        } catch (err) {
            console.error(`⚠️ error fetching "${title}"`, err)
        }
    }

    fs.mkdirSync(dirname(outputPath), { recursive: true })
    fs.writeFileSync(outputPath, JSON.stringify(movies, null, 2))
    console.log(`🎉 wrote ${movies.length} movies to ${outputPath}`)
}

fetchAllMovies()