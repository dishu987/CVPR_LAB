import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../../../firebase";
import { useSelector } from "react-redux";
import { addAlert } from "../../components/alert/push.alert";
import { storage } from "../../../firebase";
import { ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import {
  deleteDatasetsImage,
  fetchDatasets,
} from "../../../services/firebase/getdatasets";

const DatasetsImages: React.FC = () => {
  const { id } = useParams();
  const getdatasets = useSelector((state: any) => state.getdatasets).data;
  const dataset_ = getdatasets.find((v: any) => v._id === id);
  if (!dataset_) {
    history.back();
    return;
  }
  const [image, setImage] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    fetchDatasets();
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
    if (!image) {
      addAlert("danger", "Please select an image.");
      return;
    }
    setLoading(true);
    const file_name = id + "_" + uuidv4();
    const storageRef = ref(storage, `dataset_images/${file_name}`);
    const blob = await fetch(image).then((res) => res.blob());
    try {
      await uploadBytes(storageRef, blob);
      const docRef = doc(db, "datasets", id ? id : "");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const currentImages = data.images || [];
        const updatedImages = [...currentImages, file_name];
        await updateDoc(docRef, {
          images: updatedImages,
        });
        addAlert("success", "Document successfully updated with new image!");
      } else {
        addAlert("danger", "Something went wrong!");
      }
      setImage(null);
      setLoading(false);
      location.reload();
    } catch (error) {
      addAlert("danger", "Error uploading image, Try Again!");
      setImage(null);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="col-sm-12 col-md-10 col-lg-10 col-xl-10 px-5">
        <div className="w-100 d-flex justify-content-between">
          <h3 className="fw-bold text-shade2">{dataset_?.title}</h3>
        </div>
        <hr />
        <div className="d-flex flex-nowrap gap-2 mb-3 w-100 justify-justify-content-start">
          <button
            className="btn btn-info"
            data-bs-toggle="modal"
            data-bs-target="#addSliderModal"
          >
            + Upload Image
          </button>
          <button className="btn btn-shade1" onClick={() => history.back()}>
            Back to Datasets
          </button>
        </div>
        <h4 className="fw-bold">1. Dataset Details</h4>
        <hr />
        <div className="overflow-auto my-4 card p-3 rounded-0">
          {dataset_?.description}
        </div>
        <h4 className="fw-bold">2. Dataset Images</h4>
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
              {dataset_?.images?.map((item: any, index: any) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td style={{ width: "fit-content" }}>
                      <Link target="_blank" to={item?.url}>
                        <img
                          className="rounded-2"
                          src={item?.url}
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
                              className="dropdown-item text-shade2"
                              onClick={() =>
                                deleteDatasetsImage(dataset_._id, item?.name)
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
              {!dataset_?.images?.length && (
                <tr>
                  <td
                    colSpan={4}
                    className="fw-bold h3 text-success p-5 text-center"
                  >
                    No Data
                  </td>
                </tr>
              )}
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
                Upload Images
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

export default DatasetsImages;
