import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../redux/hooks";
import { fetchArticoloById } from "../redux/articoloSlice";
import type { RootState } from "../redux/store";
import CommentiList from "../components/CommentiList";
import axiosInstance from "../axiosInstance";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { paleoTheme } from "../styles/theme";

const ArticoloDetail = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);

  const articolo = useSelector(
    (state: RootState) => state.articoli.articoloDettaglio
  );
  const loading = useSelector((state: RootState) => state.articoli.loading);
  const error = useSelector((state: RootState) => state.articoli.error);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchArticoloById(Number(id)));
    }
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (!articolo) return;

    const canDelete =
      user?.role?.includes("Amministratore") ||
      (user?.role?.includes("Moderatore") &&
        user.id?.toString() === articolo.autoreId);

    if (!canDelete) {
      alert("Non hai i permessi per eliminare questo articolo");
      return;
    }

    confirmAlert({
      title: "Conferma eliminazione",
      message: "Sei sicuro di voler eliminare questo articolo?",
      buttons: [
        {
          label: "Sì",
          onClick: async () => {
            try {
              await axiosInstance.delete(`/Articoli/${articolo.id}`);
              navigate("/Articoli");
            } catch (error) {
              console.error("Error deleting article:", error);
            }
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  if (loading)
    return (
      <div className="container mt-3 my-5">
        <p>Caricamento...</p>
      </div>
    );
  if (error)
    return (
      <div className="container mt-3 my-5">
        <p>Errore: {error}</p>
      </div>
    );
  if (!articolo)
    return (
      <div className="container mt-3 my-5">
        <p>Articolo non trovato.</p>
      </div>
    );

  return (
    <div
      className="container mt-3 rounded"
      style={{ backgroundColor: paleoTheme.colors.lightAccent }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <h1 style={{ color: paleoTheme.colors.primary }}>{articolo.titolo}</h1>
        {user?.role?.some((role) =>
          ["Amministratore", "Moderatore"].includes(role)
        ) && (
          <div className="btn-group">
            <button
              className="btn btn-sm"
              style={{
                backgroundColor: paleoTheme.colors.lightAccent,
                color: paleoTheme.colors.primary,
                border: paleoTheme.borders.default,
              }}
              onClick={() => navigate(`/modifica-articolo/${articolo.id}`)}
            >
              Modifica
            </button>
            <button
              className="btn btn-sm"
              style={{
                backgroundColor: "#A52A2A",
                color: paleoTheme.colors.white,
              }}
              onClick={handleDelete}
            >
              Elimina
            </button>
          </div>
        )}
      </div>
      <p className="text-muted">
        Pubblicato da <strong>{articolo.autoreUserName}</strong> il{" "}
        {new Date(articolo.dataPubblicazione).toLocaleDateString()}
      </p>
      <img
        src={articolo.copertinaUrl}
        alt={articolo.titolo}
        className="img-fluid rounded mb-3"
        style={{ border: paleoTheme.borders.default }}
      />
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: articolo.contenuto }}
      />

      <hr style={{ borderColor: paleoTheme.colors.primary }} />
      <button
        className="btn my-3"
        style={{
          backgroundColor: paleoTheme.colors.lightAccent,
          color: paleoTheme.colors.primary,
          border: paleoTheme.borders.default,
        }}
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
