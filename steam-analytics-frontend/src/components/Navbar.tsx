import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar__container">
        <NavLink to="/" className="navbar__logo">
          Jon Analytics
        </NavLink>

        <div className="navbar__links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `navbar__item ${isActive ? "navbar__item--active" : "navbar__item--inactive"}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/games"
            className={({ isActive }) =>
              `navbar__item ${isActive ? "navbar__item--active" : "navbar__item--inactive"}`
            }
          >
            Games
          </NavLink>

          <NavLink
            to="/trends"
            className={({ isActive }) =>
              `navbar__item ${isActive ? "navbar__item--active" : "navbar__item--inactive"}`
            }
          >
            Trends
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;