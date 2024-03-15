import { addDoc, collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../../../firebase";
import { useSelector } from "react-redux";
import { addAlert } from "../../components/alert/push.alert";
import { storage } from "../../../firebase";
import { ref, uploadBytes } from "firebase/storage";
import {
  deleteProjectsImages,
  fetchProjectsImages,
} from "../../../services/firebase/getprojectimages";

const ProjectImages: React.FC = () => {
  const { id } = useParams();
  const getProjectsMain = useSelector(
    (state: any) => state.getprojectsmain?.data
  );
  const getprojectsimages = useSelector(
    (state: any) => state.getprojectsimages?.data
  );
  const project_ = getProjectsMain.find((v: any) => v._id === id);
  const projectimages_ = getprojectsimages.filter(
    (v: any) => v?.project === id
  );
  if (!project_) {
    history.back();
    return;
  }
  const [image, setImage] = useState<any>(null);
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    fetchProjectsImages();
  }, []);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!image || !title) {
      addAlert("danger", "Please select an image and provide a title!");
      return;
    }
    setLoading(true);
    const storageRef = ref(storage, `project_main_images/${id + title}`);
    const blob = await fetch(image).then((res) => res.blob());
    try {
      await uploadBytes(storageRef, blob);
      await addDoc(collection(db, "project_main_images"), {
        title: title,
        project: id,
      });
      addAlert("success", "Image with title has been saved!");
      setTitle("");
      setImage(null);
      setLoading(false);
      location.reload();
    } catch (error) {
      addAlert("danger", "Error uploading image, Try Again!");
      setTitle("");
      setImage(null);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="col-sm-12 col-md-10 col-lg-10 col-xl-10 px-5">
        <div className="w-100 d-flex justify-content-between">
          <h3 className="fw-bold text-danger">
            {project_?.title?.stringValue}
          </h3>
        </div>
        <hr />
        <div className="d-flex flex-nowrap gap-2 mb-3">
          <button
            className="btn btn-dark"
            data-bs-toggle="modal"
            data-bs-target="#addSliderModal"
          >
            + Add Image
          </button>
          <button
            className="btn btn-info"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseExample"
            aria-expanded="false"
            aria-controls="collapseExample"
          >
            Project Details (Click)
          </button>
        </div>
        <div className="collapse" id="collapseExample">
          <div className="col-md-12 col-lg-12  col-sm-12  w-100 overflow-auto">
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td>
                    <h6 className="fw-bold mt-2">
                      <strong className="text-danger">1. </strong>
                      Funding Agency
                    </h6>
                  </td>
                  <td>{project_?.funding_agency?.stringValue}</td>
                </tr>
                <tr>
                  <td>
                    <h6 className="fw-bold mt-2">
                      <strong className="text-danger">2. </strong>
                      Total Fund
                    </h6>
                  </td>
                  <td>Rs. {project_?.total_fund?.stringValue}</td>
                </tr>
                <tr>
                  <td>
                    <h6 className="fw-bold mt-2">
                      <strong className="text-danger">3. </strong>
                      Project Investigators
                    </h6>
                  </td>
                  <td>{project_?.pis?.stringValue}</td>
                </tr>
                <tr>
                  <td>
                    <h6 className="fw-bold mt-2">
                      <strong className="text-danger">4. </strong>
                      Co-Project Investigators
                    </h6>
                  </td>
                  <td>{project_?.copis?.stringValue}</td>
                </tr>
                <tr>
                  <td>
                    <h6 className="fw-bold mt-2">
                      <strong className="text-danger">5. </strong>
                      Ph.D./JRF Students
                    </h6>
                  </td>
                  <td>{project_?.jrf_phd_scholar?.stringValue}</td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    {" "}
                    <h4 className="m-0">
                      <strong className="text-danger">Introduction </strong>
                    </h4>
                    <br />
                    {project_?.description?.stringValue}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
                  Image
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
              {projectimages_?.map((item: any, index: any) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item?.title}</td>
                    <td style={{ width: "fit-content" }}>
                      <Link target="_blank" to={item?.bannerURL}>
                        <img
                          className="rounded-2"
                          src={item?.bannerURL}
                          alt="Banner URL"
                          width="500px"
                        />
                      </Link>
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
                              onClick={() => deleteProjectsImages(item._id)}
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
                Add Sub project_
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
                    value={title || ""}
                  />
                </div>

                <div className="mb-2">
                  <label htmlFor="date" className="form-label">
                    Banner Image
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="banner_image"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={loading}
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

export default ProjectImages;
