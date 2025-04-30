import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchArticoli } from "../redux/articoloSlice";
import { Articolo } from "../types/Articolo";

const ArticoliList: React.FC = () => {
  const dispatch = useAppDispatch();
  const articoli = useAppSelector((state) => state.articoli.articoli);
  const loading = useAppSelector((state) => state.articoli.loading);

  useEffect(() => {
    dispatch(fetchArticoli());
  }, [dispatch]);

  return (
    <div>
      <h2>Lista Articoli</h2>
      {loading ? (
        <p>Caricamento...</p>
      ) : (
        <ul>
          {articoli.map((articolo: Articolo) => (
            <li key={articolo.id}>{articolo.titolo}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ArticoliList;
