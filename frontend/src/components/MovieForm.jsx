import { useState } from 'react'

const emptyMovie = {
  imdb_id: '',
  title: '',
  overview: '',
  poster_url: '',
  release_date: '',
  rating: '',
  director: '',
  genres: [],
}

export default function MovieForm({ initialMovie, genres, onSubmit, submitLabel = 'Save' }) {
  const [movie, setMovie] = useState({ ...emptyMovie, ...initialMovie })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (field) => (e) => {
    setMovie((m) => ({ ...m, [field]: e.target.value }))
  }

  const toggleGenre = (genreId) => {
    setMovie((m) => {
      const has = m.genres.includes(genreId)
      return {
        ...m,
        genres: has ? m.genres.filter((id) => id !== genreId) : [...m.genres, genreId],
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await onSubmit({
        ...movie,
        rating: movie.rating === '' ? null : Number(movie.rating),
      })
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <form className="movie-form" onSubmit={handleSubmit}>
      {error && <p className="status status-error">{error}</p>}

      <label>
        Title
        <input value={movie.title} onChange={handleChange('title')} required />
      </label>

      <label>
        IMDB ID
        <input value={movie.imdb_id} onChange={handleChange('imdb_id')} />
      </label>

      <label>
        Director
        <input value={movie.director} onChange={handleChange('director')} />
      </label>

      <label>
        Poster URL
        <input value={movie.poster_url} onChange={handleChange('poster_url')} />
      </label>

      <label>
        Release Date
        <input
          type="date"
          value={movie.release_date ? movie.release_date.slice(0, 10) : ''}
          onChange={handleChange('release_date')}
        />
      </label>

      <label>
        Rating
        <input
          type="number"
          min="0"
          max="10"
          step="0.1"
          value={movie.rating ?? ''}
          onChange={handleChange('rating')}
        />
      </label>

      <label>
        Overview
        <textarea rows="4" value={movie.overview} onChange={handleChange('overview')} />
      </label>

      {genres && genres.length > 0 && (
        <fieldset>
          <legend>Genres</legend>
          <div className="genre-checkboxes">
            {genres.map((genre) => (
              <label key={genre.id} className="genre-checkbox">
                <input
                  type="checkbox"
                  checked={movie.genres.includes(genre.id)}
                  onChange={() => toggleGenre(genre.id)}
                />
                {genre.name}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <button type="submit" disabled={saving}>
        {saving ? 'Saving...' : submitLabel}
      </button>
    </form>
  )
}
