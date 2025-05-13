import React, { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import PaleoLogoWithText from "../assets/PaleoPlatform logo reference.svg";
import { paleoTheme } from "../styles/theme";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your registration logic here
    console.log({ email, username, password });
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Left Side - Brand Section (same as login) */}
        <div
          className="col-md-6 d-none d-md-flex justify-content-center align-items-center"
          style={{ backgroundColor: "#FFEDDB" }}
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

        {/* Right Side - Registration Form */}
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div className="w-75" style={{ maxWidth: "400px" }}>
            <h2 className="mb-4">Crea un account</h2>
            <form
              onSubmit={handleRegister}
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

              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  className="form-control py-2"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
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

              <div className="mb-4">
                <label htmlFor="confirmPassword" className="form-label">
                  Conferma Password
                </label>
                <input
                  type="password"
                  className="form-control py-2"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="d-grid mb-3">
                <button
                  type="submit"
                  className="btn py-2 fw-bold"
                  style={{
                    backgroundColor: paleoTheme.colors.lightAccent,
                    color: paleoTheme.colors.primary,
                  }}
                >
                  Registrati
                </button>
              </div>

              <hr className="my-4" />

              <div className="text-center">
                <p className="text-muted">
                  Hai già un account?{" "}
                  <Link
                    to="/login"
                    className="fw-bold text-decoration-none"
                    style={{
                      color: paleoTheme.colors.primary,
                    }}
                  >
                    Accedi
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

export default Register;
