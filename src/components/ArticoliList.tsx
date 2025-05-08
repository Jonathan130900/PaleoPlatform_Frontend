import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import { fetchArticoli } from "../redux/articoloSlice";

const ArticoliList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { articoli, loading, error } = useSelector((state: RootState) => ({
    articoli: state.articoli.articoli,
    loading: state.articoli.loading,
    error: state.articoli.error,
  }));

  useEffect(() => {
    dispatch(fetchArticoli());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="container mt-4">
        <p>Caricamento articoli...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <p>Errore: {error}</p>
      </div>
    );
  }

  if (articoli.length === 0) {
    return (
      <div className="container mt-4">
        <p>Nessun articolo disponibile.</p>
      </div>
    );
  }

  // Sort articles by date (newest first)
  const sortedArticoli = [...articoli].sort(
    (a, b) =>
      new Date(b.dataPubblicazione).getTime() -
      new Date(a.dataPubblicazione).getTime()
  );

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Tutti gli Articoli</h1>
      <div className="d-flex flex-column gap-4">
        {sortedArticoli.map((articolo) => (
          <div key={articolo.id} className="card">
            <div className="row g-0">
              <div className="col-md-4">
                <img
                  src={articolo.copertinaUrl}
                  alt={articolo.titolo}
                  className="img-fluid rounded-start"
                  style={{ height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "/placeholder.jpg";
                  }}
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">{articolo.titolo}</h5>
                  <p className="text-muted small">
                    Pubblicato il{" "}
                    {new Date(articolo.dataPubblicazione).toLocaleDateString()}{" "}
                    da <strong>{articolo.autoreUserName}</strong>
                  </p>
                  <p className="card-text">
                    {articolo.contenuto.substring(0, 200)}...
                  </p>
                  <Link
                    to={`/articolo/${articolo.id}`}
                    className="btn btn-primary"
                  >
                    Leggi di più
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticoliList;
