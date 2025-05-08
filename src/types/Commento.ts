export interface Commento {
  id: number;
  contenuto: string;
  createdAt: string;
  userName: string;
  parentCommentId?: number | null;
  articoloId?: number | null;
  discussioneId?: number | null;
  upvotes: number;
  downvotes: number;
  replies?: Commento[];
}
