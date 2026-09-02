import { Link } from 'react-router-dom'

const FALLBACK_POSTER = 'https://placehold.co/300x445?text=No+Poster'

export default function MovieCard({ movie }) {
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '—'

  return (
    <Link to={`/movies/${movie.id}`} className="movie-card">
      <img
        src={movie.poster_url || FALLBACK_POSTER}
        alt={`${movie.title} poster`}
        className="movie-card-poster"
        onError={(e) => {
          e.currentTarget.src = FALLBACK_POSTER
        }}
      />
      <div className="movie-card-body">
        <h3>{movie.title}</h3>
        <p className="movie-card-meta">
          {year} {movie.rating ? `· ⭐ ${movie.rating}` : ''}
        </p>
      </div>
    </Link>
  )
}
