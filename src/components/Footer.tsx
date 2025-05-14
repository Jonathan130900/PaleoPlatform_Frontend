import { Link } from "react-router-dom";
import PaleoLogoWithText from "../assets/PaleoPlatform logo reference.svg";
import { paleoTheme } from "../styles/theme";

const Footer = () => {
  return (
    <footer
      className="py-4 w-100 mt-auto"
      style={{
        backgroundColor: paleoTheme.colors.background,
        borderTop: paleoTheme.borders.default,
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <img
              src={PaleoLogoWithText}
              alt="Logo"
              style={{
                width: "250px",
                height: "auto",
                filter: "drop-shadow(1px 1px 2px rgba(92, 58, 33, 0.2))",
              }}
            />
          </div>
          <div className="col-md-4 mb-3">
            <h5 style={{ color: paleoTheme.colors.primary }}>Quick Links</h5>
            <ul className="list-unstyled">
              {["Home", "Articoli", "Community", "Eventi"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className="text-decoration-none"
                    style={{ color: paleoTheme.colors.textMedium }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-md-4 mb-3">
            <h5 style={{ color: paleoTheme.colors.primary }}>Contatti</h5>
            <ul
              className="list-unstyled"
              style={{ color: paleoTheme.colors.textMedium }}
            >
              <li>Email: info@paleoplatform.com</li>
              <li>Tel: +1 (123) 456-7890</li>
            </ul>
          </div>
        </div>

        <hr
          style={{
            borderColor: paleoTheme.colors.primary,
            opacity: 0.2,
          }}
        />

        <div className="text-center">
          <p className="mb-0" style={{ color: paleoTheme.colors.textMedium }}>
            &copy; {new Date().getFullYear()} PaleoPlatform. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
