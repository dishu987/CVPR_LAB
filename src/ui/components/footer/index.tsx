import { Link } from "react-router-dom";
import "./style.css";
import { useSelector } from "react-redux";
const Footer: React.FC = () => {
  const getsettings = useSelector((state: any) => state.getsettings.data);
  const handleThemeChange = (e: any) => {
    e.preventDefault();
    const current_theme = getsettings.themes.filter(
      (theme: any) => theme.name === e.target.value
    )[0];
    if (current_theme) {
      document.documentElement.style.setProperty(
        "--primary-dark",
        current_theme.colors.primary
      );
      document.documentElement.style.setProperty(
        "--secondary-dark",
        current_theme.colors.secondary
      );
      document.documentElement.style.setProperty(
        "--light-dark",
        current_theme.colors.shade1
      );
      document.documentElement.style.setProperty(
        "--secondary-light",
        current_theme.colors.shade2
      );
      document.documentElement.style.setProperty(
        "--primary-light",
        current_theme.colors.shade2
      );
    }
  };
  return (
    <div className="d-flex flex-column h-100 border_top_strip">
      <footer className="w-100 py-4 flex-shrink-0">
        <div className="container py-4 p-3">
          <div className="row gy-4 gx-5">
            <div className="col-lg-4 col-md-6">
              <h5 className="h1 text-white">{getsettings?.name}</h5>
              <p className="small text-light">{getsettings?.about}</p>{" "}
              <div className="d-flex flex-nowrap">
                <Link
                  to={"contact"}
                  style={{ textDecoration: "none" }}
                  className="text-white"
                >
                  <button className="btn btn-shade2 ">Contact</button>
                </Link>
                <select
                  className="btn btn-shade2 ms-1 text-start p-2"
                  style={{
                    outline: 0,
                    boxShadow: "none",
                    border: 0,
                  }}
                  onChange={handleThemeChange}
                >
                  {getsettings?.themes?.map((theme: any, index: number) => {
                    return (
                      <option value={theme.name} key={index}>
                        {theme?.name}
                      </option>
                    );
                  })}
                </select>
              </div>
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
                    About
                  </Link>
                </li>
                <li>
                  <Link className="link_footer" to="/login" target="_blank">
                    Login
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-6">
              <h5 className="text-white mb-3">Address</h5>
              <p className="text-white">{getsettings?.address}</p>
            </div>
          </div>
          <hr className="text-white" />
          <p className="small text-light w-100 text-center">
            © Copyrights. All rights reserved.{" "}
            <Link to="#" className="text-shade2 fw-bold">
              {getsettings?.name}
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
