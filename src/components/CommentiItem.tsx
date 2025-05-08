import React, { useState } from "react";
import { Commento } from "../types/Commento";
import { toast } from "react-toastify";
import {
  BiUpvote,
  BiSolidUpvote,
  BiDownvote,
  BiSolidDownvote,
} from "react-icons/bi";
import { getAuthToken, refreshToken } from "../actions/authAction";

interface CommentiItemProps {
  comment: Commento;
  depth?: number;
  articoloId: number;
}

const CommentiItem: React.FC<CommentiItemProps> = ({
  comment,
  depth = 0,
  articoloId,
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
        toast.error("Please login to reply");
        return;
      }

      const response = await fetch(`/api/Commenti/articolo/${articoloId}`, {
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
      } else if (response.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          return handleReplySubmit(e);
        }
        toast.error("Session expired. Please login again.");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Errore durante l'invio");
      }
    } catch {
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
        toast.error("Please login to vote");
        return;
      }

      const response = await fetch("/api/Commenti/vote", {
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
        const newToken = await refreshToken();
        if (newToken) {
          return handleVote(isUpvote);
        }
        toast.error("Session expired. Please login again.");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Errore durante il voto");
      }
    } catch {
      toast.error("Errore di connessione");
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div
      className={`mb-3 ${
        depth > 0 ? "ps-4 border-start border-secondary" : ""
      }`}
    >
      <div className={`card ${depth > 0 ? "border-0 bg-light" : ""}`}>
        <div className="card-body p-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fw-bold">{comment.userName}</span>
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
              className="btn btn-sm btn-outline-primary"
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
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentiItem;
