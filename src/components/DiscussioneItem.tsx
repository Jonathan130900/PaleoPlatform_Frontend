import React from "react";
import { Link } from "react-router-dom";
import { Discussione } from "../types/Discussione";
import { paleoTheme } from "../styles/theme";
import { BiUpvote, BiDownvote, BiComment } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { voteOnDiscussion } from "../redux/discussioniSlice";
import { toast } from "react-toastify";

interface DiscussioneItemProps {
  discussione: Discussione;
}

const DiscussioneItem: React.FC<DiscussioneItemProps> = ({ discussione }) => {
  const dispatch = useDispatch<AppDispatch>();

  // Ensure we have valid numbers for upvotes and downvotes
  const upvotes = Number(discussione.upvotes) || 0;
  const downvotes = Number(discussione.downvotes) || 0;
  const score = upvotes - downvotes;

  const handleVote = async (isUpvote: boolean) => {
    try {
      await dispatch(
        voteOnDiscussion({ discussionId: discussione.id, isUpvote })
      );
    } catch (error: unknown) {
      let errorMessage = "Failed to vote";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  return (
    <div
      className="list-group-item"
      style={{
        backgroundColor: paleoTheme.colors.background,
        borderColor: paleoTheme.colors.primary,
      }}
    >
      <div className="d-flex">
        {/* Voting buttons */}
        <div
          className="d-flex flex-column align-items-center me-3"
          style={{ minWidth: "40px" }}
        >
          <button
            className="btn btn-sm p-0"
            onClick={() => handleVote(true)}
            style={{ color: paleoTheme.colors.primary }}
          >
            <BiUpvote size={20} />
          </button>
          <span className="my-1 fw-bold">{score}</span>
          <button
            className="btn btn-sm p-0"
            onClick={() => handleVote(false)}
            style={{ color: paleoTheme.colors.primary }}
          >
            <BiDownvote size={20} />
          </button>
        </div>

        {/* Discussion content */}
        <div className="flex-grow-1">
          <div className="d-flex align-items-center mb-1">
            <small className="text-muted me-2">
              Posted by {discussione.autoreUsername}
            </small>
            <small className="text-muted">
              in{" "}
              <span style={{ color: paleoTheme.colors.primary }}>
                {discussione.topicName}
              </span>
            </small>
          </div>

          <Link
            to={`/discussioni/${discussione.id}`}
            className="text-decoration-none"
          >
            <h5 style={{ color: paleoTheme.colors.textDark }}>
              {discussione.titolo}
            </h5>
          </Link>

          <p className="mb-2" style={{ color: paleoTheme.colors.textDark }}>
            {discussione.contenuto.length > 200
              ? `${discussione.contenuto.substring(0, 200)}...`
              : discussione.contenuto}
          </p>

          <div className="d-flex align-items-center">
            <BiComment
              className="me-1"
              style={{ color: paleoTheme.colors.primary }}
            />
            <small style={{ color: paleoTheme.colors.textDark }}>
              {discussione.commentCount || 0} comments
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussioneItem;
