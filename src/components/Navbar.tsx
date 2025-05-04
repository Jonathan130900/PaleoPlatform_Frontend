import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import type { RootState } from "../redux/store";

const Navbar = () => {
  const { username, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          PaleoPlatform
        </Link>
        <div className="d-flex ms-auto">
          {!isAuthenticated ? (
            <>
              <Link className="btn btn-outline-primary me-2" to="/login">
                Login
              </Link>
              <Link className="btn btn-primary" to="/register">
                Registrati
              </Link>
            </>
          ) : (
            <>
              <span className="navbar-text me-2">Ciao, {username}</span>
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
    </nav>
  );
};

export default Navbar;
