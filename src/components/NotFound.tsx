import { Link } from "react-router-dom";
import extinctionIcon from "../assets/icons8-fossil-96.png";
import { paleoTheme } from "../styles/theme";

const NotFound = () => {
  return (
    <div
      className="container text-center my-5 d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "60vh" }}
    >
      <img
        src={extinctionIcon}
        alt="Extinction Icon"
        style={{ width: "150px", height: "auto", marginBottom: "5px" }}
      />
      <h1
        className="display-1 fw-bold"
        style={{ fontSize: "8rem", fontWeight: 900 }}
      >
        404
      </h1>

      <h2 className="h3">Pagina Non Trovata</h2>
      <p className="lead">
        La pagina che stai cercando è estinta o è stata spostata.
      </p>
      <p className="" style={{ fontSize: "14px", fontWeight: 200 }}>
        Icona da <Link to={"https://icons8.com/"}>Icons8</Link>
      </p>
      <div className="d-flex justify-content-center gap-3 mt-4">
        <Link
          to="/"
          className="btn btn-lg"
          style={{
            backgroundColor: paleoTheme.colors.primary,
            color: paleoTheme.colors.white,
          }}
        >
          Torna alla Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
