import { useNavigate } from 'react-router-dom'
import { createMovie } from '../api/movies'
import { getGenres } from '../api/genres'
import useAsync from '../hooks/useAsync'
import MovieForm from '../components/MovieForm'
import { Loader, ErrorMessage } from '../components/StatusMessage'

export default function AddMoviePage() {
  const navigate = useNavigate()
  const { data: genres, error, loading } = useAsync(getGenres, [])

  const handleSubmit = async (movie) => {
    const created = await createMovie(movie)
    navigate(`/movies/${created.id}`)
  }

  if (loading) return <Loader label="Loading form..." />
  if (error) return <ErrorMessage message={error.message} />

  return (
    <section>
      <h1>Add Movie</h1>
      <MovieForm genres={genres} onSubmit={handleSubmit} submitLabel="Add Movie" />
    </section>
  )
}
