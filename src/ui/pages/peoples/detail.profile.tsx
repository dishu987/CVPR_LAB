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

const DetailProfile: React.FC = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const getsupervisors = useSelector((state: any) => state.getsupervisors.data);
  const supervisor_ = getsupervisors.filter((item_: any) => item_._id == id)[0];
  const getpublications = useSelector(
    (state: any) => state.getpublications.data
  );
  const getprojectsimages = useSelector(
    (state: any) => state.getprojectsimages?.data
  );
  const getProjects = useSelector((state: any) => state.getprojectitems?.data);
  const getdatasets = useSelector((state: any) => state.getdatasets?.data);
  const getProjectsMain = useSelector(
    (state: any) => state.getprojectsmain?.data
  );
  const getphd = useSelector((state: any) => state.getphdStudents.data);
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
    };
    fetchData();
  }, []);
  if (loading) {
    return (
      <div
        className="d-flex w-100 justify-content-center align-items-center flex-column flex-wrap"
        style={{ height: "100vh" }}
      >
        <h1 className="fw-bold text-danger">Vision Intelligence Lab</h1>
        <h4>Please Wait..</h4>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {supervisor_?.data?.name?.stringValue} |{" "}
          {import.meta.env.VITE_APP_TITLE}
        </title>
      </Helmet>
      <div className="container my-5 ">
        <h1 className="fw-bold mb-3 text-danger text-center text-lg-start">
          {supervisor_?.data?.name?.stringValue}
          <hr />
        </h1>
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
              <p className="text-muted">
                <div className="my-3">
                  <div>
                    <strong>Email:</strong>{" "}
                    {supervisor_?.data?.email?.stringValue}
                  </div>
                  <div>
                    <strong>Mobile:</strong> +91-
                    {supervisor_?.data?.phone?.stringValue}
                  </div>
                </div>
                <a
                  style={{ textDecoration: "none" }}
                  href={supervisor_?.data?.googleScholarLink.stringValue}
                  target="_blank"
                >
                  Google Scholar <i className="bx bx-link-external"></i>
                </a>{" "}
                |{" "}
                <a
                  style={{ textDecoration: "none" }}
                  href={supervisor_?.data?.researchGateLink?.stringValue}
                  target="_blank"
                >
                  Researchgate <i className="bx bx-link-external"></i>
                </a>{" "}
                |{" "}
                <a
                  style={{ textDecoration: "none" }}
                  href={supervisor_?.data?.personalProfileLink?.stringValue}
                  target="_blank"
                >
                  Personal Profile <i className="bx bx-link-external"></i>
                </a>{" "}
                |{" "}
                <a
                  style={{ textDecoration: "none" }}
                  href={supervisor_?.data?.otherLink?.stringValue}
                  target="_blank"
                >
                  Other <i className="bx bx-link-external"></i>
                </a>
              </p>
              <hr />
              <h5>Research Interests</h5>
              <ul className="">
                {supervisor_?.data?.researchInterests?.stringValue
                  ?.split(",")
                  .map((item: any, key_: any) => {
                    return (
                      <li key={key_} className="mx-3">
                        {item}
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
          <div className="col-sm-12 px-lg-0 px-3 ">
            <h3 className="fw-bold">Introduction</h3>
            <hr />
            <p>{supervisor_?.data?.introduction?.stringValue}</p>
          </div>
        </div>
        <div className="card p-3 mb-4">
          <div className="col-sm-12 d-flex justify-content-between px-lg-0 flex-row flex-wrap">
            <h3 className="fw-bold w-100 mb-3">Publications</h3>
            <hr />
            <div className="overflow-hidden">
              <ul
                style={{
                  height: "fit-content",
                  overflow: "hidden",
                }}
              >
                {getpublications?.map((item: any, index: any) => {
                  const {
                    paperTitle,
                    author,
                    impact,
                    link,
                    pages,
                    publisher,
                    publicationDate,
                    volume,
                    journalName,
                    paperType,
                    isbn,
                    users,
                  } = item?.data;
                  const isContain = users?.arrayValue?.values?.filter(
                    (item_: any) =>
                      item_.stringValue == supervisor_?.data?.name?.stringValue
                  )[0];
                  if (!isContain) return;
                  return (
                    <li key={index}>
                      <span>
                        <cite>
                          <span className="author">{author?.stringValue},</span>
                          <a
                            href={`https://doi.org/${link.stringValue}`}
                            target="_blank"
                            style={{ textDecoration: "none" }}
                          >
                            <strong
                              className="title text-dark"
                              style={{ display: "inline" }}
                            >
                              "{paperTitle.stringValue}",
                            </strong>
                            <i className="fa-solid fa-aritem-up-right-from-square"></i>
                          </a>
                          <span
                            className="journal"
                            style={{ display: "inline" }}
                          >
                            <i>{journalName.stringValue}</i>,
                          </span>
                          <span
                            className="volume"
                            style={{ display: "inline" }}
                          >
                            {volume.stringValue},{" "}
                          </span>
                          <span className="pages" style={{ display: "inline" }}>
                            {pages.stringValue},{" "}
                          </span>
                          <span className="date" style={{ display: "inline" }}>
                            {publicationDate.stringValue}-
                            {paperType.stringValue}-{isbn.stringValue}-
                            {publisher.stringValue}-{impact.stringValue}
                          </span>
                        </cite>
                      </span>
                      <hr />
                    </li>
                  );
                })}
              </ul>
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
                          <strong className="text-danger">{index + 1}. </strong>
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
                                          <strong className="text-danger">
                                            1.{" "}
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
                                          <strong className="text-danger">
                                            2.{" "}
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
                                          <strong className="text-danger">
                                            3.{" "}
                                          </strong>
                                          Project Investigators
                                        </h6>
                                      </td>
                                      <td>{item?.pis?.stringValue}</td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <h6 className="fw-bold mt-2">
                                          <strong className="text-danger">
                                            4.{" "}
                                          </strong>
                                          Co-Project Investigators
                                        </h6>
                                      </td>
                                      <td>{item?.copis?.stringValue}</td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <h6 className="fw-bold mt-2">
                                          <strong className="text-danger">
                                            5.{" "}
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
                                <h4 className="fw-bold text-danger mt-2">
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
                                    {getprojectsimages
                                      ?.filter(
                                        (v_: any) => v_?.project == item?._id
                                      )
                                      ?.map((__item: any, i_: any) => {
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
                                                    <>
                                                      <div className="">
                                                        <p>
                                                          {__item?.description}
                                                        </p>
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
                                      })}
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
                                                      <img
                                                        className="w-100"
                                                        src={__item?.bannerURL}
                                                        alt="Banner Image"
                                                      />
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
        <h3 className="fw-bold mb-2 mt-5 text-danger px-lg-0 px-3 ">
          Ph.D. Students
          <hr />
        </h3>
        <div className="d-flex justify-content-start  gap-3 align-items-start mb-4 flex-wrap overflow-auto px-lg-0 px-3 ">
          {getphd?.map((item: any, index: number) => {
            const { name, batch, isAlumni, email, mobile, researchInterests } =
              item?.data;
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
                      borderRadius: "50%",
                      border: "5px solid var(--bs-danger)",
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
                  <strong className="mt-2 d-inline">
                    <div className="d-flex flex-nowrap justify-content-center">
                      Research Interests:
                    </div>
                    {researchInterests?.arrayValue?.values?.map(
                      (ri: any, index: number) => {
                        return (
                          <small
                            key={index}
                            className="bg-secondary mx-1 rounded-2 px-1 text-white"
                            style={{ textWrap: "nowrap", fontSize: "0.8rem" }}
                          >
                            {ri.stringValue}
                          </small>
                        );
                      }
                    )}
                  </strong>
                </div>
              </div>
            );
          })}
        </div>
        <h3 className="fw-bold mb-2 mt-5 text-danger px-lg-0 px-3 ">
          Ph.D. Alumni Students
          <hr />
        </h3>
        <div className="d-flex justify-content-start  gap-3 align-items-start mb-4 flex-wrap  overflow-auto px-lg-0 px-3 ">
          {getphd?.map((item: any, index: number) => {
            const { name, batch, isAlumni, email, mobile, researchInterests } =
              item?.data;
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
                      borderRadius: "50%",
                      border: "5px solid var(--bs-danger)",
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
                  <div className="d-flex flex-nowrap justify-content-center">
                    Research Interests:
                  </div>
                  {researchInterests?.arrayValue?.values?.map(
                    (ri: any, index: number) => {
                      return (
                        <small
                          key={index}
                          className="bg-secondary mx-1 rounded-2 px-1 text-white"
                          style={{ textWrap: "nowrap", fontSize: "0.8rem" }}
                        >
                          {ri.stringValue}
                        </small>
                      );
                    }
                  )}
                </strong>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default DetailProfile;
