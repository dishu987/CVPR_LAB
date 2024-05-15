import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchSupervisors } from "../../../services/firebase/getsupervisors";
import { fetchphd } from "../../../services/firebase/getphd";
import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";
import { fetchPublications } from "../../../services/firebase/getpublications";
import { fetchProjectsItems } from "../../../services/firebase/getprojectitems";
import { fetchDatasets } from "../../../services/firebase/getdatasets";
import { fetchProjectsMain } from "../../../services/firebase/getprojects.main";
import { fetchProjectsImages } from "../../../services/firebase/getprojectimages";
import {
  getResumeURL,
  getVideoURL,
} from "../../../services/firebase/getresume";
import { addAlert } from "../../components/alert/push.alert";
import BibTexEntryRenderer from "../../components/bibtex.render";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";

const DetailProfile: React.FC = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const getsupervisors = useSelector((state: any) => state.getsupervisors.data);
  const supervisor_ = getsupervisors.filter((item_: any) => item_._id == id)[0];
  const getpublications_ = useSelector(
    (state: any) => state.getpublications.data
  );
  const getpublications = getpublications_.filter((item_: any) => {
    const values = item_?.data?.users;
    if (values && values.length > 0) {
      return values.some((value: any) => {
        return value === supervisor_?.data?.email;
      });
    }
    return false;
  });
  const getprojectsimages = useSelector(
    (state: any) => state.getprojectsimages?.data
  );
  const getProjects = useSelector((state: any) => state.getprojectitems?.data);
  const getdatasets = useSelector((state: any) => state.getdatasets?.data);
  const getProjectsMain_ = useSelector(
    (state: any) => state.getprojectsmain?.data
  );
  const getProjectsMain = getProjectsMain_.filter((item_: any) => {
    const values = item_?.users?.arrayValue?.values;
    if (values && values.length > 0) {
      return values.some((value: any) => {
        return value.stringValue === supervisor_?.data?.email;
      });
    }
    return false;
  });
  const getphd_ = useSelector((state: any) => state.getphdStudents.data);
  const getphd = getphd_.filter(
    (phd: any) =>
      phd.data.supervisor.mapValue.fields.email.stringValue ===
      supervisor_?.data?.email
  );
  const [cv, setCV] = useState<string>("");
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchSupervisors();
      await fetchPublications();
      await fetchProjectsMain();
      await fetchphd();
      setLoading(false);
      await fetchDatasets();
      await fetchProjectsItems();
      await fetchProjectsImages();
      const handleCV = async () => {
        const res: any = await getResumeURL(supervisor_?.data?.email);
        setCV(res);
      };
      await handleCV();
    };
    fetchData();
  }, []);
  if (loading) {
    return (
      <div
        className="d-flex w-100 justify-content-center align-items-center flex-column flex-wrap"
        style={{ height: "100vh" }}
      >
        <h4>Please Wait..</h4>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{supervisor_?.data?.name}</title>
      </Helmet>
      <Navbar />
      <div className="container my-5 ">
        <div className="card p-3 mb-4">
          <div className="col-sm-12 d-flex justify-content-between px-lg-0 px-3 flex-row flex-wrap">
            <div className="col-sm-2 py-2 pe-2">
              <div className="card p-2">
                <img
                  src={supervisor_?.profileImage}
                  alt=""
                  className="rounded-1"
                />
              </div>
            </div>
            <div className="col-sm-10">
              <h2 className="fw-bold text-dark ms-2">
                {supervisor_?.data?.name}
              </h2>
              <p className="text-muted">
                <strong className="text-shade2 ms-2">
                  {supervisor_?.data?.designation}
                </strong>{" "}
                | <strong>{supervisor_?.data?.email}</strong> |{" "}
                <strong>
                  +91-
                  {supervisor_?.data?.phone}
                </strong>
                <br />
                <div className="mt-3">
                  {/* <button
                    className="btn btn-shade1 my-2 btn-sm"
                    onClick={() =>
                      window.open("#/profile/" + supervisor_._id, "_blank")
                    }
                  >
                    Detailed Profile <i className="bx bx-link-external"></i>
                  </button> */}
                  {cv !== null && cv !== "" && (
                    <button
                      className="btn btn-shade1 my-2 btn-sm ms-2"
                      onClick={() => window.open(cv, "_blank")}
                    >
                      Resume
                    </button>
                  )}
                  <span className="dropdown ms-2">
                    <button
                      className="btn btn-shade1 dropdown-toggle btn-sm"
                      type="button"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Profile Links
                    </button>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton1"
                    >
                      {supervisor_?.data?.links?.map((link: any) => {
                        return (
                          <li>
                            <a
                              className="dropdown-item"
                              style={{ textDecoration: "none" }}
                              href={link?.linkURL ? link?.linkURL : "#"}
                              target="_blank"
                            >
                              {link?.linkName}
                              <i className="bx bx-link-external"></i>
                            </a>{" "}
                          </li>
                        );
                      })}
                    </ul>
                  </span>
                </div>
              </p>
            </div>
          </div>
          <div className="col-sm-12 px-lg-0 px-3 ">
            <h3 className="fw-bold">Introduction</h3>
            <hr />
            <p>{supervisor_?.data?.introduction}</p>
          </div>
          <table className="table table-bordered table-hover table-responsive">
            <tbody>
              <tr>
                <td className="text-nowrap">
                  <strong>Research Interests</strong>
                </td>
                <td>
                  <ol className="d-flex flex-wrap">
                    {supervisor_?.data?.researchInterests
                      ?.split(",")
                      .map((item: any, key_: any) => {
                        return (
                          <li key={key_} className="mx-3">
                            {item}
                          </li>
                        );
                      })}
                  </ol>
                </td>
              </tr>
              <tr>
                <td className="text-nowrap">
                  <strong>Teaching</strong>
                </td>
                <td>
                  <ol className="d-flex flex-wrap">
                    {supervisor_?.data?.teaching
                      ?.split(",")
                      .map((item: any, key_: any) => {
                        return (
                          <li key={key_} className="mx-3">
                            {item}
                          </li>
                        );
                      })}
                  </ol>
                </td>
              </tr>
              <tr>
                <td className="text-nowrap">
                  <strong>Accomplishments</strong>
                </td>
                <td>
                  <ol className="d-flex flex-wrap">
                    {supervisor_?.data?.accomplishments
                      ?.split(",")
                      .map((item: any, key_: any) => {
                        return (
                          <li key={key_} className="mx-3">
                            {item}
                          </li>
                        );
                      })}
                  </ol>
                </td>
              </tr>
              <tr>
                <td className="text-nowrap">
                  <strong>Professional Affiliation</strong>
                </td>
                <td>
                  <ol className="d-flex flex-wrap">
                    {supervisor_?.data?.professional_affiliation
                      ?.split(",")
                      .map((item: any, key_: any) => {
                        return (
                          <li key={key_} className="mx-3">
                            {item}
                          </li>
                        );
                      })}
                  </ol>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="card p-3 mb-4">
          <div className="col-sm-12 d-flex justify-content-between px-lg-0 flex-row flex-wrap">
            <h3 className="fw-bold w-100 mb-3">Research Papers</h3>
            <hr />
            <div className="overflow-hidden">
              <ol
                style={{
                  height: "fit-content",
                  overflow: "hidden",
                }}
              >
                {getpublications?.map((item: any, index: any) => {
                  const { users } = item?.data;
                  const isContain = users.filter(
                    (item_: any) => item_ === supervisor_?.data?.email
                  )[0];
                  if (!isContain) return;
                  return (
                    <li key={index} className="mb-2">
                      <BibTexEntryRenderer entry={item?.data} id={item?._id} />
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
        <div className="card p-3 mb-4">
          <div className="col-sm-12 d-flex justify-content-between px-lg-0 flex-row flex-wrap">
            <h3 className="fw-bold w-100 mb-3">Research Projects</h3>
            <hr />
            <div
              className="accordion w-100 overflow-auto"
              id="accordionExample"
            >
              {getProjectsMain?.map((item: any, index: any) => {
                return (
                  <div
                    className="accordion-item w-100 overflow-auto"
                    key={index}
                  >
                    <h1 className="accordion-header" id={"heading" + index}>
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={"#" + "collapse" + index}
                        aria-expanded="true"
                        aria-controls={"collapse" + index}
                      >
                        <h5>
                          <strong className="text-shade2">{index + 1}. </strong>
                          {item?.title?.stringValue}
                        </h5>
                      </button>
                    </h1>
                    <div className="w-100 overflow-auto col-sm-12">
                      <div
                        id={"collapse" + index}
                        className="accordion-collapse collapse"
                        aria-labelledby={"heading" + index}
                        data-bs-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <div
                            className="col-sm-12 mb-3 overflow-auto"
                            key={"item_" + index}
                          >
                            <div className="col-sm-12 d-flex flex-column flex-md-column flex-lg-column gap-3 pe-2 mt-2">
                              <div className="col-md-12 col-lg-12  col-sm-12  w-100 overflow-auto">
                                <table className="table table-bordered">
                                  <tbody>
                                    <tr>
                                      <td colSpan={2}>
                                        <h5 className="fw-bold mt-2">
                                          Project Details
                                        </h5>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <h6 className="fw-bold mt-2">
                                          <strong className="text-shade2">
                                            1.{" "}
                                          </strong>
                                          Project Video
                                        </h6>
                                      </td>
                                      <td>
                                        {item?.video?.mapValue?.fields
                                          ?.timestamp?.timestampValue ? (
                                          <button
                                            className="btn btn-success d-flex align-items-center"
                                            onClick={async () => {
                                              try {
                                                const res: any =
                                                  await getVideoURL(item?._id);
                                                const newWindow = window.open(
                                                  res,
                                                  "_blank",
                                                  "width=550,height=700"
                                                );
                                                if (newWindow) {
                                                  newWindow.focus();
                                                }
                                              } catch {
                                                addAlert(
                                                  "warning",
                                                  "Video Not Found!"
                                                );
                                              }
                                            }}
                                          >
                                            <i className="bx bx-video me-1"></i>{" "}
                                            Watch Now
                                          </button>
                                        ) : (
                                          "Not Available"
                                        )}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <h6 className="fw-bold mt-2">
                                          <strong className="text-shade2">
                                            2.{" "}
                                          </strong>
                                          Funding Agency
                                        </h6>
                                      </td>
                                      <td>
                                        {item?.funding_agency?.stringValue}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <h6 className="fw-bold mt-2">
                                          <strong className="text-shade2">
                                            3.{" "}
                                          </strong>
                                          Total Fund
                                        </h6>
                                      </td>
                                      <td>
                                        Rs. {item?.total_fund?.stringValue}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <h6 className="fw-bold mt-2">
                                          <strong className="text-shade2">
                                            4.{" "}
                                          </strong>
                                          Project Investigators
                                        </h6>
                                      </td>
                                      <td>{item?.pis?.stringValue}</td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <h6 className="fw-bold mt-2">
                                          <strong className="text-shade2">
                                            5.{" "}
                                          </strong>
                                          Co-Project Investigators
                                        </h6>
                                      </td>
                                      <td>{item?.copis?.stringValue}</td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <h6 className="fw-bold mt-2">
                                          <strong className="text-shade2">
                                            6.{" "}
                                          </strong>
                                          Ph.D./JRF Students
                                        </h6>
                                      </td>
                                      <td>
                                        {item?.jrf_phd_scholar?.stringValue}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <div className="col-sm-12 col-lg-12 col-md-12  card px-2 rounded-0">
                                <h4 className="fw-bold text-shade2 mt-2">
                                  Introduction
                                </h4>
                                <hr className="mx-1 mt-0 mb-2" />
                                <p className="w-100 overflow-auto">
                                  {item?.description?.stringValue}
                                </p>
                                <div className="px-1 mb-3">
                                  <h6 className="fw-bold mt-2">
                                    Project Images
                                  </h6>
                                  <div className="d-flex flex-column flex-wrap">
                                    <div
                                      id={"carouselExampleCaptions" + index}
                                      className="carousel slide"
                                      data-bs-ride="carousel"
                                    >
                                      <div className="carousel-indicators">
                                        <button
                                          type="button"
                                          data-bs-target={
                                            "#carouselExampleCaptions" + index
                                          }
                                          data-bs-slide-to={0}
                                          className="active"
                                          aria-current="true"
                                          aria-label="Slide 1"
                                        />
                                        <button
                                          type="button"
                                          data-bs-target={
                                            "#carouselExampleCaptions" + index
                                          }
                                          data-bs-slide-to={1}
                                          aria-label="Slide 2"
                                        />
                                        <button
                                          type="button"
                                          data-bs-target={
                                            "#carouselExampleCaptions" + index
                                          }
                                          data-bs-slide-to={2}
                                          aria-label="Slide 3"
                                        />
                                      </div>
                                      <div className="carousel-inner">
                                        {getprojectsimages
                                          ?.filter(
                                            (v_: any) =>
                                              v_?.project == item?._id
                                          )
                                          ?.map((__item: any, i_: any) => {
                                            return (
                                              <div
                                                className={
                                                  i_ === 0
                                                    ? "carousel-item active"
                                                    : "carousel-item"
                                                }
                                                key={i_}
                                              >
                                                <img
                                                  src={__item?.bannerURL}
                                                  className="d-block w-100"
                                                  alt="banner image"
                                                  height={"400px"}
                                                />
                                                <div className="carousel-caption d-none d-md-block">
                                                  <h3 className="fw-bold text-primary">
                                                    {__item?.title}
                                                  </h3>
                                                </div>
                                              </div>
                                            );
                                          })}
                                      </div>
                                      <button
                                        className="carousel-control-prev btn btn-dark"
                                        type="button"
                                        data-bs-target={
                                          "#carouselExampleCaptions" + index
                                        }
                                        data-bs-slide="prev"
                                        style={{ transition: "0.3s ease all" }}
                                      >
                                        <span
                                          className="carousel-control-prev-icon"
                                          aria-hidden="true"
                                        />
                                        <span className="visually-hidden">
                                          Previous
                                        </span>
                                      </button>
                                      <button
                                        className="carousel-control-next btn btn-dark"
                                        type="button"
                                        data-bs-target={
                                          "#carouselExampleCaptions" + index
                                        }
                                        data-bs-slide="next"
                                        style={{ transition: "0.3s ease all" }}
                                      >
                                        <span
                                          className="carousel-control-next-icon"
                                          aria-hidden="true"
                                        />
                                        <span className="visually-hidden">
                                          Next
                                        </span>
                                      </button>
                                    </div>
                                  </div>
                                  <h6 className="fw-bold mt-2">
                                    Related Datasets
                                  </h6>
                                  <div className="d-flex flex-column flex-wrap">
                                    {item?.related_datasets?.arrayValue?.values?.map(
                                      (item: any, i_: any) => {
                                        const __item = getdatasets?.find(
                                          (pro: any) =>
                                            pro?._id == item?.stringValue
                                        );
                                        return (
                                          <div key={i_}>
                                            {i_ + 1}. {__item?.title} (
                                            <Link
                                              to={"#"}
                                              className="text-primary"
                                              style={{ textDecoration: "none" }}
                                              data-bs-toggle="modal"
                                              data-bs-target={
                                                "#" + __item?._id + "Modal"
                                              }
                                            >
                                              Open
                                            </Link>
                                            )
                                            <div
                                              className="modal fade"
                                              id={__item?._id + "Modal"}
                                              tabIndex={-1}
                                              aria-labelledby={
                                                __item?._id + "ModalLabel"
                                              }
                                              aria-hidden="true"
                                              data-bs-backdrop="static"
                                              data-bs-keyboard="false"
                                            >
                                              <div className="modal-dialog modal-xl">
                                                <div className="modal-content rounded-0 border-none">
                                                  <div className="modal-header">
                                                    <h5
                                                      className="modal-title"
                                                      id={
                                                        __item?._id +
                                                        "ModalLabel"
                                                      }
                                                    >
                                                      {__item?.title}
                                                    </h5>
                                                    <button
                                                      type="button"
                                                      className="btn-close"
                                                      data-bs-dismiss="modal"
                                                      aria-label="Close"
                                                    />
                                                  </div>
                                                  <div className="modal-body">
                                                    <div className="">
                                                      <p>
                                                        {__item?.description}
                                                      </p>
                                                      <div className="card p-3">
                                                        <div
                                                          id={
                                                            "carouselExampleControls" +
                                                            index
                                                          }
                                                          className="carousel slide"
                                                          data-bs-ride="carousel"
                                                        >
                                                          <div className="carousel-inner">
                                                            {__item?.images.map(
                                                              (
                                                                image__: any,
                                                                key: number
                                                              ) => {
                                                                return (
                                                                  <div
                                                                    className={`carousel-item ${
                                                                      key ===
                                                                        0 &&
                                                                      "active"
                                                                    }`}
                                                                    key={key}
                                                                  >
                                                                    <img
                                                                      src={
                                                                        image__?.url
                                                                      }
                                                                      className="d-block w-100"
                                                                      alt={
                                                                        "This is image"
                                                                      }
                                                                    />
                                                                  </div>
                                                                );
                                                              }
                                                            )}
                                                          </div>
                                                          <button
                                                            className="carousel-control-prev btn btn-dark"
                                                            type="button"
                                                            data-bs-target={
                                                              "#carouselExampleControls" +
                                                              index
                                                            }
                                                            data-bs-slide="prev"
                                                          >
                                                            <span
                                                              className="carousel-control-prev-icon"
                                                              aria-hidden="true"
                                                            />
                                                            <span className="visually-hidden">
                                                              Previous
                                                            </span>
                                                          </button>
                                                          <button
                                                            className="carousel-control-next  btn btn-dark"
                                                            type="button"
                                                            data-bs-target={
                                                              "#carouselExampleControls" +
                                                              index
                                                            }
                                                            data-bs-slide="next"
                                                          >
                                                            <span
                                                              className="carousel-control-next-icon"
                                                              aria-hidden="true"
                                                            />
                                                            <span className="visually-hidden">
                                                              Next
                                                            </span>
                                                          </button>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className="modal-footer">
                                                    <button
                                                      type="button"
                                                      className="btn btn-outline-danger"
                                                      data-bs-dismiss="modal"
                                                    >
                                                      Close
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                  <h6 className="fw-bold mt-2">
                                    Related Projects
                                  </h6>
                                  <div className="d-flex flex-column flex-wrap">
                                    {item?.related_projectitems?.arrayValue?.values?.map(
                                      (item: any, i_: any) => {
                                        const __item = getProjects?.find(
                                          (pro: any) =>
                                            pro?._id == item?.stringValue
                                        );
                                        return (
                                          <div key={i_}>
                                            {i_ + 1}. {__item?.title} (
                                            <Link
                                              to={"#"}
                                              className="text-primary"
                                              style={{ textDecoration: "none" }}
                                              data-bs-toggle="modal"
                                              data-bs-target={
                                                "#" + __item?._id + "Modal"
                                              }
                                            >
                                              Open
                                            </Link>
                                            )
                                            <div
                                              className="modal fade"
                                              id={__item?._id + "Modal"}
                                              tabIndex={-1}
                                              aria-labelledby={
                                                __item?._id + "ModalLabel"
                                              }
                                              aria-hidden="true"
                                              data-bs-backdrop="static"
                                              data-bs-keyboard="false"
                                            >
                                              <div className="modal-dialog modal-xl">
                                                <div className="modal-content rounded-0 border-none">
                                                  <div className="modal-header">
                                                    <h5
                                                      className="modal-title"
                                                      id={
                                                        __item?._id +
                                                        "ModalLabel"
                                                      }
                                                    >
                                                      {__item?.title}({" "}
                                                      <Link
                                                        className="btn-primary"
                                                        style={{
                                                          textDecoration:
                                                            "none",
                                                        }}
                                                        to={__item?.pdfLink}
                                                        target="_blank"
                                                      >
                                                        PDF Link
                                                      </Link>{" "}
                                                      |{" "}
                                                      <Link
                                                        to={__item?.pptLink}
                                                        target="_blank"
                                                        className="btn-primary"
                                                        style={{
                                                          textDecoration:
                                                            "none",
                                                        }}
                                                      >
                                                        PPT Link
                                                      </Link>
                                                      |{" "}
                                                      <Link
                                                        to={__item?.githubLink}
                                                        target="_blank"
                                                        className="btn-primary"
                                                        style={{
                                                          textDecoration:
                                                            "none",
                                                        }}
                                                      >
                                                        Github Link
                                                      </Link>
                                                      )
                                                    </h5>
                                                    <button
                                                      type="button"
                                                      className="btn-close"
                                                      data-bs-dismiss="modal"
                                                      aria-label="Close"
                                                    />
                                                  </div>
                                                  <div className="modal-body">
                                                    <>
                                                      <p>
                                                        {__item?.description}
                                                      </p>
                                                      <div className="p-3">
                                                        <img
                                                          className="w-100"
                                                          src={
                                                            __item?.bannerURL
                                                          }
                                                          alt="Banner Image"
                                                        />
                                                      </div>
                                                    </>
                                                  </div>
                                                  <div className="modal-footer">
                                                    <button
                                                      type="button"
                                                      className="btn btn-outline-danger"
                                                      data-bs-dismiss="modal"
                                                    >
                                                      Close
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <h3 className="fw-bold mb-2 mt-5 text-shade2 px-lg-0 px-3 ">
          Ph.D. Students
          <hr />
        </h3>
        <div className="d-flex justify-content-start  gap-3 align-items-start mb-4 flex-wrap overflow-auto px-lg-0 px-3 ">
          {getphd?.map((item: any, index: number) => {
            const { name, batch, isAlumni, email, mobile } = item?.data;
            if (isAlumni?.booleanValue) {
              return null;
            }
            return (
              <div
                className="card text-center p-1"
                key={index}
                style={{ width: "300px" }}
              >
                <div className="p-2">
                  <img
                    src={item?.profileImage}
                    alt="Profile Image"
                    style={{
                      height: "150px",
                      width: "150px",
                      borderRadius: "50%",
                      border: "5px solid var(--secondary-light)",
                    }}
                  />
                </div>
                <div className="p-2">
                  <h3>{name?.stringValue}</h3>
                  <hr />
                  <small>
                    Email: {email?.stringValue || "N/A"}
                    <br />
                    Batch: {batch?.stringValue || "N/A"}
                    <br />
                    Mobile: {mobile?.stringValue}
                  </small>
                  <br />
                  <button
                    className="btn btn-shade1 mt-3 btn-sm"
                    onClick={() => window.open("#/phd/" + item._id, "_blank")}
                  >
                    Detailed Profile <i className="bx bx-link-external"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <h3 className="fw-bold mb-2 mt-5 text-shade2 px-lg-0 px-3 ">
          Ph.D. Alumni Students
          <hr />
        </h3>
        <div className="d-flex justify-content-start  gap-3 align-items-start mb-4 flex-wrap  overflow-auto px-lg-0 px-3 ">
          {getphd?.map((item: any, index: number) => {
            const { name, batch, isAlumni, email, mobile } = item?.data;
            if (!isAlumni?.booleanValue) {
              return null;
            }
            return (
              <div
                className="card text-center p-1"
                key={index}
                style={{ width: "300px" }}
              >
                <div className="p-2">
                  <img
                    src={item?.profileImage}
                    alt="Profile Image"
                    style={{
                      height: "150px",
                      width: "150px",
                      borderRadius: "50%",
                      border: "5px solid var(--secondary-light)",
                    }}
                  />
                </div>
                <strong className="mt-2 d-inline">
                  <h3>{name?.stringValue}</h3>
                  <hr />
                  <small>
                    Email: {email?.stringValue || "N/A"}
                    <br />
                    Batch: {batch?.stringValue || "N/A"}
                    <br />
                    Mobile: {mobile?.stringValue}
                  </small>
                  <br />
                  <button
                    className="btn btn-shade1 mt-3 btn-sm"
                    onClick={() => window.open("#/phd/" + item._id, "_blank")}
                  >
                    Detailed Profile <i className="bx bx-link-external"></i>
                  </button>
                </strong>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DetailProfile;
