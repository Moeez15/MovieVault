import request from './client'

export const getMovies = () => request('/movies')

export const getMovie = (id) => request(`/movies/${id}`)

export const createMovie = (movie) =>
  request('/movies', { method: 'POST', body: JSON.stringify(movie) })

export const updateMovie = (id, movie) =>
  request(`/movies/${id}`, { method: 'PUT', body: JSON.stringify(movie) })

export const deleteMovie = (id) =>
  request(`/movies/${id}`, { method: 'DELETE' })
