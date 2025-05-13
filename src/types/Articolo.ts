import { Commento } from "./Commento";
export interface Articolo {
  id: number;
  titolo: string;
  contenuto: string;
  dataPubblicazione: string | Date;
  autoreId: string;
  autoreUserName?: string;
  copertinaUrl: string;
  commenti: Commento[];
}
