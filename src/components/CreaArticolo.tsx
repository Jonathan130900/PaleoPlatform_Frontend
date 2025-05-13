import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../axiosInstance";
import { RootState } from "../redux/store";
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

const CreaArticolo = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [titolo, setTitolo] = useState("");
  const [copertina, setCopertina] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    if (!editor || !user) return;

    try {
      const formData = new FormData();
      formData.append("Titolo", titolo);
      formData.append("Contenuto", editor.getHTML());
      if (copertina) {
        formData.append("Copertina", copertina);
      }

      const response = await axiosInstance.post("/Articoli", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        navigate("/articoli");
      }
    } catch (err) {
      console.error("Error creating article:", err);
      setError("Errore durante la creazione dell'articolo");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!editor) {
    return <div className="container mt-4">Caricamento editor...</div>;
  }

  return (
    <div
      className="container mt-5 mb-5"
      style={{ backgroundColor: paleoTheme.colors.white }}
    >
      <h1 className="mb-4" style={{ color: paleoTheme.colors.primary }}>
        Crea Nuovo Articolo
      </h1>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

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
            style={{ borderColor: paleoTheme.colors.primary }}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="copertina" className="form-label">
            Copertina
          </label>
          <input
            type="file"
            className="form-control"
            id="copertina"
            accept="image/*"
            onChange={handleFileChange}
            required
            style={{ borderColor: paleoTheme.colors.primary }}
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
              >
                <FaImage />
              </button>
            </div>
          </div>

          <div
            className="border rounded-bottom p-3"
            style={{
              backgroundColor: paleoTheme.colors.white,
              borderColor: paleoTheme.colors.primary,
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
            onClick={() => navigate("/articoli")}
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
              "Pubblica Articolo"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreaArticolo;
