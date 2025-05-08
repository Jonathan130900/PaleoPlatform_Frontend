import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import type { RootState } from "../redux/store";

const Navbar = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          PaleoPlatform
        </Link>

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
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/articoli">
                Articoli
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/community">
                Community
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/eventi">
                Eventi
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/negozio">
                Negozio
              </Link>
            </li>
          </ul>

          <div className="d-flex">
            {!isAuthenticated ? (
              <>
                <Link className="btn btn-outline-light me-2" to="/login">
                  Login
                </Link>
                <Link className="btn btn-primary" to="/register">
                  Registrati
                </Link>
              </>
            ) : (
              <>
                <span className="navbar-text me-3">
                  Ciao, <span className="fw-bold">{user?.username}</span>
                </span>
                <button
                  className="btn btn-danger"
                  onClick={() => dispatch(logout())}
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
