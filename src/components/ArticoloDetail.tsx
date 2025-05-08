import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../redux/hooks";
import { fetchArticoloById } from "../redux/articoloSlice";
import type { RootState } from "../redux/store";
import CommentiList from "../components/CommentiList";

const ArticoloDetail = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [showComments, setShowComments] = useState(false);

  const articolo = useSelector(
    (state: RootState) => state.articoli.articoloDettaglio
  );
  const loading = useSelector((state: RootState) => state.articoli.loading);
  const error = useSelector((state: RootState) => state.articoli.error);

  useEffect(() => {
    if (id) {
      dispatch(fetchArticoloById(Number(id)));
    }
  }, [dispatch, id]);

  if (loading)
    return (
      <div className="container mt-4">
        <p>Caricamento...</p>
      </div>
    );
  if (error)
    return (
      <div className="container mt-4">
        <p>Errore: {error}</p>
      </div>
    );
  if (!articolo)
    return (
      <div className="container mt-4">
        <p>Articolo non trovato.</p>
      </div>
    );

  return (
    <div className="container mt-4">
      <h1>{articolo.titolo}</h1>
      <p className="text-muted">
        Pubblicato da <strong>{articolo.autoreUserName}</strong> il{" "}
        {new Date(articolo.dataPubblicazione).toLocaleDateString()}
      </p>
      <img
        src={articolo.copertinaUrl}
        alt={articolo.titolo}
        className="img-fluid rounded mb-3"
      />
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: articolo.contenuto }}
      />

      <hr />
      <button
        className="btn btn-outline-secondary my-3"
        onClick={() => setShowComments(!showComments)}
      >
        {showComments
          ? "Nascondi commenti"
          : `Mostra commenti (${articolo.commenti.length})`}
      </button>

      {showComments && <CommentiList articoloId={articolo.id} />}
    </div>
  );
};

export default ArticoloDetail;
