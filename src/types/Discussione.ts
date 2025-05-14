import { Commento } from "./Commento";

export interface Discussione {
  id: number;
  titolo: string;
  contenuto: string;
  dataCreazione: string;
  upvotes: number;
  downvotes: number;
  autoreUsername: string;
  topicId: number;
  topicName: string;
  commentCount: number;
  commenti?: Commento[];
}
