import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { fetchArticoli } from "../redux/articoloSlice";
import ArticoloForm from "./ArticoloForm";
import axiosInstance from "../axiosInstance";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Articolo } from "../types/Articolo";
import { paleoTheme } from "../styles/theme";

const ArticoliAdmin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { articoli, loading, error } = useSelector(
    (state: RootState) => state.articoli
  );
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [editingArticolo, setEditingArticolo] = useState<Articolo | null>(null);

  useEffect(() => {
    if (
      !isAuthenticated ||
      !user?.role?.some((r) => ["Amministratore", "Moderatore"].includes(r))
    ) {
      navigate("/");
    }
    dispatch(fetchArticoli());
  }, [dispatch, isAuthenticated, user, navigate]);

  const handleDelete = async (id: number) => {
    confirmAlert({
      title: "Conferma eliminazione",
      message: "Sei sicuro di voler eliminare questo articolo?",
      buttons: [
        {
          label: "Sì",
          onClick: async () => {
            try {
              await axiosInstance.delete(`/api/articoli/${id}`);
              dispatch(fetchArticoli());
            } catch (err) {
              console.error("Error deleting article:", err);
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

  if (loading) return <div className="container mt-4">Caricamento...</div>;
  if (error) return <div className="container mt-4">Errore: {error}</div>;

  return (
    <div
      className="container mt-3 my-5"
      style={{ backgroundColor: paleoTheme.colors.white }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ color: paleoTheme.colors.primary }}>Gestione Articoli</h1>
        <button
          className="btn"
          style={{
            backgroundColor: paleoTheme.colors.primary,
            color: paleoTheme.colors.white,
          }}
          onClick={() =>
            setEditingArticolo({
              id: 0,
              titolo: "",
              contenuto: "",
              dataPubblicazione: new Date().toISOString(),
              autoreId: user?.id?.toString() || "",
              copertinaUrl: "",
              commenti: [],
            })
          }
        >
          Crea Nuovo Articolo
        </button>
      </div>

      {editingArticolo ? (
        <ArticoloForm
          articolo={editingArticolo}
          onSuccess={() => {
            setEditingArticolo(null);
            dispatch(fetchArticoli());
          }}
          onCancel={() => setEditingArticolo(null)}
        />
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead style={{ backgroundColor: paleoTheme.colors.primary }}>
              <tr>
                <th style={{ color: paleoTheme.colors.white }}>Titolo</th>
                <th style={{ color: paleoTheme.colors.white }}>Autore</th>
                <th style={{ color: paleoTheme.colors.white }}>Data</th>
                <th style={{ color: paleoTheme.colors.white }}>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {articoli.map((articolo) => (
                <tr key={articolo.id}>
                  <td>
                    <Link
                      to={`/articolo/${articolo.id}`}
                      className="text-decoration-none"
                      style={{ color: paleoTheme.colors.primary }}
                    >
                      {articolo.titolo}
                    </Link>
                  </td>
                  <td>{articolo.autoreUserName}</td>
                  <td>
                    {new Date(articolo.dataPubblicazione).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm"
                        style={{
                          backgroundColor: paleoTheme.colors.lightAccent,
                          color: paleoTheme.colors.primary,
                          border: paleoTheme.borders.default,
                        }}
                        onClick={() => setEditingArticolo(articolo)}
                      >
                        Modifica
                      </button>
                      {user?.role?.includes("Amministratore") && (
                        <button
                          className="btn btn-sm"
                          style={{
                            backgroundColor: "#A52A2A",
                            color: paleoTheme.colors.white,
                          }}
                          onClick={() => handleDelete(articolo.id)}
                        >
                          Elimina
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ArticoliAdmin;
