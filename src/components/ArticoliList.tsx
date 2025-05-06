import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchArticoli } from "../redux/articoloSlice";
import { Articolo } from "../types/Articolo";

const ArticoliList: React.FC = () => {
  const dispatch = useAppDispatch();
  const articoli = useAppSelector((state) => state.articoli.articoli);
  const loading = useAppSelector((state) => state.articoli.loading);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  useEffect(() => {
    dispatch(fetchArticoli());
  }, [dispatch]);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement>,
    articoloId: number
  ) => {
    const target = e.target as HTMLImageElement;
    console.error("Image failed to load:", target.src);
    setImageErrors((prev) => ({ ...prev, [articoloId]: true }));

    // Debug fetch
    fetch(target.src)
      .then((res) => {
        console.log("HTTP Status:", res.status);
        return res.text();
      })
      .then((text) => {
        console.log(
          "Response content (first 100 chars):",
          text.substring(0, 100)
        );
      })
      .catch((err) => console.error("Fetch error:", err));
  };

  return (
    <div>
      <h2>Lista Articoli</h2>
      {loading ? (
        <p>Caricamento...</p>
      ) : (
        <ul>
          {articoli.map((articolo: Articolo) => {
            const imageUrl = `http://localhost:7224${articolo.copertinaUrl}`;
            const hasError = imageErrors[articolo.id] || !articolo.copertinaUrl;

            return (
              <li key={articolo.id}>
                <h3>{articolo.titolo}</h3>
                <div style={{ margin: "10px 0" }}>
                  <small style={{ color: "gray" }}>DEBUG: {imageUrl}</small>
                </div>
                {!hasError ? (
                  <img
                    src={imageUrl}
                    onError={(e) => handleImageError(e, articolo.id)}
                    alt={articolo.titolo}
                  />
                ) : (
                  <div
                    style={{
                      border: "2px solid red",
                      padding: "10px",
                      color: "red",
                    }}
                  >
                    Image failed to load.{" "}
                    <a
                      href={imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "blue" }}
                    >
                      Try direct link
                    </a>
                  </div>
                )}
                <p>{articolo.contenuto.slice(0, 100)}...</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ArticoliList;
