import { useCallback, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getMovie, updateMovie } from '../api/movies'
import { getGenres } from '../api/genres'
import useAsync from '../hooks/useAsync'
import MovieForm from '../components/MovieForm'
import { Loader, ErrorMessage } from '../components/StatusMessage'

export default function EditMoviePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const fetchMovie = useCallback(() => getMovie(id), [id])
  const { data: movie, error: movieError, loading: movieLoading } = useAsync(fetchMovie, [id])
  const { data: genres, error: genresError, loading: genresLoading } = useAsync(getGenres, [])

  const initialMovie = useMemo(() => {
    if (!movie || !genres) return movie
    const genreIds = genres.filter((g) => movie.genres?.includes(g.name)).map((g) => g.id)
    return { ...movie, genres: genreIds }
  }, [movie, genres])

  const handleSubmit = async (updated) => {
    await updateMovie(id, updated)
    navigate(`/movies/${id}`)
  }

  if (movieLoading || genresLoading) return <Loader label="Loading movie..." />
  if (movieError) return <ErrorMessage message={movieError.message} />
  if (genresError) return <ErrorMessage message={genresError.message} />

  return (
    <section>
      <h1>Edit {movie.title}</h1>
      <MovieForm
        initialMovie={initialMovie}
        genres={genres}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
      />
    </section>
  )
}
