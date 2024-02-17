import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchDatasets } from "../../../services/firebase/getdatasets";
import { fetchProjectsItems } from "../../../services/firebase/getprojectitems";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../firebase";
import {
  deleteProjectsMain,
  fetchProjectsMain,
} from "../../../services/firebase/getprojects.main";
import { Link } from "react-router-dom";

interface ProjectInterface {
  title: string;
  funding_agency: string;
  pis: string;
  copis: string;
  jrf_phd_scholar: string;
  description: string;
  type: string;
  total_fund: string;
  related_datasets: string[];
  related_projectitems: string[];
}

const initalValue: ProjectInterface = {
  title: "",
  description: "",
  funding_agency: "",
  pis: "",
  copis: "",
  jrf_phd_scholar: "",
  related_datasets: [],
  related_projectitems: [],
  total_fund: "",
  type: "",
};

const ProjectsMain: any = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const getProjects = useSelector((state: any) => state.getprojectitems?.data);
  const getdatasets = useSelector((state: any) => state.getdatasets?.data);
  const getProjectsMain = useSelector(
    (state: any) => state.getprojectsmain?.data
  );
  const [data, setData] = useState<ProjectInterface>(initalValue);
  useEffect(() => {
    fetchDatasets();
    fetchProjectsItems();
    fetchProjectsMain();
  }, []);
  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !data.title ||
      !data.description ||
      !data.type ||
      !data.copis ||
      !data.total_fund ||
      !data.funding_agency ||
      !data.pis ||
      !data.jrf_phd_scholar
    ) {
      alert("Please fill out all fields.");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "projects_main"), {
        ...data,
      });
      alert("Project has been saved!");
      setData(initalValue);
      setLoading(false);
      window.location.reload();
    } catch {
      alert("Something went wrong!");
    }
  };

  return (
    <>
      <div className="col-sm-12 col-md-10 col-lg-10 col-xl-10 px-5">
        <div className="w-100 d-flex justify-content-between">
          <h3>Projects</h3>
          <button
            className="btn btn-dark btn-sm rounded-0"
            data-bs-toggle="modal"
            data-bs-target="#addSliderModal"
          >
            + Add New
          </button>
        </div>
        <hr />
        <div className="overflow-auto mt-3" style={{ height: "500px" }}>
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                >
                  Sr. No.
                </th>
                <th
                  scope="col"
                  className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                >
                  Details
                </th>
                <th
                  scope="col"
                  className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                >
                  Related Projects Items
                </th>{" "}
                <th
                  scope="col"
                  className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                >
                  Related Datasets
                </th>
                <th
                  scope="col"
                  className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                >
                  Related Projects
                </th>
                <th
                  scope="col"
                  className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                  style={{ zIndex: "999" }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {getProjectsMain?.map((item: any, index: any) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td className="fw-bold text-danger">
                      {item?.title?.stringValue}
                    </td>
                    <td>
                      <div className="row px-2">
                        <strong>PIs:</strong> <p>{item?.pis?.stringValue}</p>
                      </div>
                      <div className="row px-2">
                        <strong>Co-PIs:</strong>{" "}
                        <p>{item?.copis?.stringValue}</p>
                      </div>
                      <div className="row px-2">
                        <strong>Funding Agency:</strong>{" "}
                        <p>{item?.funding_agency?.stringValue}</p>
                      </div>
                      <div className="row px-2">
                        <strong>Total Fund(Inr):</strong>{" "}
                        <p>Rs. {item?.total_fund?.stringValue}</p>
                      </div>
                      <div className="row px-2">
                        <strong>Ph.D./JRF Students:</strong>{" "}
                        <p>{item?.jrf_phd_scholar?.stringValue}</p>
                      </div>
                    </td>
                    <td>
                      <p
                        className="overflow-auto"
                        style={{ height: "500px", width: "200px" }}
                      >
                        {item?.description?.stringValue}
                      </p>
                    </td>
                    <td>
                      <div className="d-flex flex-column flex-wrap">
                        {item?.related_datasets?.arrayValue?.values?.map(
                          (item: any, i_: any) => {
                            const __item = getdatasets?.find(
                              (pro: any) => pro?._id == item?.stringValue
                            );
                            return (
                              <div>
                                {i_ + 1}. {__item?.title} (
                                <Link
                                  to={"#"}
                                  className="text-primary"
                                  style={{ textDecoration: "none" }}
                                  data-bs-toggle="modal"
                                  data-bs-target={"#" + __item?._id + "Modal"}
                                >
                                  Open
                                </Link>
                                )
                                <div
                                  className="modal fade"
                                  id={__item?._id + "Modal"}
                                  tabIndex={-1}
                                  aria-labelledby={__item?._id + "ModalLabel"}
                                  aria-hidden="true"
                                  data-bs-backdrop="static"
                                  data-bs-keyboard="false"
                                >
                                  <div className="modal-dialog modal-xl">
                                    <div className="modal-content rounded-0 border-none">
                                      <div className="modal-header">
                                        <h5
                                          className="modal-title"
                                          id={__item?._id + "ModalLabel"}
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
                                            <p>{__item?.description}</p>
                                            <img
                                              className="w-100"
                                              src={__item?.bannerURL}
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
                    </td>
                    <td>
                      <div className="d-flex flex-column flex-wrap">
                        {item?.related_projectitems?.arrayValue?.values?.map(
                          (item: any, i_: any) => {
                            const __item = getProjects?.find(
                              (pro: any) => pro?._id == item?.stringValue
                            );
                            return (
                              <div>
                                {i_ + 1}. {__item?.title} (
                                <Link
                                  to={"#"}
                                  className="text-primary"
                                  style={{ textDecoration: "none" }}
                                  data-bs-toggle="modal"
                                  data-bs-target={"#" + __item?._id + "Modal"}
                                >
                                  Open
                                </Link>
                                )
                                <div
                                  className="modal fade"
                                  id={__item?._id + "Modal"}
                                  tabIndex={-1}
                                  aria-labelledby={__item?._id + "ModalLabel"}
                                  aria-hidden="true"
                                  data-bs-backdrop="static"
                                  data-bs-keyboard="false"
                                >
                                  <div className="modal-dialog modal-xl">
                                    <div className="modal-content rounded-0 border-none">
                                      <div className="modal-header">
                                        <h5
                                          className="modal-title"
                                          id={__item?._id + "ModalLabel"}
                                        >
                                          {__item?.title}({" "}
                                          <Link
                                            className="btn-primary"
                                            style={{
                                              textDecoration: "none",
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
                                              textDecoration: "none",
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
                                              src={__item?.bannerURL}
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
                    </td>
                    <td>
                      <div className="dropdown">
                        <button
                          className="btn btn-secondary dropdown-toggle btn-sm"
                          type="button"
                          id="dropdownMenuButton1"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          Action
                        </button>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuButton1"
                        >
                          <li>
                            <button
                              className="dropdown-item text-danger"
                              onClick={() => deleteProjectsMain(item._id)}
                            >
                              Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!getProjectsMain.length && (
            <>
              <div className="w-100 text-center">
                <h3 className="fw-bold text-danger">Not Found!</h3>
              </div>
            </>
          )}
        </div>
      </div>
      <div
        className="modal fade"
        id="addSliderModal"
        tabIndex={-1}
        aria-labelledby={`addSliderModalLabel`}
        aria-hidden="true"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content rounded-0 border-none">
            <div className="modal-header">
              <h5 className="modal-title" id={`addSliderModalLabel`}>
                Add Project
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
                <div className="mb-2">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    aria-describedby="title"
                    placeholder="ie. Timestamp aware Aberrant Detection and Analysis in Big Visual Data using Deep Learning Architecture"
                    onChange={handleChange}
                    value={data.title}
                    disabled={loading}
                  />
                </div>
                <div className="mb-2 row">
                  <div className="col">
                    {" "}
                    <label htmlFor="funding_agency" className="form-label">
                      Funding Agency
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="funding_agency"
                      aria-describedby="funding_agency"
                      placeholder="ie. Science and Engineering Research Board, Department of Science and Technology (SERB-DST, 2018)"
                      onChange={handleChange}
                      value={data.funding_agency}
                      disabled={loading}
                    />
                  </div>
                  <div className="col">
                    <div className="mb-2">
                      <label htmlFor="total_fund" className="form-label">
                        Total Fund (Inr.)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="total_fund"
                        aria-describedby="total_fund"
                        placeholder="ie. 4500000"
                        onChange={handleChange}
                        value={data.total_fund}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-2 row">
                  <div className="col">
                    <label htmlFor="investigator" className="form-label">
                      Project Investigators (PIs)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="pis"
                      aria-describedby="pis"
                      placeholder="ie. Dr. X, Dr. Y, etc"
                      onChange={handleChange}
                      value={data.pis}
                      disabled={loading}
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="investigator" className="form-label">
                      Co-Project Investigators (Co-PIs)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="copis"
                      aria-describedby="copis"
                      placeholder="ie. Dr. X, Dr. Y, etc"
                      onChange={handleChange}
                      value={data.copis}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="mb-2 row">
                  <div className="col">
                    <label htmlFor="jrf_phd_scholar" className="form-label">
                      JRF/Ph.D. Scholars (comma separated)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="jrf_phd_scholar"
                      aria-describedby="jrf_phd_scholar"
                      placeholder="Type Here.."
                      onChange={handleChange}
                      value={data.jrf_phd_scholar}
                      disabled={loading}
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="type" className="form-label">
                      Type of Project
                    </label>
                    <select
                      className="form-control"
                      id="type"
                      aria-describedby="type"
                      onChange={handleChange}
                      value={data.type}
                      disabled={loading}
                    >
                      <option value="">--select type--</option>
                      <option value="consultancy">Consultancy</option>
                      <option value="sponsored">Sponsored</option>
                    </select>
                  </div>
                </div>
                <div className="mb-2">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    rows={5}
                    onChange={handleChange}
                    value={data.description}
                    placeholder="describe project in 50 to 200 words.."
                    disabled={loading}
                  ></textarea>
                </div>
                <div className="mb-2 row">
                  <div className="col">
                    <label htmlFor="type" className="form-label">
                      Add Related Datasets
                    </label>
                    <select
                      className="form-control"
                      id="related_datasets"
                      aria-describedby="related_datasets"
                      onChange={(e) => {
                        const valueToAdd = e.target.value;
                        if (valueToAdd === "") return;
                        if (!data.related_datasets.includes(valueToAdd)) {
                          setData((prevData) => ({
                            ...prevData,
                            related_datasets: [
                              ...prevData.related_datasets,
                              valueToAdd,
                            ],
                          }));
                        }
                      }}
                      value={data.type}
                      disabled={loading}
                    >
                      <option value="">--select--</option>
                      {getdatasets?.map((item_: any, i_: any) => {
                        return (
                          <option key={i_} value={item_?._id}>
                            {item_?.title}
                          </option>
                        );
                      })}
                    </select>
                    <table className="table table-bordered table-hover my-3">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                          >
                            Sr. No.
                          </th>
                          <th
                            scope="col"
                            className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                          >
                            Project Title
                          </th>
                          <th
                            scope="col"
                            className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.related_datasets?.map((item: any, i_: any) => {
                          const __item = getdatasets?.find(
                            (pro: any) => pro?._id == item
                          );
                          return (
                            <tr>
                              <th>{i_ + 1}</th>
                              <th>{__item?.title}</th>
                              <th>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => {
                                    if (
                                      confirm("Are you sure want to remove?")
                                    ) {
                                      setData((prevData) => ({
                                        ...prevData,
                                        related_datasets:
                                          data?.related_datasets?.filter(
                                            (i__) => i__ !== item
                                          ),
                                      }));
                                    }
                                  }}
                                >
                                  Remove
                                </button>
                              </th>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {!data.related_datasets?.length && (
                      <>
                        <div className="w-100 text-center">
                          <h5 className="text-danger">Nothing Added Yet!</h5>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="col">
                    <label htmlFor="type" className="form-label">
                      Add Related Project Items
                    </label>
                    <select
                      className="form-control"
                      id="type"
                      aria-describedby="type"
                      onChange={(e) => {
                        const valueToAdd = e.target.value;
                        if (valueToAdd === "") return;
                        if (!data.related_projectitems.includes(valueToAdd)) {
                          setData((prevData) => ({
                            ...prevData,
                            related_projectitems: [
                              ...prevData.related_projectitems,
                              valueToAdd,
                            ],
                          }));
                        }
                      }}
                      disabled={loading}
                    >
                      <option value="">--select--</option>
                      {getProjects?.map((item_: any, i_: any) => {
                        return (
                          <option key={i_} value={item_?._id}>
                            {item_?.title}
                          </option>
                        );
                      })}
                    </select>
                    <table className="table table-bordered table-hover my-3">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                          >
                            Sr. No.
                          </th>
                          <th
                            scope="col"
                            className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                          >
                            Project Title
                          </th>
                          <th
                            scope="col"
                            className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.related_projectitems?.map(
                          (item: any, i_: any) => {
                            const __item = getProjects?.find(
                              (pro: any) => pro?._id == item
                            );
                            return (
                              <tr>
                                <th>{i_ + 1}</th>
                                <th>{__item?.title}</th>
                                <th>
                                  <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => {
                                      if (
                                        confirm("Are you sure want to remove?")
                                      ) {
                                        setData((prevData) => ({
                                          ...prevData,
                                          related_projectitems:
                                            data?.related_projectitems?.filter(
                                              (i__) => i__ !== item
                                            ),
                                        }));
                                      }
                                    }}
                                  >
                                    Remove
                                  </button>
                                </th>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                    {!data.related_projectitems?.length && (
                      <>
                        <div className="w-100 text-center">
                          <h5 className="text-danger">Nothing Added Yet!</h5>
                        </div>
                      </>
                    )}
                  </div>
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
              <button
                type="button"
                className="btn btn-success"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-1"
                      role="status"
                      aria-hidden="true"
                    />
                    Please Wait..
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectsMain;
