import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import CommentiForm from "./CommentiForm";
import CommentiItem from "./CommentiItem";
import { toast } from "react-toastify";

const CommentiList = ({ articoloId }: { articoloId: number }) => {
  const articolo = useSelector(
    (state: RootState) => state.articoli.articoloDettaglio
  );

  if (!articolo || articolo.id !== articoloId) return null;

  const handleNewComment = () => {
    toast.success("Commento aggiunto!");
    // Add refresh logic here if needed
  };

  // Filter only top-level comments
  const topLevelComments = articolo.commenti.filter(
    (comment) => comment.parentCommentId === null
  );

  return (
    <div className="mt-4">
      <CommentiForm articoloId={articoloId} onSuccess={handleNewComment} />
      {topLevelComments.length === 0 ? (
        <p className="text-muted">
          Nessun commento. Sii il primo a commentare!
        </p>
      ) : (
        <div className="mt-3">
          {topLevelComments.map((comment) => (
            <CommentiItem
              key={comment.id}
              comment={comment}
              depth={0}
              articoloId={articoloId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentiList;
