import { useEffect, useState } from "react";
import "firebase/storage";
import "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../../../firebase";
import "cropperjs/dist/cropper.css";
import { useSelector } from "react-redux";
import {
  deleteResearchArea,
  fetchResearchArea,
} from "../../../services/firebase/getresearcharea";
import { Link } from "react-router-dom";
import { fetchSubAreas } from "../../../services/firebase/getsubareas";
import { addAlert } from "../../components/alert/push.alert";

const ResearchArea: any = () => {
  const getResearchArea = useSelector(
    (state: any) => state.getresearcharea?.data
  );
  const [image, setImage] = useState<any>(null);
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    fetchResearchArea();
    fetchSubAreas();
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
    const storageRef = ref(storage, `research_areas_images/${title}`);
    const blob = await fetch(image).then((res) => res.blob());
    try {
      await uploadBytes(storageRef, blob);
      await addDoc(collection(db, "ResearchArea"), {
        title: title,
        subareas: [],
      });
      addAlert("success", "Research area has been saved!");
      addAlert("info", "Info! You can add sub-areas later.");
      setTitle("");
      setImage(null);
      setLoading(false);
      location.reload();
    } catch (error) {
      addAlert(
        "danger",
        "Error! While uploading image, Please check your internet connection and try again."
      );
      setLoading(false);
    }
  };

  return (
    <>
      <div className="col-sm-12 col-md-10 col-lg-10 col-xl-10 px-5">
        <div className="w-100 d-flex justify-content-between">
          <h3>Research Area</h3>
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
          <h4 className="text-danger">Note:</h4>
          <ol>
            <li>It is for all, it will be show in main website page to.</li>
            <li>
              You can modify any Research area for example you can add more
              details of the Research Area by adding Sub Areas.
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
                  Sub Areas
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
              {getResearchArea?.map((item: any, index: any) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item?.title}</td>
                    <td>
                      <Link
                        to={item._id + `?t=98765432qwdfgnmnbgfdsa&ref=sdfghd`}
                        className="btn btn-dark btn-sm"
                      >
                        Open
                      </Link>
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
                          <li>
                            <button
                              className="dropdown-item text-danger"
                              onClick={() => deleteResearchArea(item._id)}
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
          {!getResearchArea.length && (
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
        <div className="modal-dialog modal-lg">
          <div className="modal-content rounded-0 border-none">
            <div className="modal-header">
              <h5 className="modal-title" id={`addSliderModalLabel`}>
                Add Research Area
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
                <div
                  className="alert alert-warning d-flex align-items-center p-2 rounded-0"
                  role="alert"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    fill="currentColor"
                    className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2"
                    viewBox="0 0 16 16"
                    role="img"
                    aria-label="Warning:"
                  >
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                  </svg>
                  <div>
                    You can add related images with ppt link and pdf link later.
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

export default ResearchArea;
