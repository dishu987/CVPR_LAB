import { Link } from "react-router-dom";
import "./style.css";
const Footer: React.FC = () => {
  return (
    <div className="d-flex flex-column h-100 border_top_strip">
      <footer className="w-100 py-4 flex-shrink-0">
        <div className="container py-4 p-3">
          <div className="row gy-4 gx-5">
            <div className="col-lg-4 col-md-6">
              <h5 className="h1 text-white">Vision Intelligence Lab</h5>
              <p className="small text-light">
                The Vision Intelligence Lab is a multidisciplinary group
                performing basic and applied research computer vision, machine
                learning and deep learning.
              </p>{" "}
              <Link
                to={"contact"}
                style={{ textDecoration: "none" }}
                className="text-white"
              >
                <button className="btn btn-danger">Contact</button>
              </Link>
            </div>
            <div className="col-lg-2 col-md-6">
              <h5 className="text-white mb-3">Research</h5>
              <ul className="list-unstyled text-muted">
                <li>
                  <Link to={"publications"} className="link_footer">
                    Publications
                  </Link>
                </li>
                <li>
                  <Link to={"projects"} className="link_footer">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link to={"datasets"} className="link_footer">
                    Datasets
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-6">
              <h5 className="text-white mb-3">Peoples</h5>
              <ul className="list-unstyled text-muted">
                <li>
                  <Link to={"peoples"} className="link_footer">
                    Supervisor
                  </Link>
                </li>
                <li>
                  <Link to={"peoples"} className="link_footer">
                    Ph.D.
                  </Link>
                </li>
                <li>
                  <Link to="peoples" className="link_footer">
                    PG and UG
                  </Link>
                </li>
                <li>
                  <Link to="peoples" className="link_footer">
                    Interns and Visitors
                  </Link>
                </li>
                <li>
                  <Link to="peoples" className="link_footer">
                    Alumni Students
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-6">
              <h5 className="text-white mb-3">Quick links</h5>
              <ul className="list-unstyled text-muted">
                <li>
                  <Link to="contact" className="link_footer">
                    About CVPR
                  </Link>
                </li>
                <li>
                  <Link
                    to="https://www.iitrpr.ac.in/"
                    target="_blank"
                    className="link_footer"
                  >
                    IIT Ropar Website
                  </Link>
                </li>
                <li>
                  <Link className="link_footer" to="/login" target="_blank">
                    Administration Login
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-6">
              <h5 className="text-white mb-3">Address</h5>
              <p className="text-white">
                Indian Institute of Technology Ropar (IIT Ropar), Rupnagar,
                Punjab, 140001
              </p>
            </div>
          </div>
          <hr className="text-white" />
          <p className="small text-light w-100 text-center">
            © Copyrights. All rights reserved.{" "}
            <Link to="#" className="text-danger fw-bold">
              CVPR LAB
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
