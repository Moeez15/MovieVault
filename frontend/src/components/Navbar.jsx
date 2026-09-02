import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="navbar">
      <NavLink to="/" className="brand">
        🎬 MovieVault
      </NavLink>
      <nav>
        <NavLink to="/" end>
          Movies
        </NavLink>
        <NavLink to="/add">Add Movie</NavLink>
      </nav>
    </header>
  )
}
