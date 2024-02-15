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
              </p>
              <button className="btn btn-danger">More</button>
            </div>
            <div className="col-lg-2 col-md-6">
              <h5 className="text-white mb-3">Research</h5>
              <ul className="list-unstyled text-muted">
                <li>
                  <a href="#" className="link_footer">
                    Publications
                  </a>
                </li>
                <li>
                  <a href="#" className="link_footer">
                    Projects
                  </a>
                </li>
                <li>
                  <a href="#" className="link_footer">
                    Datasets
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-6">
              <h5 className="text-white mb-3">Peoples</h5>
              <ul className="list-unstyled text-muted">
                <li>
                  <a href="#" className="link_footer">
                    Supervisor
                  </a>
                </li>
                <li>
                  <a href="#" className="link_footer">
                    Ph.D.
                  </a>
                </li>
                <li>
                  <a href="#" className="link_footer">
                    PG and UG
                  </a>
                </li>
                <li>
                  <a href="#" className="link_footer">
                    Interns and Visitors
                  </a>
                </li>
                <li>
                  <a href="#" className="link_footer">
                    Alumni Students
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-6">
              <h5 className="text-white mb-3">Quick links</h5>
              <ul className="list-unstyled text-muted">
                <li>
                  <a href="#" className="link_footer">
                    About CVPR
                  </a>
                </li>
                <li>
                  <a href="#" className="link_footer">
                    IIT Ropar Website
                  </a>
                </li>
                <li>
                  <a className="link_footer" href="/login" target="_blank">
                    Administration Login
                  </a>
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
            <a className="text-danger fw-bold" href="#">
              CVPR LAB
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
