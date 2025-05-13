import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../redux/hooks";
import type { RootState } from "../redux/store";
import { fetchArticoli } from "../redux/articoloSlice";
import type { Articolo } from "../types/Articolo";
import { Link } from "react-router-dom";
import Logo from "../assets/PaleoPlatform logo reference.svg";
import { paleoTheme } from "../styles/theme";

const Home = () => {
  const dispatch = useAppDispatch();
  const stripHtmlTags = (html: string) => {
    return html.replace(/<[^>]*>?/gm, "");
  };

  const articoli = useSelector((state: RootState) => state.articoli.articoli);
  const loading = useSelector((state: RootState) => state.articoli.loading);

  useEffect(() => {
    dispatch(fetchArticoli());
  }, [dispatch]);

  const newestArticoli = [...articoli]
    .sort(
      (a, b) =>
        new Date(b.dataPubblicazione).getTime() -
        new Date(a.dataPubblicazione).getTime()
    )
    .slice(0, 4);
  return (
    <div
      className="home-page"
      style={{
        backgroundColor: paleoTheme.colors.background,
        color: paleoTheme.colors.textDark,
      }}
    >
      <section
        className="hero-section py-5"
        style={{
          background: `linear-gradient(135deg, ${paleoTheme.colors.background} 0%, ${paleoTheme.colors.lightAccent} 100%)`,
          borderBottom: paleoTheme.borders.default,
        }}
      >
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1
                className="display-4 fw-bold mb-4"
                style={{ color: "#5C3A21" }}
              >
                Benvenuti nel Mondo della Preistoria!
              </h1>
              <p className="lead mb-4" style={{ color: "#6D4C41" }}>
                Scopri le ultime notizie, ricerche e discussioni sulla
                paleontologia e la vita preistorica.
              </p>
              <div className="d-flex gap-3">
                <Link
                  to="/articoli"
                  className="btn btn-lg"
                  style={{
                    backgroundColor: "#8D6E63",
                    color: "white",
                  }}
                >
                  Esplora gli Articoli
                </Link>
                <Link
                  to="/community"
                  className="btn btn-lg"
                  style={{
                    backgroundColor: "#5C3A21",
                    color: "white",
                  }}
                >
                  Unisciti alla Community
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <img
                src={Logo}
                alt="Logo"
                className="img-fluid"
                style={{
                  filter: "drop-shadow(5px 5px 10px rgba(92, 58, 33, 0.3))",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-5"
        style={{
          backgroundColor: paleoTheme.colors.white,
          borderTop: paleoTheme.borders.light,
        }}
      >
        <div
          className="container py-5"
          style={{ color: paleoTheme.colors.primary }}
        >
          <h1 className="mb-4 text-left">Ultimi Articoli</h1>
          {loading && (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          )}
          <div className="row g-4">
            {newestArticoli.map((articolo: Articolo) => (
              <div className="col-sm-6 col-md-4 col-lg-3" key={articolo.id}>
                <div className="card h-100 shadow-sm border-0">
                  <img
                    src={articolo.copertinaUrl}
                    className="card-img-top"
                    alt={articolo.titolo}
                    style={{ objectFit: "cover", height: "200px" }}
                  />
                  <div
                    className="card-body d-flex flex-column"
                    style={{ backgroundColor: paleoTheme.colors.background }}
                  >
                    <h5 className="card-title">{articolo.titolo}</h5>
                    <p className="card-text">
                      {stripHtmlTags(articolo.contenuto).substring(0, 200)}...
                    </p>
                    <Link
                      to={`/articolo/${articolo.id}`}
                      className="btn mt-auto"
                      style={{
                        backgroundColor: "#5C3A21",
                        color: "white",
                      }}
                    >
                      Leggi
                    </Link>
                    <p className="text-muted mt-2 d-flex align-items-center">
                      <i className="bi bi-chat-square-text-fill me-1"></i>
                      {articolo.commenti?.length ?? 0} commenti
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {articoli.length > 4 && (
            <div className="text-center mt-4">
              <Link
                to="/articoli"
                className="btn"
                style={{
                  backgroundColor: "#5C3A21",
                  color: "white",
                }}
              >
                Vedi Tutti gli Articoli
              </Link>
            </div>
          )}
        </div>
      </section>
      {/* Community Section */}
      <section
        className="py-5"
        style={{
          background: `linear-gradient(180deg, ${paleoTheme.colors.white} 0%, ${paleoTheme.colors.background} 100%)`,
        }}
      >
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 order-lg-2">
              <img
                src="/community-image.jpg"
                alt="Community discussion"
                className="img-fluid rounded shadow"
              />
            </div>
            <div className="col-lg-6 order-lg-1">
              <h2
                className="display-5 fw-bold mb-4"
                style={{ color: paleoTheme.colors.primary }}
              >
                Unisciti alla Nostra Community
              </h2>
              <p className="lead mb-4">
                Connettiti con altri appassionati di paleontologia, condividi le
                tue conoscenze e partecipa a discussioni avvincenti.
              </p>
              <ul className="list-unstyled mb-4">
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-paleoTheme.colors.primary me-2"></i>
                  Forum di discussione
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-paleoTheme.colors.primary me-2"></i>
                  Gruppi tematici
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-paleoTheme.colors.primary me-2"></i>
                  Eventi virtuali
                </li>
              </ul>
              <Link
                to="/community"
                className="btn btn-lg"
                style={{
                  backgroundColor: "#5C3A21",
                  color: "white",
                }}
              >
                Entra nella Community
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Eventi Section */}
      <section
        className="py-5"
        style={{
          backgroundColor: paleoTheme.colors.background,
          boxShadow: paleoTheme.shadows.medium,
        }}
      >
        <div className="container py-5">
          <h2
            className="text-center mb-5 display-5 fw-bold"
            style={{ color: paleoTheme.colors.primary }}
          >
            Prossimi Eventi
          </h2>
          <div className="row g-4">
            {[1, 2, 3].map((event) => (
              <div className="col-md-4" key={event}>
                <div className="card h-100 shadow-sm">
                  <img
                    src={`/event-${event}.jpg`}
                    className="card-img-top"
                    alt={`Event ${event}`}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      Conferenza sui{" "}
                      {event === 1
                        ? "T-Rex"
                        : event === 2
                        ? "Raptor"
                        : "Fossili"}
                    </h5>
                    <p className="text-muted">
                      <i className="bi bi-calendar-event me-2"></i>
                      15 Giugno 2023
                    </p>
                    <p className="text-muted">
                      <i className="bi bi-geo-alt me-2"></i>
                      {event === 1
                        ? "Museo di Storia Naturale"
                        : event === 2
                        ? "Online"
                        : "Università di Roma"}
                    </p>
                    <Link
                      to={`/eventi/${event}`}
                      className="btn mt-2"
                      style={{
                        backgroundColor: "#5C3A21",
                        color: "white",
                      }}
                    >
                      Dettagli
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <Link
              to="/eventi"
              className="btn btn-lg"
              style={{
                backgroundColor: "#5C3A21",
                color: "white",
              }}
            >
              Vedi Tutti gli Eventi
            </Link>
          </div>
        </div>
      </section>
      {/* Negozio Section */}
      <section
        className="py-5"
        style={{
          backgroundColor: paleoTheme.colors.white,
          borderTop: paleoTheme.borders.default,
        }}
      >
        <div className="container py-5">
          <h2
            className="text-center mb-5 display-5 fw-bold"
            style={{ color: paleoTheme.colors.primary }}
          >
            Il Nostro Negozio
          </h2>
          <div className="row g-4">
            {[1, 2, 3, 4].map((product) => (
              <div className="col-md-3" key={product}>
                <div className="card h-100 shadow-sm">
                  <img
                    src={`/product-${product}.jpg`}
                    className="card-img-top"
                    alt={`Product ${product}`}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">
                      {product === 1
                        ? "Modellino T-Rex"
                        : product === 2
                        ? "Libro sui Dinosauri"
                        : product === 3
                        ? "Maglietta Raptor"
                        : "Kit Scavo Fossile"}
                    </h5>
                    <p className="card-text mt-auto">
                      <span className="fw-bold text-paleoTheme.colors.primary">
                        €
                        {product === 1
                          ? "24.99"
                          : product === 2
                          ? "18.50"
                          : product === 3
                          ? "22.00"
                          : "32.99"}
                      </span>
                    </p>
                    <button
                      className="btn mt-2"
                      style={{
                        backgroundColor: "#5C3A21",
                        color: "white",
                      }}
                    >
                      Aggiungi al Carrello
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <Link
              to="/negozio"
              className="btn btn-lg"
              style={{
                backgroundColor: "#5C3A21",
                color: "white",
              }}
            >
              Visita il Negozio Completo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
