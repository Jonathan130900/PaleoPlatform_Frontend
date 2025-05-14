// components/DiscussioniList.tsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { fetchDiscussioni, fetchTopics } from "../redux/discussioniSlice";
import DiscussioneItem from "./DiscussioneItem";
import CreaDiscussioneModal from "./CreaDiscussioneModal";
import { paleoTheme } from "../styles/theme";
import { toast } from "react-toastify";
import { Discussione } from "../types/Discussione";
import { Topic } from "../types/Topic";
import { Loader, PageLoader } from "./Loader";

const DiscussioniList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { discussioni, topics, status, error } = useSelector(
    (state: RootState) => state.discussioni
  );
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    dispatch(fetchTopics());
    dispatch(fetchDiscussioni());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const filteredDiscussions = selectedTopic
    ? discussioni.filter(
        (d: { topicId: number }) => d.topicId === selectedTopic
      )
    : discussioni;

  if (status === "loading" && discussioni.length === 0) {
    return <PageLoader />;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 mb-4">
          <div
            className="card p-3 sticky-top"
            style={{
              top: "20px",
              backgroundColor: paleoTheme.colors.background,
              borderColor: paleoTheme.colors.primary,
            }}
          >
            <h5 className="mb-3" style={{ color: paleoTheme.colors.primary }}>
              Topics
            </h5>
            {status === "loading" ? (
              <Loader />
            ) : (
              <>
                <ul className="list-group list-group-flush">
                  <li
                    className={`list-group-item ${
                      !selectedTopic ? "active" : ""
                    }`}
                    style={{
                      cursor: "pointer",
                      backgroundColor: !selectedTopic
                        ? paleoTheme.colors.lightAccent
                        : "transparent",
                      borderColor: paleoTheme.colors.primary,
                    }}
                    onClick={() => setSelectedTopic(null)}
                  >
                    All Topics
                  </li>
                  {topics.map((topic: Topic) => (
                    <li
                      key={topic.id}
                      className={`list-group-item ${
                        selectedTopic === topic.id ? "active" : ""
                      }`}
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          selectedTopic === topic.id
                            ? paleoTheme.colors.lightAccent
                            : "transparent",
                        borderColor: paleoTheme.colors.primary,
                      }}
                      onClick={() => setSelectedTopic(topic.id)}
                    >
                      {topic.nome}
                    </li>
                  ))}
                </ul>
                {user && (
                  <button
                    className="btn mt-3"
                    style={{
                      backgroundColor: paleoTheme.colors.primary,
                      color: paleoTheme.colors.white,
                    }}
                    onClick={() => setShowCreateModal(true)}
                  >
                    Create Discussion
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="col-md-9">
          <div
            className="card mb-4"
            style={{
              backgroundColor: paleoTheme.colors.background,
              borderColor: paleoTheme.colors.primary,
            }}
          >
            <div className="card-body">
              <h2
                className="card-title"
                style={{ color: paleoTheme.colors.primary }}
              >
                {selectedTopic
                  ? `Discussions in ${
                      topics.find((t: { id: number }) => t.id === selectedTopic)
                        ?.nome || ""
                    }`
                  : "All Discussions"}
              </h2>

              {status === "loading" && filteredDiscussions.length === 0 ? (
                <Loader />
              ) : filteredDiscussions.length === 0 ? (
                <div className="text-center py-4">
                  <p>No discussions found. Be the first to start one!</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {filteredDiscussions.map((discussione: Discussione) => (
                    <DiscussioneItem
                      key={discussione.id}
                      discussione={discussione}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreaDiscussioneModal
          topics={topics}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};

export default DiscussioniList;
