// components/CommentiList.tsx
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import CommentiForm from "./CommentiForm";
import CommentiItem from "./CommentiItem";
import { toast } from "react-toastify";
import { paleoTheme } from "../styles/theme";
import { Commento } from "../types/Commento";
import { Loader } from "./Loader";

interface CommentiListProps {
  discussioneId?: number;
  articoloId?: number;
  onNewComment?: () => void;
  initialComments?: Commento[];
}

const CommentiList = ({
  discussioneId,
  articoloId,
  onNewComment,
  initialComments = [],
}: CommentiListProps) => {
  const articolo = useSelector(
    (state: RootState) => state.articoli.articoloDettaglio
  );
  const discussione = useSelector(
    (state: RootState) => state.discussioni.discussione
  );
  const loading = useSelector(
    (state: RootState) =>
      state.articoli.loading || state.discussioni.status === "loading"
  );

  const comments =
    articoloId && articolo?.id === articoloId
      ? articolo.commenti
      : discussioneId && discussione?.id === discussioneId
      ? discussione.commenti || initialComments
      : initialComments;

  const handleNewComment = () => {
    toast.success("Commento aggiunto!");
    onNewComment?.();
  };

  const topLevelComments = comments.filter(
    (comment) => comment.parentCommentId === null
  );

  if (loading && comments.length === 0) {
    return <Loader />;
  }

  return (
    <div className="mt-4">
      {(articoloId || discussioneId) && (
        <div
          className="p-4 mb-4 rounded"
          style={{
            backgroundColor: paleoTheme.colors.background,
            border: paleoTheme.borders.default,
          }}
        >
          <CommentiForm
            articoloId={articoloId}
            discussioneId={discussioneId}
            onSuccess={handleNewComment}
          />
        </div>
      )}

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
              discussioneId={discussioneId}
              onNewReply={handleNewComment}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentiList;
