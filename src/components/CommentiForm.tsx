import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getAuthToken } from "../actions/authAction";
import { addComment, removeComment } from "../redux/authSlice";
import { Commento } from "../types/Commento";
import axiosInstance from "../axiosInstance";
import { paleoTheme } from "../styles/theme";

interface CommentiFormProps {
  articoloId: number;
  onSuccess?: () => void;
}

const CommentiForm: React.FC<CommentiFormProps> = ({
  articoloId,
  onSuccess,
}) => {
  const [contenuto, setContenuto] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();

    if (!token) {
      toast.error("Per favore accedi per commentare");
      return;
    }

    if (!contenuto.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const tempId = Date.now();

    try {
      const optimisticComment: Commento = {
        id: tempId,
        contenuto,
        createdAt: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
        userName: "You",
        parentCommentId: null,
        articoloId,
        replies: [],
      };

      dispatch(addComment(optimisticComment));

      const response = await axiosInstance.post(
        `/Commenti/articolo/${articoloId}`,
        {
          Contenuto: contenuto,
          ParentCommentId: null,
          ArticoloId: articoloId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const createdComment: Commento = {
        id: response.data.id,
        contenuto: response.data.contenuto,
        createdAt: response.data.createdAt,
        upvotes: response.data.upvotes,
        downvotes: response.data.downvotes,
        userName: response.data.userName,
        parentCommentId: response.data.parentCommentId,
        articoloId: response.data.articoloId,
        replies: [],
      };

      dispatch(removeComment(tempId));
      dispatch(addComment(createdComment));

      setContenuto("");
      onSuccess?.();
      toast.success("Commento pubblicato!");
    } catch (error) {
      dispatch(removeComment(tempId));
      toast.error(
        error instanceof Error ? error.message : "Errore durante l'invio"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-3">
        <textarea
          className="form-control"
          rows={3}
          value={contenuto}
          onChange={(e) => setContenuto(e.target.value)}
          placeholder="Scrivi un commento..."
          required
          disabled={isSubmitting}
          style={{ borderColor: paleoTheme.colors.primary }}
        />
      </div>
      <button
        type="submit"
        className="btn"
        style={{
          backgroundColor: paleoTheme.colors.primary,
          color: paleoTheme.colors.white,
        }}
        disabled={isSubmitting || !contenuto.trim()}
      >
        {isSubmitting ? "Invio in corso..." : "Pubblica commento"}
      </button>
    </form>
  );
};

export default CommentiForm;
