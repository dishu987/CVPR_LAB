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
import PublicationsEdit from "./edit.publication";
import SupervisorsEdit from "./edit.supervisors";
import ProjectsMainEdit from "./edit.projects.main";
import GalleryImages from "./gallery.images";
import ProjectImages from "./images.project";
import { useSelector } from "react-redux";
import { sendEmailVerification } from "firebase/auth";
import { addAlert } from "../../components/alert/push.alert";
import SiteAdmin from "./site.admin";
import { getUserAuth } from "../../../services/firebase/getauth";
import {
  ADMIN_PHD_LINKS,
  ADMIN_SUPERVISOR_LINKS,
  PHD_LINKS,
  SUPERVISOR_LINKS,
} from "./links.dashboard";
import DatasetsImages from "./images.datasets";
import ProfilePHD from "./profile.phd";
import CVUpload from "./cv.upload";
import ProjectVideo from "./video.projects";

const Dashboard: any = () => {
  const getauth = useSelector((state: any) => state.getauth);
  const [active, setActive] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user: any) => {
      if (!user) {
        try {
          await auth.signOut();
          window.location.href = "/";
        } catch (error) {
          console.error("Error logging out.");
        }
      }
    });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    getUserAuth();
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
  const sendEmailVerificationToCurrentUser = async () => {
    setLoading(true);
    try {
      const user: any = auth?.currentUser;
      if (user) {
        await sendEmailVerification(user);
        addAlert(
          "success",
          "Email has been sent, kindly check your inbox or spam!"
        );
        setLoading(false);
      } else {
        addAlert("danger", "No authenticated user found!");
        setLoading(false);
      }
    } catch (error) {
      addAlert("danger", "Error sending email verification!");
      setLoading(false);
    }
    window.location.reload();
  };
  if (!getauth?.email && !getauth?.userType) {
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
  if (getauth?.email) {
    return (
      <>
        {!getauth?.isVarified && (
          <div
            className="w-100 d-flex justify-content-center align-items-center"
            style={{
              height: "100vh",
              position: "fixed",
              top: 0,
              left: 0,
              zIndex: 999,
              backgroundColor: "#000000c8",
            }}
          >
            <div className="alert alert-danger fw-bold hover_">
              <h4 className="fw-bold text-danger">Warning</h4>
              <ul>
                <li>Your account has not yet been verified.</li>
                <li>
                  You cannot perform actions until your account is verified.
                </li>
                <li>
                  To send a verification email, click on the following link:{" "}
                  <button
                    className="btn btn-link text-danger fw-bold px-1 py-0"
                    onClick={sendEmailVerificationToCurrentUser}
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Click here"}
                  </button>
                </li>
                <li>
                  If you wish to close the window, click the following link:{" "}
                  <button
                    className="btn btn-link text-danger fw-bold px-1 py-0"
                    onClick={handleLogout}
                  >
                    Close Window
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
        <div className="px-4 col-sm-12 col-md-12 col-lg-12 col-xl-12 d-flex justify-content-between flex-row mt-5">
          <div className="col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <h4>
              Welcome, {getauth?.email}(
              <strong className="text-danger">{getauth?.userType}</strong>)
            </h4>
          </div>
        </div>
        <div className="p-4 col-sm-12 col-md-12 col-lg-12 col-xl-12 d-flex justify-content-between flex-row">
          <div className="col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <div className="list-group">
              {getauth?.userType.includes("ADMIN") &&
                getauth?.userType.includes("SUPERVISOR") &&
                ADMIN_SUPERVISOR_LINKS?.map((link, index) => (
                  <Link
                    key={index}
                    to={link.to}
                    className={`list-group-item list-group-item-action ${
                      active === index && "text-white bg-dark"
                    } border-none`}
                    onClick={() => setActive(index)}
                  >
                    {link.text}
                  </Link>
                ))}
              {getauth?.userType.includes("ADMIN") &&
                getauth?.userType.includes("PHD") &&
                ADMIN_PHD_LINKS?.map((link, index) => (
                  <Link
                    key={index}
                    to={link.to}
                    className={`list-group-item list-group-item-action ${
                      active === index && "text-white bg-dark"
                    } border-none`}
                    onClick={() => setActive(index)}
                  >
                    {link.text}
                  </Link>
                ))}
              {!getauth?.userType.includes("ADMIN") &&
                getauth?.userType.includes("PHD") &&
                PHD_LINKS?.map((link, index) => (
                  <Link
                    key={index}
                    to={link.to}
                    className={`list-group-item list-group-item-action ${
                      active === index && "text-white bg-dark"
                    } border-none`}
                    onClick={() => setActive(index)}
                  >
                    {link.text}
                  </Link>
                ))}
              {!getauth?.userType.includes("ADMIN") &&
                getauth?.userType.includes("SUPERVISOR") &&
                SUPERVISOR_LINKS?.map((link, index) => (
                  <Link
                    key={index}
                    to={link.to}
                    className={`list-group-item list-group-item-action ${
                      active === index && "text-white bg-dark"
                    } border-none`}
                    onClick={() => setActive(index)}
                  >
                    {link.text}
                  </Link>
                ))}
              <Link
                to="/"
                target="_blank"
                className="list-group-item list-group-item-action"
              >
                <i className="bx bxs-home-alt-2 me-1"></i> Website Home
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
          {getauth?.isVarified && (
            <Routes>
              <Route element={<h1>Not Found</h1>} path="*" />
              <Route
                element={
                  <div className="w-100 p-3 card mx-3">
                    <h1 className="fw-bold text-danger">
                      Welcome, Computer Vision Website
                    </h1>
                  </div>
                }
                path="/"
              />
              <Route element={<Supervisor />} path="/supervisors" />
              <Route element={<SupervisorsEdit />} path="/supervisors/:id" />
              <Route element={<Publications />} path="/publications" />
              <Route element={<PublicationsEdit />} path="/publications/:id" />
              <Route element={<Peoples />} path="/peoples" />
              <Route element={<CVUpload />} path="/cv" />
              <Route element={<ResearchArea />} path="/research" />
              <Route element={<ResearchSubArea />} path="/research/:id" />
              <Route element={<Projects />} path="/projects-items" />
              <Route element={<ProjectsMain />} path="/projects" />
              <Route element={<ProjectsMainEdit />} path="/projects/:id" />
              <Route element={<ProjectImages />} path="/projects/images/:id" />
              <Route element={<ProjectVideo />} path="/projects/video/:id" />
              <Route element={<Datasets />} path="/datasets" />
              <Route element={<DatasetsImages />} path="/datasets/:id" />
              <Route element={<News />} path="/news" />
              <Route element={<ChangePassword />} path="/change-password" />
              <Route element={<SliderImages />} path="/slider-images" />
              <Route element={<GalleryImages />} path="/gallary-images" />
              <Route element={<SiteAdmin />} path="/site-admin" />
              <Route element={<ProfilePHD />} path="/profile-phd" />
            </Routes>
          )}
        </div>
      </>
    );
  }
};

export default Dashboard;
