import { Link } from "react-router-dom";

const Navbar: any = () => {
  return (
    <>
      <div role="navigation">
        <div className="p-3">
          <div className="row align-items-center justify-content-between w-100">
            <div className="col-lg-1 col-md-1 text-center">
              <div className="">
                <img
                  className="img-fluid"
                  src="https://visionintelligence.github.io/img/logo.png"
                  alt=""
                  style={{ height: "50px", width: "auto" }}
                />
              </div>
            </div>
            <div className="col-lg-2 col-md-2 text-end d-none d-md-block">
              <div className="mt-2">
                <strong>Room Number :</strong> 3rd Floor,EE Department
              </div>
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
                      Peoples
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
                    <a className="nav-link mx-2" href="#">
                      Projects
                    </a>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link mx-2" to={"/publications"}>
                      Publications
                    </Link>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link mx-2" href="#">
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
        {/* <div className="border-bottom d-flex">
          <div>
            <div className="py-2 px-5 bg-danger text-white">Updates</div>
          </div>
          <div className="px-1" style={{ overflow: "hidden" }}>
            <div id="scrollContent" className="text-secondary">
              <div>
                {getnews?.map((item: any, _index: any) => {
                  return (
                    <span key={_index}>
                      <strong className="ms-2 text-danger me-1">
                        {_index + 1}.
                      </strong>
                      {item?.title}-{item?.datetime1}-{item?.description}|
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
          <div>
            <div className="py-2 px-5 bg-dark text-white">
              <Link to="#" className="text-white">
                More
              </Link>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default Navbar;
