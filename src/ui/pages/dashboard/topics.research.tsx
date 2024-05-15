import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { addAlert } from "../../components/alert/push.alert";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../firebase";
import {
  deleteResearchTopics,
  fetchResearchTopics,
} from "../../../services/firebase/gettopics";

const ResearchTopics: React.FC = () => {
  const getauth = useSelector((state: any) => state.getauth);
  const getResearchTopics = useSelector(
    (state: any) => state.getResearchTopics.data
  );
  const getResearchTopics_ = getResearchTopics.filter(
    (item_: any) => item_?.userID == getauth?.email
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [images, setImages] = useState<string[]>([]);
  const [data, setData] = useState<{ title: string; description: string }>({
    title: "",
    description: "",
  });
  useEffect(() => {
    fetchResearchTopics();
  }, []);
  const submitHandler = async () => {
    if (!data.title || !data.title) {
      addAlert("danger", "Title and Description are required fields.");
      return;
    }
    if (!images) {
      addAlert("danger", "Select maximum 5 images.");
      return;
    }
    setLoading(true);
    addDoc(collection(db, "research_topics"), {
      title: data?.title,
      userID: getauth?.email,
      description: data?.description,
      images: images,
    })
      .then(() => {
        addAlert("success", "Research Topic has been added.");
        setData({ description: "", title: "" });
        setImages([]);
        setLoading(false);
        window.location.reload();
      })
      .catch(() => {
        addAlert(
          "danger",
          "Error! While adding a Topic, Check you internet connnection and Try Again later."
        );
        setLoading(false);
      });
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
    const maxFileSize = 500 * 1024; // 500kb in bytes
    const maxFiles = 5;
    if (!files || files.length === 0) {
      addAlert("danger", "No files selected.");
      return;
    }
    if (files.length > maxFiles) {
      addAlert("danger", "Maximum 5 images are allowed.");
      return;
    }
    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!allowedTypes.includes(file.type)) {
        addAlert(
          "danger",
          `File ${file.name} is not a valid image format (JPEG, JPG, PNG or GIF).`
        );
        continue;
      }

      if (file.size > maxFileSize) {
        addAlert(
          "danger",
          `File ${file.name} exceeds the maximum file size of 500kb.`
        );
        continue;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Image = reader.result as string;
        newImages.push(base64Image);
        if (newImages.length === files.length) {
          setImages((prevImages) => [...prevImages, ...newImages]);
        }
      };
    }
  };
  return (
    <>
      <div className="col-sm-12 col-md-10 col-lg-10 col-xl-10 px-5">
        <div className="w-100 d-flex justify-content-between">
          <h3>Research Topics</h3>
          <button
            className="btn btn-dark btn-sm rounded-0"
            data-bs-toggle="modal"
            data-bs-target="#AddPeopleModel"
          >
            + Research Topic
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
                  Description
                </th>
                <th
                  scope="col"
                  className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                >
                  Images
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
              {getResearchTopics_ &&
                getResearchTopics_?.map((item: any, index: any) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item?.title}</td>
                      <td>
                        <div style={{ height: "200px", overflow: "auto" }}>
                          {item?.description}
                        </div>
                      </td>
                      <td>
                        <div
                          id={"carouselExampleControls" + index}
                          className="carousel slide"
                          data-bs-ride="carousel"
                          style={{ width: "400px", overflow: "auto" }}
                        >
                          <div className="carousel-inner">
                            <div className="carousel-item active">
                              <img
                                src={item.images[0]}
                                alt=""
                                className="mb-2"
                                style={{ height: "200px" }}
                              />
                            </div>
                            <div className="carousel-item">
                              <img
                                src={item.images[1]}
                                alt=""
                                className="mb-2"
                                style={{ height: "300px" }}
                              />
                            </div>
                            <div className="carousel-item">
                              <img
                                src={item.images[2]}
                                alt=""
                                className="mb-2"
                                style={{ height: "300px" }}
                              />
                            </div>
                            <div className="carousel-item">
                              <img
                                src={item.images[3]}
                                alt=""
                                className="mb-2"
                                style={{ height: "300px" }}
                              />
                            </div>
                          </div>
                          <button
                            className="carousel-control-prev btn btn-dark"
                            type="button"
                            data-bs-target={"#carouselExampleControls" + index}
                            data-bs-slide="prev"
                          >
                            <span
                              className="carousel-control-prev-icon"
                              aria-hidden="true"
                            />
                            <span className="visually-hidden">Previous</span>
                          </button>
                          <button
                            className="carousel-control-next  btn btn-dark"
                            type="button"
                            data-bs-target={"#carouselExampleControls" + index}
                            data-bs-slide="next"
                          >
                            <span
                              className="carousel-control-next-icon"
                              aria-hidden="true"
                            />
                            <span className="visually-hidden">Next</span>
                          </button>
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
                                className="dropdown-item text-shade2"
                                onClick={() => deleteResearchTopics(item._id)}
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
          {!getResearchTopics_.length && (
            <>
              <div className="w-100 text-center">
                <h3 className="fw-bold text-shade2">Data Not Found!</h3>
              </div>
            </>
          )}
        </div>
      </div>

      <div
        className="modal fade"
        id="AddPeopleModel"
        tabIndex={-1}
        aria-labelledby={"AddPeopleModelLabel"}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content rounded-0 border-none">
            <div className="modal-header">
              <h5 className="modal-title" id={"AddPeopleModelLabel"}>
                Add New Research Topic
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="card p-3">
                <div className="alert alert-info rounded-0 mb-3">
                  <h4 className="alert-heading">Instructions:</h4>
                  <p>Please follow these steps to add a Research Topic:</p>
                  <ol>
                    <li>Research Topic Title and Decription is required.</li>
                    <li>Upload an images for the topic.</li>
                    <li>
                      Click on the <strong>"Choose File"</strong> button.
                    </li>
                    <li>
                      Choose the images file you want to upload from your
                      computer.
                    </li>
                    <li>You can only upload 5 images for each topic.</li>
                  </ol>
                  <hr />
                  <p className="mb-0">
                    Accepted file format: Image File (.jpg, .jpeg, .png)
                  </p>
                  <p className="mb-0">Maximum file size: 500KB</p>
                </div>
                <label htmlFor="name" className="form-label">
                  Title <strong className="text-shade2">*</strong>
                </label>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Example: Deep Learning in Healthcare..."
                  name="topic_title"
                  value={data?.title || ""}
                  onChange={(e: any) =>
                    setData({
                      description: data?.description,
                      title: e.target.value,
                    })
                  }
                />
                <label htmlFor="name" className="form-label">
                  Description{" "}
                  <strong className="text-shade2">*(100 to 200 words)</strong>
                </label>
                <textarea
                  className="form-control mb-3"
                  placeholder="Type here..."
                  name="topic_description"
                  rows={10}
                  value={data?.description || ""}
                  onChange={(e: any) =>
                    setData({ title: data.title, description: e.target.value })
                  }
                />
                <label htmlFor="name" className="form-label">
                  Images <strong className="text-shade2">*</strong>
                </label>
                <input
                  type="file"
                  className="form-control mb-3"
                  name="topic_images"
                  multiple
                  onChange={handleImageUpload}
                  accept="image/png, image/jpeg, image/jpg, image/gif"
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
              <button
                type="button"
                className="btn btn-success"
                onClick={submitHandler}
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
              {images.length > 0 && (
                <div className="container px-3 mt-3 col-sm-12 d-flex flex-wrap gap-3 justify-content-between">
                  <h2>Selected Images</h2>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => setImages([])}
                  >
                    Remove All
                  </button>
                </div>
              )}
              <div className="container w-100 d-flex flex-wrap gap-3">
                {images &&
                  images?.map((img_: string, ind_: number) => {
                    return (
                      <img
                        className="w-100"
                        src={img_}
                        key={ind_}
                        alt="Selected Images"
                      />
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResearchTopics;
