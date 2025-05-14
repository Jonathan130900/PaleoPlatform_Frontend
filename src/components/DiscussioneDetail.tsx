import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import {
  fetchDiscussioneById,
  voteOnDiscussion,
} from "../redux/discussioniSlice";
import CommentiList from "./CommentiList";
import { paleoTheme } from "../styles/theme";
import { BiUpvote, BiDownvote } from "react-icons/bi";
import { toast } from "react-toastify";
import { Commento } from "../types/Commento";

interface CommentiListWrapperProps {
  discussioneId: number;
  initialComments?: Commento[];
}

const CommentiListWrapper: React.FC<CommentiListWrapperProps> = ({
  discussioneId,
  initialComments = [],
}) => {
  return (
    <CommentiList
      discussioneId={discussioneId}
      initialComments={initialComments}
      articoloId={0}
    />
  );
};

const DiscussioneDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { discussione, status, error } = useSelector(
    (state: RootState) => state.discussioni
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchDiscussioneById(parseInt(id)));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleVote = async (isUpvote: boolean) => {
    if (!discussione) return;
    try {
      await dispatch(
        voteOnDiscussion({ discussionId: discussione.id, isUpvote })
      );
    } catch (error: unknown) {
      let errorMessage = "Errore nel votare";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  if (status === "loading" || !discussione) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Caricamento...</span>
        </div>
      </div>
    );
  }

  const score = discussione.upvotes - discussione.downvotes;

  return (
    <div className="container">
      <div
        className="card mb-4"
        style={{
          backgroundColor: paleoTheme.colors.background,
          borderColor: paleoTheme.colors.primary,
        }}
      >
        <div className="card-body">
          <div className="d-flex align-items-center mb-2">
            <small className="text-muted me-2">
              Pubblicato da {discussione.autoreUsername}
            </small>
            <small className="text-muted">
              in{" "}
              <span style={{ color: paleoTheme.colors.primary }}>
                {discussione.topicName}
              </span>
            </small>
          </div>

          <h2 style={{ color: paleoTheme.colors.primary }}>
            {discussione.titolo}
          </h2>

          <div className="d-flex mt-3">
            <div
              className="d-flex flex-column align-items-center me-4"
              style={{ minWidth: "40px" }}
            >
              <button
                className="btn btn-sm p-0"
                onClick={() => handleVote(true)}
                style={{ color: paleoTheme.colors.primary }}
              >
                <BiUpvote size={24} />
              </button>
              <span className="my-1 fw-bold" style={{ fontSize: "1.2rem" }}>
                {score}
              </span>
              <button
                className="btn btn-sm p-0"
                onClick={() => handleVote(false)}
                style={{ color: paleoTheme.colors.primary }}
              >
                <BiDownvote size={24} />
              </button>
            </div>

            <div className="flex-grow-1">
              <div
                className="p-3 rounded"
                style={{
                  backgroundColor: paleoTheme.colors.lightAccent,
                  border: `1px solid ${paleoTheme.colors.primary}`,
                }}
              >
                <p style={{ whiteSpace: "pre-wrap" }}>
                  {discussione.contenuto}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="card"
        style={{
          backgroundColor: paleoTheme.colors.background,
          borderColor: paleoTheme.colors.primary,
        }}
      >
        <div className="card-body">
          <h4 style={{ color: paleoTheme.colors.primary }}>Commenti</h4>
          <CommentiListWrapper
            discussioneId={discussione.id}
            initialComments={discussione.commenti || []}
          />
        </div>
      </div>
    </div>
  );
};

export default DiscussioneDetail;
