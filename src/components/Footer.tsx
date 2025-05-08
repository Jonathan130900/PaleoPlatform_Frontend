import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 w-100">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5>PaleoPlatform</h5>
            <p>Riscopri il passato, connettiti con il presente</p>
          </div>
          <div className="col-md-4 mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/articoli" className="text-white">
                  Articoli
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-white">
                  Community
                </Link>
              </li>
              <li>
                <Link to="/eventi" className="text-white">
                  Eventi
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-md-4 mb-3">
            <h5>Contatti</h5>
            <ul className="list-unstyled">
              <li>Email: info@paleoplatform.com</li>
              <li>Tel: +1 (123) 456-7890</li>
            </ul>
          </div>
        </div>
        <hr className="my-4 bg-secondary" />
        <div className="text-center">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} PaleoPlatform. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
