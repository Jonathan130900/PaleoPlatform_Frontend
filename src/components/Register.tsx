import React, { useState, FormEvent } from "react";
import { Link } from "react-router-dom";

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
        <div className="col-md-6 d-none d-md-flex bg-dark text-white justify-content-center align-items-center">
          <div className="text-center p-5">
            <Link
              to="/"
              className="text-decoration-none text-white text-center"
            >
              <h1 className="display-3 fw-bold mb-4">PaleoPlatform</h1>
              <p className="lead">
                Riscopri il passato, connettiti con il presente
              </p>
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
                <button type="submit" className="btn btn-primary py-2 fw-bold">
                  Registrati
                </button>
              </div>

              <hr className="my-4" />

              <div className="text-center">
                <p className="text-muted">
                  Hai già un account?{" "}
                  <Link
                    to="/login"
                    className="text-primary fw-bold text-decoration-none"
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
