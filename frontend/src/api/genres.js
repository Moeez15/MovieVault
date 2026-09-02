import request from './client'

export const getGenres = () => request('/genres')

export const createGenre = (genre) =>
  request('/genres', { method: 'POST', body: JSON.stringify(genre) })
