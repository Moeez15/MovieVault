import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import MoviesPage from './pages/MoviesPage'
import MovieDetailPage from './pages/MovieDetailPage'
import AddMoviePage from './pages/AddMoviePage'
import EditMoviePage from './pages/EditMoviePage'

function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<MoviesPage />} />
          <Route path="/add" element={<AddMoviePage />} />
          <Route path="/movies/:id" element={<MovieDetailPage />} />
          <Route path="/movies/:id/edit" element={<EditMoviePage />} />
        </Routes>
      </main>
    </>
  )
}

export default App
