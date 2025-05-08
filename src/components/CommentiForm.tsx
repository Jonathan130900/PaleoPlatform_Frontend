import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getAuthToken, fetchComments } from "../actions/authAction";
import { addComment, removeComment, setComments } from "../redux/authSlice";
import { Commento } from "../types/Commento";

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
    if (!contenuto.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const tempId = Date.now(); // Temporary ID for optimistic update

    try {
      // 1. Optimistic update
      const optimisticComment: Commento = {
        id: tempId,
        contenuto,
        createdAt: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
        userName: "You",
        articoloId,
        replies: [],
      };

      dispatch(addComment(optimisticComment));
      toast.success("Commento aggiunto!");

      // 2. Submit to server
      const token = getAuthToken();
      if (!token) throw new Error("Not authenticated");

      const response = await fetch(`/api/Commenti/articolo/${articoloId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ Contenuto: contenuto }),
      });

      if (!response.ok) throw new Error(await response.text());

      // 3. Refresh comments
      const updatedComments = await fetchComments(articoloId);
      dispatch(setComments(updatedComments));

      setContenuto("");
      onSuccess?.();
    } catch (error) {
      dispatch(removeComment(tempId));
      const errorMessage =
        error instanceof Error ? error.message : "Errore durante l'invio";
      toast.error(errorMessage);
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
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={isSubmitting || !contenuto.trim()}
      >
        {isSubmitting ? "Invio in corso..." : "Pubblica commento"}
      </button>
    </form>
  );
};

export default CommentiForm;
