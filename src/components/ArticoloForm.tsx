import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useState } from "react";
import axiosInstance from "../axiosInstance";
import { Articolo } from "../types/Articolo";
import { paleoTheme } from "../styles/theme";

interface ArticoloFormProps {
  articolo: Articolo;
  onSuccess: () => void;
  onCancel: () => void;
}

const ArticoloForm: React.FC<ArticoloFormProps> = ({
  articolo,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    titolo: articolo.titolo,
    contenuto: articolo.contenuto,
    copertinaUrl: articolo.copertinaUrl,
  });

  const [copertinaFile, setCopertinaFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(
    articolo.copertinaUrl || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: formData.contenuto,
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, contenuto: editor.getHTML() }));
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCopertinaFile(file);

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

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("Titolo", formData.titolo);
      formDataToSend.append("Contenuto", formData.contenuto);
      if (copertinaFile) {
        formDataToSend.append("Copertina", copertinaFile);
      }

      if (articolo.id) {
        await axiosInstance.put(`/Articoli/${articolo.id}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axiosInstance.post("/Articoli", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving article:", err);
      setError("Errore durante il salvataggio");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="card"
      style={{
        borderColor: paleoTheme.colors.primary,
        boxShadow: paleoTheme.shadows.medium,
      }}
    >
      <div className="card-body">
        <h2
          className="card-title mb-4"
          style={{ color: paleoTheme.colors.primary }}
        >
          {articolo.id ? "Modifica Articolo" : "Crea Nuovo Articolo"}
        </h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Titolo</label>
            <input
              type="text"
              className="form-control"
              name="titolo"
              value={formData.titolo}
              onChange={handleChange}
              required
              style={{ borderColor: paleoTheme.colors.primary }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Copertina</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleFileChange}
              required={!articolo.id}
              style={{ borderColor: paleoTheme.colors.primary }}
            />
            {previewImage && (
              <div className="mt-2">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="img-thumbnail"
                  style={{
                    maxHeight: "200px",
                    borderColor: paleoTheme.colors.primary,
                  }}
                />
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Contenuto</label>
            <div
              className="border rounded p-2"
              style={{ borderColor: paleoTheme.colors.primary }}
            >
              <EditorContent editor={editor} />
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              type="button"
              className="btn"
              style={{
                backgroundColor: paleoTheme.colors.lightAccent,
                color: paleoTheme.colors.primary,
                border: paleoTheme.borders.default,
              }}
              onClick={onCancel}
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
              {isSubmitting ? "Salvataggio..." : "Salva"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticoloForm;
