import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      className="container text-center my-5 d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "60vh" }}
    >
      <h1 className="display-1">404</h1>

      <h2 className="h3">Pagina Non Trovata</h2>
      <p className="lead">
        La pagina che stai cercando è estinta o è stata spostata.
      </p>
      <div className="d-flex justify-content-center gap-3 mt-4">
        <Link to="/" className="btn btn-primary btn-lg">
          Torna alla Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
