import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../../../firebase";
import { useSelector } from "react-redux";
import {
  deleteSubAreas,
  fetchSubAreas,
} from "../../../services/firebase/getsubareas";
import { fetchResearchArea } from "../../../services/firebase/getresearcharea";
import { fetchProjectsItems } from "../../../services/firebase/getprojectitems";

const ResearchSubArea: React.FC = () => {
  const { id } = useParams();
  useEffect(() => {
    fetchSubAreas();
    fetchResearchArea();
    fetchProjectsItems();
  }, []);

  const getResearchArea = useSelector(
    (state: any) => state.getresearcharea?.data
  );
  const research_item = getResearchArea.find((v: any) => v._id === id);
  if (!research_item) {
    window.location.href = "/dashboard/research";
  }
  const getsubareas1 = useSelector((state: any) => state.getsubareas).data;
  const subareasArray = research_item?.subareas || [];
  const getsubareas = getsubareas1?.filter((item: any) =>
    subareasArray.some((subarea: any) => subarea.stringValue === item?._id)
  );

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [projects, setProjects] = useState<string[]>([]);
  const getProjects = useSelector((state: any) => state.getprojectitems?.data);

  const handleSubmit = async () => {
    if (!title) {
      alert("Please select an image and provide a title!");
      return;
    }

    setLoading(true);
    try {
      const newItemRef = await addDoc(collection(db, "research_subitems"), {
        title: title,
        researcharea: research_item._id,
        description: description,
        projects: projects,
      });
      const newItemId = newItemRef.id;
      await updateDoc(doc(db, "ResearchArea", research_item._id), {
        subareas: arrayUnion(newItemId),
      });

      alert("Subitem has been saved!");
      setTitle("");
      setDescription("");
      setProjects([]);
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
          <h3 className="fw-bold text-danger">{research_item?.title}</h3>
          <button
            className="btn btn-dark btn-sm rounded-0"
            data-bs-toggle="modal"
            data-bs-target="#addSliderModal"
          >
            + Add New
          </button>
        </div>
        <hr />
        <div className="w-100 my-2">
          <img src={research_item?.bannerURL} alt="Banner Image" />
        </div>
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
                  Description
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
              {getsubareas?.map((item: any, index: any) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item?.title}</td>
                    <td>{item?.description}</td>
                    <td>
                      <div className="d-flex flex-column flex-wrap">
                        {item?.projects?.map((item: any, i_: any) => {
                          const __item = getProjects?.find(
                            (pro: any) => pro?._id == item?.stringValue
                          );
                          return (
                            <div>
                              {i_ + 1}. {__item?.title} (
                              <Link
                                to={"/dashboard/projects-items"}
                                className="text-primary"
                                style={{ textDecoration: "none" }}
                              >
                                Open
                              </Link>
                              )
                            </div>
                          );
                        })}
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
                              onClick={() =>
                                deleteSubAreas(item._id, research_item?._id)
                              }
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
          {!getsubareas.length && (
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
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content rounded-0 border-none">
            <div className="modal-header">
              <h5 className="modal-title" id={`addSliderModalLabel`}>
                Add Sub Item
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
                    placeholder="Type Here.."
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={loading}
                    value={title}
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="date" className="form-label">
                    Description
                  </label>
                  <textarea
                    rows={5}
                    className="form-control"
                    id="banner_image"
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={loading}
                    placeholder="describe in some words.."
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="date" className="form-label">
                    Add Related Project (Optional)
                  </label>
                  <select
                    name="project"
                    className="form-control"
                    onChange={(e) => {
                      const valueToAdd = e.target.value;
                      if (valueToAdd === "") return;
                      if (!projects.includes(valueToAdd)) {
                        setProjects([...projects, valueToAdd]);
                      }
                    }}
                  >
                    <option value="">--select project--</option>
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
                      {projects?.map((item: any, i_: any) => {
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
                                    setProjects(
                                      projects.filter((i__) => i__ !== item)
                                    );
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
                  {!projects.length && (
                    <>
                      <div className="w-100 text-center">
                        <h5 className="text-danger">Nothing Added Yet!</h5>
                      </div>
                    </>
                  )}
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

export default ResearchSubArea;
