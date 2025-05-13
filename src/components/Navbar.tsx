import { Link, NavLink } from "react-router-dom"; // Changed from Link to NavLink
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import type { RootState } from "../redux/store";
import axiosInstance from "../axiosInstance";
import LogoNavbar from "../assets/PaleoPlatform logo reference no text.svg";
import { paleoTheme } from "../styles/theme";

const Navbar = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/Auth/logout");
    } catch (error) {
      console.error("Backend logout failed:", error);
    } finally {
      dispatch(logout());
      localStorage.removeItem("jwtToken");
      window.location.href = "/login";
    }
  };

  // Custom class for active links
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link fw-bold ${isActive ? "active" : ""}`;

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light fixed-top shadow-sm py-3"
      style={{
        backgroundColor: paleoTheme.colors.background,
        borderBottom: paleoTheme.borders.default,
      }}
    >
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          <img
            src={LogoNavbar}
            alt="Logo"
            style={{ width: "100px", height: "auto" }}
          />
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink
                className={navLinkClass}
                style={({ isActive }) => ({
                  color: isActive
                    ? paleoTheme.colors.primary
                    : paleoTheme.colors.textMedium,
                })}
                to="/"
                end
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={navLinkClass}
                style={({ isActive }) => ({
                  color: isActive
                    ? paleoTheme.colors.primary
                    : paleoTheme.colors.textMedium,
                })}
                to="/articoli"
              >
                Articoli
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={navLinkClass}
                style={({ isActive }) => ({
                  color: isActive
                    ? paleoTheme.colors.primary
                    : paleoTheme.colors.textMedium,
                })}
                to="/community"
              >
                Community
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={navLinkClass}
                style={({ isActive }) => ({
                  color: isActive
                    ? paleoTheme.colors.primary
                    : paleoTheme.colors.textMedium,
                })}
                to="/eventi"
              >
                Eventi
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={navLinkClass}
                style={({ isActive }) => ({
                  color: isActive
                    ? paleoTheme.colors.primary
                    : paleoTheme.colors.textMedium,
                })}
                to="/negozio"
              >
                Negozio
              </NavLink>
            </li>
          </ul>

          <div className="d-flex">
            {!isAuthenticated ? (
              <>
                <Link
                  className="btn me-2"
                  style={{
                    backgroundColor: paleoTheme.colors.lightAccent,
                    color: paleoTheme.colors.primary,
                    border: paleoTheme.borders.default,
                  }}
                  to="/login"
                >
                  Login
                </Link>
                <Link
                  className="btn"
                  style={{
                    backgroundColor: paleoTheme.colors.primary,
                    color: paleoTheme.colors.white,
                  }}
                  to="/register"
                >
                  Registrati
                </Link>
              </>
            ) : (
              <>
                <span className="navbar-text me-3">
                  Ciao, <span className="fw-bold">{user?.username}</span>
                </span>
                <button
                  className="btn"
                  style={{
                    backgroundColor: "#A52A2A",
                    color: paleoTheme.colors.white,
                  }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
