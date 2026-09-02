import { useCallback } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { deleteMovie, getMovie } from '../api/movies'
import useAsync from '../hooks/useAsync'
import { Loader, ErrorMessage } from '../components/StatusMessage'

const FALLBACK_POSTER = 'https://placehold.co/300x445?text=No+Poster'

export default function MovieDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const fetchMovie = useCallback(() => getMovie(id), [id])
  const { data: movie, error, loading } = useAsync(fetchMovie, [id])

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${movie.title}"? This cannot be undone.`)) return
    await deleteMovie(id)
    navigate('/')
  }

  if (loading) return <Loader label="Loading movie..." />
  if (error) return <ErrorMessage message={error.message} />
  if (!movie) return null

  return (
    <section className="movie-detail">
      <img
        src={movie.poster_url || FALLBACK_POSTER}
        alt={`${movie.title} poster`}
        className="movie-detail-poster"
        onError={(e) => {
          e.currentTarget.src = FALLBACK_POSTER
        }}
      />
      <div className="movie-detail-body">
        <h1>{movie.title}</h1>
        <p className="movie-detail-meta">
          {movie.release_date ? new Date(movie.release_date).getFullYear() : '—'}
          {movie.director ? ` · Directed by ${movie.director}` : ''}
          {movie.rating ? ` · ⭐ ${movie.rating}` : ''}
        </p>

        {movie.genres && movie.genres.length > 0 && (
          <div className="genre-tags">
            {movie.genres.map((g) => (
              <span key={g} className="genre-tag">
                {g}
              </span>
            ))}
          </div>
        )}

        <p className="movie-detail-overview">{movie.overview || 'No overview available.'}</p>

        <div className="movie-detail-actions">
          <Link to={`/movies/${movie.id}/edit`} className="button">
            Edit
          </Link>
          <button type="button" className="button-danger" onClick={handleDelete}>
            Delete
          </button>
          <Link to="/">Back to Movies</Link>
        </div>
      </div>
    </section>
  )
}
