import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import CommentiForm from "./CommentiForm";
import CommentiItem from "./CommentiItem";
import { toast } from "react-toastify";
import { paleoTheme } from "../styles/theme";

interface CommentiListProps {
  articoloId: number;
  onNewComment?: () => void;
}

const CommentiList = ({ articoloId, onNewComment }: CommentiListProps) => {
  const articolo = useSelector(
    (state: RootState) => state.articoli.articoloDettaglio
  );

  if (!articolo || articolo.id !== articoloId) return null;

  const handleNewComment = () => {
    toast.success("Commento aggiunto!");
    if (onNewComment) {
      onNewComment();
    }
  };

  const topLevelComments = articolo.commenti.filter(
    (comment) => comment.parentCommentId === null
  );

  return (
    <div className="mt-4">
      <div
        className="p-4 mb-4 rounded"
        style={{
          backgroundColor: paleoTheme.colors.background,
          border: paleoTheme.borders.default,
        }}
      >
        <CommentiForm articoloId={articoloId} onSuccess={handleNewComment} />
      </div>

      {topLevelComments.length === 0 ? (
        <div
          className="text-center p-4 rounded"
          style={{
            backgroundColor: paleoTheme.colors.background,
            border: paleoTheme.borders.default,
          }}
        >
          <p className="text-muted mb-0">
            Nessun commento. Commenta per primo!
          </p>
        </div>
      ) : (
        <div
          className="rounded m-0 p-0"
          style={{
            overflow: "hidden",
          }}
        >
          {topLevelComments.map((comment) => (
            <CommentiItem
              key={comment.id}
              comment={comment}
              depth={0}
              articoloId={articoloId}
              onNewReply={handleNewComment}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentiList;
