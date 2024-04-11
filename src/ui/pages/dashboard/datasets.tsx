import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "firebase/storage";
import "firebase/firestore";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../firebase";
import { useSelector } from "react-redux";
import "cropperjs/dist/cropper.css";
import {
  deleteDatasets,
  fetchDatasets,
} from "../../../services/firebase/getdatasets";
import { addAlert } from "../../components/alert/push.alert";

const Datasets: any = () => {
  const getdatasets = useSelector((state: any) => state.getdatasets).data;
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchDatasets();
  }, []);

  const handleSubmit = async () => {
    if (!title || !description) {
      addAlert("warning", "Please provide the required fields!");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "datasets"), {
        title: title,
        description: description,
        images: [],
      });
      addAlert("success", "Datasets has been saved!");
      addAlert("info", "You can add datasets images later!");
    } catch {
      addAlert("danger", "Error while saving the dataset, Try again!");
    }
    setTitle("");
    setLoading(false);
    window.location.reload();
  };

  return (
    <>
      <div className="col-sm-12 col-md-10 col-lg-10 col-xl-10 px-5">
        <div className="w-100 d-flex justify-content-between">
          <h3>Datasets</h3>
          <button
            className="btn btn-dark btn-sm rounded-0"
            data-bs-toggle="modal"
            data-bs-target="#addSliderModal"
          >
            + Add New
          </button>
        </div>
        <hr />
        <div className="alert alert-warning fw-bold rounded-0">
          It is common for all, If you delete one dataset, it will deleted from
          all.
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
                  style={{ zIndex: "999" }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {getdatasets?.map((item: any, index: any) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item?.title}</td>
                    <td>
                      {" "}
                      <div className="overflow-auto p-2">
                        {item?.description}
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
                            <Link
                              to={item?._id}
                              className="dropdown-item text-success"
                            >
                              Add Images
                            </Link>
                          </li>
                          <li>
                            <button
                              className="dropdown-item text-danger"
                              onClick={() => deleteDatasets(item._id)}
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
          {!getdatasets.length && (
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
                Add Datasets
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
                    rows={5}
                    className="form-control"
                    id="title"
                    aria-describedby="title"
                    placeholder="Describe dataset in 50 to 100 words.."
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={loading}
                    value={description || ""}
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

export default Datasets;
