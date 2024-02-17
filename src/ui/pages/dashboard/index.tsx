import { Link, Route, Routes } from "react-router-dom";
import Publications from "./publications";
import News from "./news";
import { auth } from "../../../firebase";
import { useEffect, useState } from "react";
import ChangePassword from "./change.password";
import SliderImages from "./slider.images";
import Peoples from "./peoples";
import Supervisor from "./supervisor";
import Datasets from "./datasets";
import ResearchArea from "./research.area";
import ResearchSubArea from "./research.subarea";
import Projects from "./projects";
import ProjectsMain from "./projects.main";
import { Helmet } from "react-helmet";

const Dashboard: any = () => {
  const [user, setUser] = useState<any>(null);
  const [active, setActive] = useState<number>(0);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      if (user) {
        setUser(user.email);
      } else {
        window.location.href = "/";
      }
    });
    return () => unsubscribe();
  }, []);
  const handleLogout = async () => {
    if (confirm("Are you sure want to logout?")) {
      try {
        await auth.signOut();
        window.close();
      } catch (error) {
        console.error("Error logging out.");
      }
    }
  };
  if (!user) {
    return (
      <>
        <div
          className="w-100 d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <div
            className="spinner-border text-dark"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    );
  }
  if (user) {
    return (
      <>
        <div className="px-4 col-sm-12 col-md-12 col-lg-12 col-xl-12 d-flex justify-content-between flex-row mt-5">
          <div className="col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <h4>Welcome, {user}</h4>
          </div>
        </div>
        <div className="p-4 col-sm-12 col-md-12 col-lg-12 col-xl-12 d-flex justify-content-between flex-row">
          <div className="col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <div className="list-group">
              <Link
                to={""}
                className={`list-group-item list-group-item-action ${
                  active === 0 && "text-white bg-dark"
                } border-none`}
                aria-current="true"
                onClick={() => setActive(0)}
              >
                Supervisor
              </Link>
              <Link
                to="publications"
                className={`list-group-item list-group-item-action ${
                  active === 1 && "text-white bg-dark"
                } border-none`}
                aria-current="true"
                onClick={() => setActive(1)}
              >
                Publications
              </Link>
              <Link
                to="peoples"
                className={`list-group-item list-group-item-action ${
                  active === 2 && "text-white bg-dark"
                } border-none`}
                aria-current="true"
                onClick={() => setActive(2)}
              >
                Peoples
              </Link>
              <Link
                to="projects-items"
                className={`list-group-item list-group-item-action ${
                  active === 3 && "text-white bg-dark"
                } border-none`}
                aria-current="true"
                onClick={() => setActive(3)}
              >
                Projects Items
              </Link>
              <Link
                to="datasets"
                className={`list-group-item list-group-item-action ${
                  active === 4 && "text-white bg-dark"
                } border-none`}
                aria-current="true"
                onClick={() => setActive(4)}
              >
                Datasets
              </Link>
              <Link
                to="news"
                className={`list-group-item list-group-item-action ${
                  active === 5 && "text-white bg-dark"
                } border-none`}
                aria-current="true"
                onClick={() => setActive(5)}
              >
                News
              </Link>
              <Link
                to="slider-images"
                className={`list-group-item list-group-item-action ${
                  active === 6 && "text-white bg-dark"
                } border-none`}
                aria-current="true"
                onClick={() => setActive(6)}
              >
                Slider Images
              </Link>
              <Link
                to="research"
                className={`list-group-item list-group-item-action ${
                  active === 7 && "text-white bg-dark"
                } border-none`}
                aria-current="true"
                onClick={() => setActive(7)}
              >
                Research Areas
              </Link>
              <Link
                to="projects"
                className={`list-group-item list-group-item-action ${
                  active === 8 && "text-white bg-dark"
                } border-none`}
                aria-current="true"
                onClick={() => setActive(8)}
              >
                Research Projects
              </Link>
              <Link
                to="change-password"
                className={`list-group-item list-group-item-action ${
                  active === 9 && "text-white bg-dark"
                } border-none`}
                aria-current="true"
                onClick={() => setActive(9)}
              >
                Change Password
              </Link>
              <Link
                to="/"
                target="_blank"
                className="list-group-item list-group-item-action"
              >
                Website Home
              </Link>
              <Link
                to="#"
                onClick={handleLogout}
                className="d-flex align-items-center list-group-item list-group-item-action text-danger"
              >
                <i className="bx bx-log-out-circle me-2"></i>Logout
              </Link>
            </div>
          </div>
          <Helmet>
            <title>Dashboard | {import.meta.env.VITE_APP_TITLE}</title>
          </Helmet>
          <Routes>
            <Route element={<Supervisor />} path="*" />
            <Route element={<Supervisor />} path="/" />
            <Route element={<Publications />} path="/publications" />
            <Route element={<Peoples />} path="/peoples" />
            <Route element={<ResearchArea />} path="/research" />
            <Route element={<ResearchSubArea />} path="/research/:id" />
            <Route element={<Projects />} path="/projects-items" />
            <Route element={<ProjectsMain />} path="/projects" />
            <Route element={<Datasets />} path="/datasets" />
            <Route element={<News />} path="/news" />
            <Route element={<ChangePassword />} path="/change-password" />
            <Route element={<SliderImages />} path="/slider-images" />
          </Routes>
        </div>
      </>
    );
  }
};

export default Dashboard;
