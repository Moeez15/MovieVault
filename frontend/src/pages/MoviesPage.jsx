import { useMemo, useState } from 'react'
import { getMovies } from '../api/movies'
import { getGenres } from '../api/genres'
import useAsync from '../hooks/useAsync'
import MovieGrid from '../components/MovieGrid'
import { Loader, ErrorMessage } from '../components/StatusMessage'

export default function MoviesPage() {
  const { data: movies, error, loading } = useAsync(getMovies, [])
  const { data: genres } = useAsync(getGenres, [])
  const [search, setSearch] = useState('')
  const [genreFilter, setGenreFilter] = useState('')

  const filtered = useMemo(() => {
    if (!movies) return []
    const q = search.trim().toLowerCase()
    return movies.filter((movie) => {
      const matchesSearch = !q || movie.title.toLowerCase().includes(q)
      const matchesGenre = !genreFilter || movie.genres?.includes(genreFilter)
      return matchesSearch && matchesGenre
    })
  }, [movies, search, genreFilter])

  return (
    <section>
      <div className="page-header">
        <h1>Movies</h1>
        <div className="filters">
          <input
            className="search-input"
            type="search"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="genre-select"
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
          >
            <option value="">All Genres</option>
            {genres?.map((genre) => (
              <option key={genre.id} value={genre.name}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <Loader label="Loading movies..." />}
      {error && <ErrorMessage message={error.message} />}
      {!loading && !error && <MovieGrid movies={filtered} />}
    </section>
  )
}
