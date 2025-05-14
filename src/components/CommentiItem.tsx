import React, { useState } from "react";
import { Commento } from "../types/Commento";
import { toast } from "react-toastify";
import {
  BiUpvote,
  BiSolidUpvote,
  BiDownvote,
  BiSolidDownvote,
} from "react-icons/bi";
import { getAuthToken } from "../actions/authAction";
import { paleoTheme } from "../styles/theme";

interface CommentiItemProps {
  comment: Commento;
  depth?: number;
  articoloId?: number;
  discussioneId?: number;
  onNewReply?: () => void;
}

const CommentiItem: React.FC<CommentiItemProps> = ({
  comment,
  depth = 0,
  articoloId,
  discussioneId,
  onNewReply,
}) => {
  const [replyText, setReplyText] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Accedi per commentare.");
        return;
      }

      // Determine the correct API endpoint based on context
      const endpoint = articoloId
        ? `/Commenti/articolo/${articoloId}`
        : `/Commenti/discussione/${discussioneId}`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          Contenuto: replyText,
          ParentCommentId: comment.id,
        }),
      });

      if (response.ok) {
        toast.success("Risposta inviata!");
        setReplyText("");
        setShowReplyBox(false);
        onNewReply?.();
      } else if (response.status === 401) {
        if (!getAuthToken()) {
          window.location.href = "/login";
          return;
        }
        toast.error("Sessione scaduta. Accedi nuovamente.");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Errore durante l'invio");
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
      toast.error("Errore di connessione");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (isUpvote: boolean) => {
    if (isVoting) return;
    setIsVoting(true);

    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Accedi per votare");
        return;
      }

      const response = await fetch("/Commenti/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          CommentoId: comment.id,
          IsUpvote: isUpvote,
        }),
      });

      if (response.ok) {
        toast.success("Voto registrato!");
      } else if (response.status === 401) {
        if (!getAuthToken()) {
          window.location.href = "/login";
          return;
        }
        toast.error("Sessione scaduta. Accedi nuovamente.");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Errore durante il voto");
      }
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Errore di connessione");
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div
      className={`mb-3 ${depth > 0 ? "ps-4 border-start" : ""}`}
      style={{
        borderLeftColor: depth > 0 ? paleoTheme.colors.primary : "transparent",
      }}
    >
      <div
        className={`card ${depth > 0 ? "border-0" : ""}`}
        style={{
          backgroundColor: paleoTheme.colors.background,
          borderColor: paleoTheme.colors.primary,
        }}
      >
        <div className="card-body p-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span
              className="fw-bold"
              style={{ color: paleoTheme.colors.primary }}
            >
              {comment.userName}
            </span>
            <small className="text-muted">
              {new Date(comment.createdAt).toLocaleDateString("it-IT", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </small>
          </div>

          <p className="mb-2">{comment.contenuto}</p>

          <div className="d-flex gap-2">
            <button
              className={`btn btn-sm ${
                comment.upvotes > 0 ? "btn-success" : "btn-outline-success"
              }`}
              onClick={() => handleVote(true)}
              disabled={isVoting}
            >
              {comment.upvotes > 0 ? (
                <BiSolidUpvote className="me-1" />
              ) : (
                <BiUpvote className="me-1" />
              )}
              {isVoting ? "..." : comment.upvotes}
            </button>
            <button
              className={`btn btn-sm ${
                comment.downvotes > 0 ? "btn-danger" : "btn-outline-danger"
              }`}
              onClick={() => handleVote(false)}
              disabled={isVoting}
            >
              {comment.downvotes > 0 ? (
                <BiSolidDownvote className="me-1" />
              ) : (
                <BiDownvote className="me-1" />
              )}
              {isVoting ? "..." : comment.downvotes}
            </button>
            <button
              className="btn btn-sm"
              style={{
                backgroundColor: paleoTheme.colors.lightAccent,
                color: paleoTheme.colors.primary,
                border: paleoTheme.borders.default,
              }}
              onClick={() => setShowReplyBox(!showReplyBox)}
              disabled={isSubmitting}
            >
              {showReplyBox ? "Annulla" : "Rispondi"}
            </button>
          </div>

          {showReplyBox && (
            <form onSubmit={handleReplySubmit} className="mt-3">
              <div className="mb-2">
                <textarea
                  className="form-control"
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Scrivi una risposta..."
                  required
                  disabled={isSubmitting}
                  style={{ borderColor: paleoTheme.colors.primary }}
                />
              </div>
              <button
                type="submit"
                className="btn btn-sm"
                style={{
                  backgroundColor: paleoTheme.colors.primary,
                  color: paleoTheme.colors.white,
                }}
                disabled={isSubmitting || !replyText.trim()}
              >
                {isSubmitting ? "Invio in corso..." : "Invia risposta"}
              </button>
            </form>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="replies mt-2">
          {comment.replies.map((reply) => (
            <CommentiItem
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              articoloId={articoloId}
              discussioneId={discussioneId}
              onNewReply={onNewReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentiItem;
