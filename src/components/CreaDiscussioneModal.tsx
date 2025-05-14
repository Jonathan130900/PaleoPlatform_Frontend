import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { Topic } from "../types/Topic";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { createDiscussione } from "../redux/discussioniSlice";
import { paleoTheme } from "../styles/theme";
import { toast } from "react-toastify";

interface CreaDiscussioneModalProps {
  topics: Topic[];
  onClose: () => void;
}

const CreaDiscussioneModal: React.FC<CreaDiscussioneModalProps> = ({
  topics,
  onClose,
}) => {
  const [titolo, setTitolo] = useState("");
  const [contenuto, setContenuto] = useState("");
  const [topicId, setTopicId] = useState<number>(topics[0]?.id || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titolo.trim() || !contenuto.trim() || !topicId) return;

    setIsSubmitting(true);
    try {
      await dispatch(createDiscussione({ titolo, contenuto, topicId }));
      toast.success("Discussione pubblicata con successo!");
      onClose();
    } catch (error: unknown) {
      let errorMessage = "Errore nel pubblicare la discussione";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={true} onHide={onClose} centered>
      <Modal.Header
        closeButton
        style={{
          backgroundColor: paleoTheme.colors.background,
          borderColor: paleoTheme.colors.primary,
        }}
      >
        <Modal.Title style={{ color: paleoTheme.colors.primary }}>
          Create New Discussion
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          backgroundColor: paleoTheme.colors.background,
        }}
      >
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={titolo}
              onChange={(e) => setTitolo(e.target.value)}
              required
              style={{ borderColor: paleoTheme.colors.primary }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Topic</Form.Label>
            <Form.Select
              value={topicId}
              onChange={(e) => setTopicId(Number(e.target.value))}
              required
              style={{ borderColor: paleoTheme.colors.primary }}
            >
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.nome}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={contenuto}
              onChange={(e) => setContenuto(e.target.value)}
              required
              style={{ borderColor: paleoTheme.colors.primary }}
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button
              variant="secondary"
              onClick={onClose}
              style={{
                backgroundColor: paleoTheme.colors.secondary,
                borderColor: paleoTheme.colors.primary,
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !titolo.trim() || !contenuto.trim()}
              style={{
                backgroundColor: paleoTheme.colors.primary,
                borderColor: paleoTheme.colors.primary,
              }}
            >
              {isSubmitting ? "Pubblicando..." : "Pubblica Discussione"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreaDiscussioneModal;
