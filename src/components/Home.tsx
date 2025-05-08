import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../redux/hooks";
import type { RootState } from "../redux/store";
import { fetchArticoli } from "../redux/articoloSlice";
import type { Articolo } from "../types/Articolo";
import { Link } from "react-router-dom";

const Home = () => {
  const dispatch = useAppDispatch();

  const articoli = useSelector((state: RootState) => state.articoli.articoli);
  const loading = useSelector((state: RootState) => state.articoli.loading);

  useEffect(() => {
    dispatch(fetchArticoli());
  }, [dispatch]);

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-center">Ultimi Articoli</h1>
      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      )}
      <div className="row g-4">
        {articoli.map((articolo: Articolo) => (
          <div className="col-sm-6 col-md-4 col-lg-3" key={articolo.id}>
            <div className="card h-100 shadow-sm border-0">
              <img
                src={articolo.copertinaUrl}
                className="card-img-top"
                alt={articolo.titolo}
                style={{ objectFit: "cover", height: "200px" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{articolo.titolo}</h5>
                <p className="card-text flex-grow-1">
                  {articolo.contenuto.slice(0, 100)}...
                </p>
                <Link
                  to={`/articolo/${articolo.id}`}
                  className="btn btn-outline-primary mt-auto"
                >
                  Leggi
                </Link>
                <p className="text-muted mt-2 d-flex align-items-center">
                  <i className="bi bi-chat-square-text-fill me-1"></i>
                  {articolo.commenti?.length ?? 0} commenti
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
