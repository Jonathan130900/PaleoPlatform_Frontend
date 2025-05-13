import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUtente } from "../actions/authAction";
import { AppDispatch } from "../redux/store";
import PaleoLogoWithText from "../assets/PaleoPlatform logo reference.svg";
import { paleoTheme } from "../styles/theme";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const success = await loginUtente(email, password)(dispatch);
      if (success) {
        navigate("/");
      }
    } catch {
      setError("Email o password non validi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Left Side - Brand Section */}
        <div
          className="col-md-6 d-none d-md-flex text-white justify-content-center align-items-center"
          style={{ backgroundColor: "#ffeddb" }} // <- Replace with your desired hex/RGB color
        >
          <div className="text-center p-5">
            <Link
              to="/"
              className="text-decoration-none text-white text-center"
            >
              <img
                src={PaleoLogoWithText}
                alt="Logo"
                style={{ width: "800px", height: "auto" }}
              />
            </Link>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div className="w-75" style={{ maxWidth: "400px" }}>
            <h2 className="mb-4">Accedi al tuo account</h2>

            {error && (
              <div className="alert alert-danger py-2 text-center">{error}</div>
            )}

            <form
              onSubmit={handleLogin}
              className="needs-validation"
              noValidate
            >
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control py-2"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control py-2"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="d-grid mb-3">
                <button
                  type="submit"
                  className="btn btn-primary py-2 fw-bold border-0"
                  style={{
                    backgroundColor: paleoTheme.colors.lightAccent,
                    color: paleoTheme.colors.primary,
                  }}
                  disabled={loading}
                >
                  {loading ? "Accedendo..." : "Accedi"}
                </button>
              </div>

              <hr className="my-4" />

              <div className="text-center">
                <p className="text-muted">
                  Non hai un account?{" "}
                  <Link
                    to="/register"
                    className="fw-bold text-decoration-none"
                    style={{
                      color: paleoTheme.colors.primary,
                    }}
                  >
                    Registrati
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
