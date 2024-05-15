import { useEffect, useState } from "react";
import "firebase/storage";
import "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../../../firebase";
import "cropperjs/dist/cropper.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  deleteProjectsItems,
  fetchProjectsItems,
} from "../../../services/firebase/getprojectitems";
import { addAlert } from "../../components/alert/push.alert";

const Projects: any = () => {
  const getProjects = useSelector((state: any) => state.getprojectitems?.data);
  const getauth = useSelector((state: any) => state.getauth);
  const [image, setImage] = useState<any>(null);
  const [title, setTitle] = useState<string>("");
  const [pptLink, setPptLink] = useState<string>("");
  const [pdfLink, setPdfLink] = useState<string>("");
  const [githubLink, setGithubLink] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    fetchProjectsItems();
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
    const storageRef = ref(storage, `project_items_images/${title}`);
    const blob = await fetch(image).then((res) => res.blob());
    try {
      await uploadBytes(storageRef, blob);
      await addDoc(collection(db, "projects_items"), {
        title: title,
        pptLink: pptLink,
        pdfLink: pdfLink,
        githubLink: githubLink,
        description: description,
        user: getauth?.email,
      });
      addAlert("success", "Project has been saved!");
      setLoading(false);
      location.reload();
    } catch (error) {
      addAlert("danger", "Error uploading image, Try Again!");
      setLoading(false);
    }
    setTitle("");
    setPdfLink("");
    setPptLink("");
    setGithubLink("");
    setDescription("");
    setImage(null);
  };
  return (
    <>
      <div className="col-sm-12 col-md-10 col-lg-10 col-xl-10 px-5">
        <div className="w-100 d-flex justify-content-between">
          <h3>Research Topics/Projects</h3>
          <button
            className="btn btn-dark btn-sm rounded-0"
            data-bs-toggle="modal"
            data-bs-target="#addSliderModal"
          >
            + Add New
          </button>
        </div>
        <hr />
        <div className="alert alert-warning rounded-0 p-2 fw-bold">
          <h4 className="text-shade2">Note:</h4>
          <ol>
            <li>
              It is for all, you can use these in Research Projects and
              Datasets.
            </li>
            <li>
              Please do not delete any, if it is already associated with any
              Research Project and Dataset.
            </li>
          </ol>
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
                  Resources
                </th>
                <th
                  scope="col"
                  className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                >
                  Banner
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
              {getProjects?.map((item: any, index: any) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      {item?.title}
                      <hr />
                      {item?.description}
                    </td>
                    <td>
                      <ul>
                        {item?.pdfLink && (
                          <li>
                            <Link
                              to={item?.pdfLink ? item?.pdfLink : "#"}
                              target="_blank"
                            >
                              PDF Link
                            </Link>
                          </li>
                        )}
                        {item?.pptLink && (
                          <li>
                            <Link
                              to={item?.pptLink ? item?.pptLink : "#"}
                              target="_blank"
                            >
                              PPT Link
                            </Link>
                          </li>
                        )}
                        {item?.githubLink && (
                          <li>
                            <Link
                              to={item?.githubLink ? item?.githubLink : "#"}
                              target="_blank"
                            >
                              Github Link
                            </Link>
                          </li>
                        )}
                      </ul>
                    </td>
                    <td style={{ width: "fit-content" }}>
                      <Link target="_blank" to={item?.bannerURL}>
                        <img
                          className="rounded-2"
                          src={item.bannerURL}
                          alt=""
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
                          {item?.user === getauth?.email && (
                            <li>
                              <button
                                className="dropdown-item text-shade2"
                                onClick={() => deleteProjectsItems(item._id)}
                              >
                                Delete
                              </button>
                            </li>
                          )}
                        </ul>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!getProjects.length && (
            <div className="col-sm-12 text-center my-5 text-danger fw-bold">
              <h3>Data Not Found</h3>
            </div>
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
                    placeholder="Type Here.."
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={loading}
                    value={title || ""}
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="title" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="title"
                    aria-describedby="title"
                    placeholder="Type Here.."
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={loading}
                    value={description || ""}
                    rows={4}
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="title" className="form-label">
                    PPT Link (Optional)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    aria-describedby="title"
                    placeholder="Paste Here.."
                    onChange={(e) => setPptLink(e.target.value)}
                    disabled={loading}
                    value={pptLink || ""}
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="title" className="form-label">
                    Pdf Link (Optional)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    aria-describedby="title"
                    placeholder="Paste Here.."
                    onChange={(e) => setPdfLink(e.target.value)}
                    disabled={loading}
                    value={pdfLink || ""}
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="title" className="form-label">
                    Github Link (Optional)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="github_Code"
                    aria-describedby="title"
                    placeholder="Paste Here.."
                    onChange={(e) => setGithubLink(e.target.value)}
                    disabled={loading}
                    value={githubLink || ""}
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

export default Projects;
