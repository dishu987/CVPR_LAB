import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchDatasets } from "../../../services/firebase/getdatasets";
import { fetchProjectsItems } from "../../../services/firebase/getprojectitems";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { fetchProjectsMain } from "../../../services/firebase/getprojects.main";
import { useParams } from "react-router-dom";

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

const ProjectsMainEdit: any = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const getProjects = useSelector((state: any) => state.getprojectitems?.data);
  const getdatasets = useSelector((state: any) => state.getdatasets?.data);
  const getsupervisors = useSelector((state: any) => state.getsupervisors.data);
  const getProjectsMain = useSelector(
    (state: any) => state.getprojectsmain?.data
  );
  const project_ = getProjectsMain?.filter((item_: any) => item_?._id == id)[0];
  const related_datasets_: string[] = [];
  project_?.related_datasets?.arrayValue?.values?.map((item_: any) => {
    related_datasets_?.push(item_.stringValue);
  });
  const related_projectitems_: string[] = [];
  project_?.related_projectitems?.arrayValue?.values?.map((item_: any) => {
    related_projectitems_?.push(item_.stringValue);
  });
  const [data, setData] = useState<ProjectInterface>({
    title: project_?.title?.stringValue,
    description: project_?.description?.stringValue,
    funding_agency: project_?.description?.stringValue,
    pis: project_?.pis?.stringValue,
    copis: project_?.copis?.stringValue,
    jrf_phd_scholar: project_?.jrf_phd_scholar?.stringValue,
    related_datasets: related_datasets_,
    related_projectitems: related_projectitems_,
    total_fund: project_?.total_fund?.stringValue,
    type: project_?.type?.stringValue,
  });
  const users_: string[] = [];
  project_?.users?.arrayValue?.values?.map((item_: any) => {
    users_?.push(item_.stringValue);
  });
  const [selectedUsers, setselectedUsers] = useState<string[]>(users_);
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
      !data.jrf_phd_scholar ||
      !selectedUsers
    ) {
      alert("Please fill out all fields.");
      return;
    }
    setLoading(true);
    try {
      const docRef = doc(db, "projects_main", project_?._id);
      await updateDoc(docRef, { ...data, users: selectedUsers });
      alert("Project has been saved!");
      setData(initalValue);
      setLoading(false);
      window.location.href = "/dashboard/projects";
    } catch {
      alert("Something went wrong!");
    }
  };

  return (
    <>
      <div className="col-sm-12 col-md-10 col-lg-10 col-xl-10 px-5">
        <div className="w-100 d-flex justify-content-between">
          <h3 className="fw-bold text-primary">Edit Project</h3>
          <button
            className="btn btn-danger btn-sm rounded-0"
            onClick={() => window.history.back()}
          >
            Back to Projects
          </button>
        </div>
        <hr />
        <div className="card p-3">
          <>
            <div className="col mb-2">
              <label htmlFor="useremail" className="form-label">
                Supervisor Email
                <span className="text-danger">
                  *(these projects will be shown for selected supervisors)
                </span>
              </label>
              <select
                name="userEmail"
                className="form-control"
                onChange={(e) => {
                  const selectedUser = e.target.value;
                  if (!selectedUsers || selectedUser === "") return;

                  if (!selectedUsers.includes(selectedUser)) {
                    setselectedUsers([...selectedUsers, selectedUser]);
                  } else {
                    alert("User with this name already existed.");
                  }
                }}
              >
                <option value="">--select user--</option>
                {getsupervisors?.map((item: any, index: number) => {
                  return (
                    <option value={item?.data?.name?.stringValue} key={index}>
                      {item?.data?.name?.stringValue}-
                      {item?.data?.email?.stringValue}
                    </option>
                  );
                })}
              </select>
              <div className="d-flex flex-wrap mt-2 gap-2 w-100">
                {selectedUsers?.map((item: string, index: number) => {
                  return (
                    <span className="badge bg-success" key={index}>
                      {item}{" "}
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          if (confirm("Are you sure want to remove?")) {
                            const tempArr = selectedUsers.filter(
                              (email) => email !== item
                            );
                            setselectedUsers(tempArr);
                          }
                        }}
                      >
                        <i className="ms-2 bx bxs-trash-alt"></i>
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>
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
                disabled
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
                rows={8}
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
                                if (confirm("Are you sure want to remove?")) {
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
                    {data.related_projectitems?.map((item: any, i_: any) => {
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
                                if (confirm("Are you sure want to remove?")) {
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
                    })}
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
              <div className="p-3 mt-4  col-sm-12">
                <button
                  type="button"
                  className="btn btn-dark p-3 w-100"
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
          </>
        </div>
      </div>
    </>
  );
};

export default ProjectsMainEdit;
