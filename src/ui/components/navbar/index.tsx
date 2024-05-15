import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
const Navbar: any = () => {
  const getsettings = useSelector((state: any) => state.getsettings.data);
  return (
    <>
      <div role="navigation">
        <div className="p-3">
          <div className="row align-items-center justify-content-between w-100">
            <div className="col-lg-2 col-md-2 text-center">
              <div className="">
                <img
                  className="img-fluid"
                  src={getsettings?.logo}
                  alt="LOGO"
                  style={{ height: "70px", width: "auto" }}
                />
              </div>
            </div>
            <div className="col-lg-8 col-md-8 text-end d-none d-md-block text-center">
              <h3 className="fw-bold">{getsettings?.name}</h3>
            </div>
            <div className="col-lg-2 col-md-2 text-end d-none d-md-block">
              <div className="mt-2">{getsettings?.address}</div>
            </div>
          </div>
        </div>
        <div className="navbar_custom" id="subNavContainer">
          <nav className="navbar navbar-expand-md">
            <div className="container-fluid">
              <button
                className="navbar-toggler mx-auto collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNavDropdown"
                aria-controls="navbarNavDropdown"
                aria-expanded="false"
                aria-label="Toggle navigation"
                style={{ color: "var(--primary-light)" }}
              >
                <i className="fas fa-bars me-2" aria-hidden="true" /> Menu
              </button>
              <div className="navbar-collapse collapse" id="navbarNavDropdown">
                <ul className="navbar-nav mx-auto ">
                  <li className="nav-item">
                    <Link
                      className="nav-link mx-2 active"
                      aria-current="page"
                      to="/"
                    >
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link mx-2 active"
                      aria-current="page"
                      to="/peoples"
                    >
                      People
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link mx-2 active"
                      aria-current="page"
                      to="/gallery"
                    >
                      Gallery
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link mx-2" to={"/research-areas"}>
                      Research
                    </Link>
                  </li>
                  {/*  */}
                  <li className="nav-item">
                    <Link className="nav-link mx-2" to={"/datasets"}>
                      Datasets
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link mx-2" to={"/projects"}>
                      Projects
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link mx-2" to={"/publications"}>
                      Publications
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link mx-2" to={"/contact"}>
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
