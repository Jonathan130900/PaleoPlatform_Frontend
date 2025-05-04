import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../redux/hooks";
import type { RootState } from "../redux/store";
import { fetchArticoli } from "../redux/articoloSlice";
import type { Articolo } from "../types/Articolo";

const Home = () => {
  const dispatch = useAppDispatch();

  const articoli = useSelector((state: RootState) => state.articoli.articoli);
  const loading = useSelector((state: RootState) => state.articoli.loading);

  useEffect(() => {
    dispatch(fetchArticoli());
  }, [dispatch]);

  return (
    <div className="container">
      <h1>Ultimi Articoli</h1>
      {loading && <p>Caricamento...</p>}
      <div className="row">
        {articoli.map((articolo: Articolo) => (
          <div className="col-md-4" key={articolo.id}>
            <div className="card mb-3">
              <img
                src={articolo.copertinaUrl}
                className="card-img-top"
                alt={articolo.titolo}
              />
              <div className="card-body">
                <h5 className="card-title">{articolo.titolo}</h5>
                <p className="card-text">
                  {articolo.contenuto.slice(0, 100)}...
                </p>
                <a
                  href={`/articolo/${articolo.id}`}
                  className="btn btn-primary"
                >
                  Leggi
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
