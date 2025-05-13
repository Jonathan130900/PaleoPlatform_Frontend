import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import { fetchArticoloById } from "../redux/articoloSlice";
import axiosInstance from "../axiosInstance";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaImage,
} from "react-icons/fa";
import { paleoTheme } from "../styles/theme";

const ModificaArticolo = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { articoloDettaglio } = useSelector(
    (state: RootState) => state.articoli
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const [titolo, setTitolo] = useState("");
  const [copertina, setCopertina] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tiptap editor configuration
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: "",
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchArticoloById(Number(id)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (articoloDettaglio) {
      setTitolo(articoloDettaglio.titolo);
      setPreviewImage(articoloDettaglio.copertinaUrl || null);
      if (editor) {
        editor.commands.setContent(articoloDettaglio.contenuto);
      }
    }
  }, [articoloDettaglio, editor]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCopertina(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!editor || !user || !id) return;

    try {
      const formData = new FormData();
      formData.append("Titolo", titolo);
      formData.append("Contenuto", editor.getHTML());
      if (copertina) {
        formData.append("Copertina", copertina);
      }

      await axiosInstance.put(`/Articoli/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate(`/articolo/${id}`);
    } catch (err) {
      console.error("Error updating article:", err);
      setError("Errore durante l'aggiornamento dell'articolo");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if user can edit this article
  const canEdit =
    user?.role?.includes("Amministratore") ||
    (user?.role?.includes("Moderatore") &&
      user.id?.toString() === articoloDettaglio?.autoreId);

  if (!canEdit) {
    return (
      <div
        className="container mt-5 mb-5"
        style={{ backgroundColor: paleoTheme.colors.white }}
      >
        <h2 style={{ color: paleoTheme.colors.primary }}>Accesso negato</h2>
        <p>Non hai i permessi per modificare questo articolo.</p>
      </div>
    );
  }

  if (!articoloDettaglio || !editor) {
    return (
      <div
        className="container mt-5 mb-5"
        style={{ backgroundColor: paleoTheme.colors.white }}
      >
        Caricamento...
      </div>
    );
  }

  return (
    <div
      className="container mt-5 mb-5"
      style={{
        backgroundColor: paleoTheme.colors.white,
        borderRadius: "8px",
        boxShadow: paleoTheme.shadows.small,
        padding: "2rem",
      }}
    >
      <h1 className="mb-4" style={{ color: paleoTheme.colors.primary }}>
        Modifica Articolo
      </h1>

      {error && (
        <div
          className="alert mb-4"
          style={{
            backgroundColor: "#F8D7DA",
            color: "#721C24",
            borderColor: "#F5C6CB",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="titolo" className="form-label">
            Titolo
          </label>
          <input
            type="text"
            className="form-control"
            id="titolo"
            value={titolo}
            onChange={(e) => setTitolo(e.target.value)}
            required
            style={{
              borderColor: paleoTheme.colors.primary,
              backgroundColor: paleoTheme.colors.background,
            }}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="copertina" className="form-label">
            Copertina (lascia vuoto per mantenere l'attuale)
          </label>
          <input
            type="file"
            className="form-control"
            id="copertina"
            accept="image/*"
            onChange={handleFileChange}
            style={{
              borderColor: paleoTheme.colors.primary,
              backgroundColor: paleoTheme.colors.background,
            }}
          />
          {previewImage && (
            <div className="mt-2">
              <img
                src={previewImage}
                alt="Anteprima copertina"
                className="img-thumbnail"
                style={{
                  maxHeight: "300px",
                  borderColor: paleoTheme.colors.primary,
                }}
              />
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="form-label">Contenuto</label>

          {/* Editor Toolbar */}
          <div
            className="border rounded-top p-2"
            style={{
              backgroundColor: paleoTheme.colors.lightAccent,
              borderColor: paleoTheme.colors.primary,
            }}
          >
            <div className="d-flex flex-wrap gap-2">
              <button
                type="button"
                className={`btn btn-sm ${
                  editor.isActive("bold")
                    ? "btn-primary"
                    : "btn-outline-secondary"
                }`}
                onClick={() => editor.chain().focus().toggleBold().run()}
                style={{
                  backgroundColor: editor.isActive("bold")
                    ? paleoTheme.colors.primary
                    : "transparent",
                  color: editor.isActive("bold")
                    ? paleoTheme.colors.white
                    : paleoTheme.colors.primary,
                  borderColor: paleoTheme.colors.primary,
                }}
              >
                <FaBold />
              </button>
              <button
                type="button"
                className={`btn btn-sm ${
                  editor.isActive("italic")
                    ? "btn-primary"
                    : "btn-outline-secondary"
                }`}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                style={{
                  backgroundColor: editor.isActive("italic")
                    ? paleoTheme.colors.primary
                    : "transparent",
                  color: editor.isActive("italic")
                    ? paleoTheme.colors.white
                    : paleoTheme.colors.primary,
                  borderColor: paleoTheme.colors.primary,
                }}
              >
                <FaItalic />
              </button>
              <button
                type="button"
                className={`btn btn-sm ${
                  editor.isActive("underline")
                    ? "btn-primary"
                    : "btn-outline-secondary"
                }`}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                style={{
                  backgroundColor: editor.isActive("underline")
                    ? paleoTheme.colors.primary
                    : "transparent",
                  color: editor.isActive("underline")
                    ? paleoTheme.colors.white
                    : paleoTheme.colors.primary,
                  borderColor: paleoTheme.colors.primary,
                }}
              >
                <FaUnderline />
              </button>
              <div className="vr"></div>
              <button
                type="button"
                className={`btn btn-sm ${
                  editor.isActive("bulletList")
                    ? "btn-primary"
                    : "btn-outline-secondary"
                }`}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                style={{
                  backgroundColor: editor.isActive("bulletList")
                    ? paleoTheme.colors.primary
                    : "transparent",
                  color: editor.isActive("bulletList")
                    ? paleoTheme.colors.white
                    : paleoTheme.colors.primary,
                  borderColor: paleoTheme.colors.primary,
                }}
              >
                <FaListUl />
              </button>
              <button
                type="button"
                className={`btn btn-sm ${
                  editor.isActive("orderedList")
                    ? "btn-primary"
                    : "btn-outline-secondary"
                }`}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                style={{
                  backgroundColor: editor.isActive("orderedList")
                    ? paleoTheme.colors.primary
                    : "transparent",
                  color: editor.isActive("orderedList")
                    ? paleoTheme.colors.white
                    : paleoTheme.colors.primary,
                  borderColor: paleoTheme.colors.primary,
                }}
              >
                <FaListOl />
              </button>
              <div className="vr"></div>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => {
                  const url = window.prompt("Inserisci URL immagine");
                  if (url) editor.chain().focus().setImage({ src: url }).run();
                }}
                style={{
                  color: paleoTheme.colors.primary,
                  borderColor: paleoTheme.colors.primary,
                }}
              >
                <FaImage />
              </button>
            </div>
          </div>

          {/* Editor Content */}
          <div
            className="border rounded-bottom p-3"
            style={{
              backgroundColor: paleoTheme.colors.white,
              borderColor: paleoTheme.colors.primary,
              minHeight: "300px",
            }}
          >
            <EditorContent editor={editor} />
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn"
            style={{
              backgroundColor: paleoTheme.colors.lightAccent,
              color: paleoTheme.colors.primary,
              border: paleoTheme.borders.default,
            }}
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Annulla
          </button>
          <button
            type="submit"
            className="btn"
            style={{
              backgroundColor: paleoTheme.colors.primary,
              color: paleoTheme.colors.white,
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Salvataggio...
              </>
            ) : (
              "Salva Modifiche"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModificaArticolo;
