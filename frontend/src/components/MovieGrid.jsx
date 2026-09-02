import MovieCard from './MovieCard'

export default function MovieGrid({ movies }) {
  if (movies.length === 0) {
    return <p className="status">No movies found.</p>
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  )
}
