import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import { fetchArticoli } from "../redux/articoloSlice";
import axiosInstance from "../axiosInstance";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { paleoTheme } from "../styles/theme";

const ArticoliList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const stripHtmlTags = (html: string) => {
    return html.replace(/<[^>]*>?/gm, "");
  };
  const { articoli, loading, error } = useSelector((state: RootState) => ({
    articoli: state.articoli.articoli,
    loading: state.articoli.loading,
    error: state.articoli.error,
  }));
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchArticoli());
  }, [dispatch]);

  const handleDelete = async (articoloId: number, autoreId: string) => {
    const canDelete =
      user?.role?.includes("Amministratore") ||
      (user?.role?.includes("Moderatore") && user.id?.toString() === autoreId);

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
              await axiosInstance.delete(`/Articoli/${articoloId}`);
              dispatch(fetchArticoli());
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

  const sortedArticoli = [...articoli].sort(
    (a, b) =>
      new Date(b.dataPubblicazione).getTime() -
      new Date(a.dataPubblicazione).getTime()
  );

  return (
    <div
      className="container mt-3 pb-3 rounded"
      style={{ backgroundColor: paleoTheme.colors.lightAccent }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0" style={{ color: paleoTheme.colors.primary }}>
          Tutti gli Articoli
        </h1>
        {user?.role?.some((role) =>
          ["Amministratore", "Moderatore"].includes(role)
        ) && (
          <Link
            to="/crea-articolo"
            className="btn"
            style={{
              backgroundColor: paleoTheme.colors.primary,
              color: paleoTheme.colors.white,
            }}
          >
            Crea Nuovo Articolo
          </Link>
        )}
      </div>
      <div className="d-flex flex-column gap-4">
        {sortedArticoli.map((articolo) => (
          <div
            key={articolo.id}
            className="card"
            style={{
              borderColor: paleoTheme.colors.primary,
              boxShadow: paleoTheme.shadows.small,
            }}
          >
            <div className="row g-0">
              <div className="col-md-4">
                <img
                  src={articolo.copertinaUrl}
                  alt={articolo.titolo}
                  className="img-fluid rounded-start"
                  style={{
                    height: "100%",
                    objectFit: "cover",
                    borderRight: paleoTheme.borders.light,
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "/placeholder.jpg";
                  }}
                />
              </div>
              <div
                className="col-md-8"
                style={{ backgroundColor: paleoTheme.colors.background }}
              >
                <div className="card-body">
                  <h5
                    className="card-title"
                    style={{ color: paleoTheme.colors.primary }}
                  >
                    {articolo.titolo}
                  </h5>
                  <p className="text-muted small">
                    Pubblicato il{" "}
                    {new Date(articolo.dataPubblicazione).toLocaleDateString()}{" "}
                    da <strong>{articolo.autoreUserName}</strong>
                  </p>
                  <p className="card-text">
                    {stripHtmlTags(articolo.contenuto).substring(0, 200)}...
                  </p>
                  <div className="d-flex gap-2">
                    <Link
                      to={`/articolo/${articolo.id}`}
                      className="btn"
                      style={{
                        backgroundColor: paleoTheme.colors.primary,
                        color: paleoTheme.colors.white,
                      }}
                    >
                      Leggi di più
                    </Link>
                    {user?.role?.some((role) =>
                      ["Amministratore", "Moderatore"].includes(role)
                    ) && (
                      <>
                        <button
                          className="btn"
                          style={{
                            backgroundColor: paleoTheme.colors.lightAccent,
                            color: paleoTheme.colors.primary,
                            border: paleoTheme.borders.default,
                          }}
                          onClick={() =>
                            navigate(`/modifica-articolo/${articolo.id}`)
                          }
                        >
                          Modifica
                        </button>
                        <button
                          className="btn"
                          style={{
                            backgroundColor: "#A52A2A",
                            color: paleoTheme.colors.white,
                          }}
                          onClick={() =>
                            handleDelete(articolo.id, articolo.autoreId)
                          }
                        >
                          Elimina
                        </button>
                      </>
                    )}
                  </div>
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
