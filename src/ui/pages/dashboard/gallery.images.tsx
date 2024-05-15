import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "firebase/storage";
import "firebase/firestore";
import { ref, uploadBytesResumable } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../../../firebase";
import { useSelector } from "react-redux";
import {
  deleteGallery,
  deleteMultiple,
  fetchGallery,
} from "../../../services/firebase/getgallery";
import { formatDate, formatDate2 } from "../../../utils/format.date";
import { addAlert } from "../../components/alert/push.alert";
import { v4 as uuidv4 } from "uuid";

const GalleryImages: any = () => {
  const getgallery = useSelector((state: any) => state.getgallery).data;
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [checkedImages, setCheckedImages] = useState<{
    selectedAll: boolean;
    selectedChecks: string[];
  }>({ selectedAll: false, selectedChecks: [] });
  const [progress, setProgress] = useState<number>(0);
  useEffect(() => {
    fetchGallery();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      if (files.length > 10) {
        addAlert("danger", "Number of Images must be less than or equal to 10");
        e.target.value = "";
        return;
      }
      const imageFiles: File[] = Array.from(files);
      const urls: string[] = [];
      imageFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            urls.push(reader.result);
          }
          if (urls.length === imageFiles.length) {
            setImages(urls);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = async () => {
    if (!images.length) {
      addAlert("danger", "Please select the images!");
      return;
    }

    setLoading(true);

    try {
      const promises = images.map(async (image_) => {
        const id = uuidv4();
        const storageRef = ref(storage, `gallery_images/${id}`);
        const blob = await fetch(image_).then((res) => res.blob());
        const uploadTask = uploadBytesResumable(storageRef, blob);

        return new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot: any) => {
              const progress = (
                (snapshot.bytesTransferred / snapshot.totalBytes) *
                100
              ).toFixed(2);
              setProgress(Number(progress));
            },
            (error: any) => {
              addAlert("danger", "Error uploading image! Try again.");
              reject(error);
            },
            async () => {
              await addDoc(collection(db, "gallery_images"), {
                id: id,
                timestamp: new Date(Date.now()),
              });
              resolve();
            }
          );
        });
      });
      // Await all upload promises
      await Promise.all(promises);
      addAlert("success", "Images has been saved!");
    } catch (error) {
      addAlert("danger", "Error uploading images!");
      console.error("Error uploading images:", error);
    }
    setProgress(0);
    setImages([]);
    setLoading(false);
    window.location.reload();
  };

  return (
    <>
      <div className="col-sm-12 col-md-10 col-lg-10 col-xl-10 px-5">
        <div className="w-100 d-flex justify-content-between">
          <h3>Gallery Images</h3>
          <div>
            {checkedImages.selectedChecks.length !== 0 && (
              <button
                className="btn btn-shade1"
                onClick={async () => {
                  if (confirm("Are you sure want to delete!")) {
                    setLoading(true);
                    await deleteMultiple(checkedImages.selectedChecks);
                    addAlert("success", "Images has been deleted!");
                  }
                }}
                disabled={loading}
              >
                {loading
                  ? "Please Wait.."
                  : "Delete Selected" +
                    "(" +
                    checkedImages.selectedChecks.length +
                    ")"}
              </button>
            )}
            <button
              className="btn btn-dark rounded-0 ms-2"
              data-bs-toggle="modal"
              data-bs-target="#addSliderModal"
            >
              + Add New
            </button>
          </div>
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
                  <div className="d-flex flex-nowrap">
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      name="select_image"
                      id="select_image"
                      onChange={(e) =>
                        setCheckedImages({
                          selectedAll: e.target.checked,
                          selectedChecks: e.target.checked
                            ? getArray(getgallery)
                            : [],
                        })
                      }
                      checked={checkedImages.selectedAll}
                    />{" "}
                    <span>Select All </span>
                  </div>
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
                >
                  Timestamp
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
              {getgallery?.map((item: any, index: any) => {
                const isContain = checkedImages.selectedChecks.includes(
                  item?._id.toString()
                );
                return (
                  <tr key={index}>
                    <td className={isContain ? "bg-secondary1" : ""}>
                      <input
                        type="checkbox"
                        className="form-check-input me-2"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCheckedImages({
                              selectedAll: false,
                              selectedChecks: [
                                ...checkedImages.selectedChecks,
                                item?._id,
                              ],
                            });
                          } else {
                            setCheckedImages({
                              selectedAll: false,
                              selectedChecks:
                                checkedImages.selectedChecks.filter(
                                  (val: string) => val != item?._id
                                ),
                            });
                          }
                        }}
                        checked={isContain}
                      />
                    </td>
                    <td className={isContain ? "bg-secondary1" : ""}>
                      <Link
                        target="_blank"
                        to={item.bannerURL}
                        style={{ width: "200px", overflow: "auto" }}
                      >
                        <img
                          className="rounded-2"
                          src={item.bannerURL}
                          alt=""
                          width={"300px"}
                        />
                      </Link>
                    </td>
                    <td
                      style={{ width: "10px" }}
                      className={isContain ? "bg-secondary1" : ""}
                    >
                      {formatDate2(item.datetime)} on{" "}
                      {formatDate(item.datetime)}
                    </td>
                    <td className={isContain ? "bg-secondary1" : ""}>
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
                              onClick={async () => {
                                await deleteGallery(item._id, false);
                                addAlert("success", "Image has been deleted!");
                              }}
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
          {!getgallery.length && (
            <>
              <div className="w-100 text-center">
                <h3 className="fw-bold text-shade2">Not Found!</h3>
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
                Add Gellary Images
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
                {loading && (
                  <div className="progress mb-3">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: progress + "%" }}
                      aria-valuenow={progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      {progress}%
                    </div>
                  </div>
                )}
                <div className="mb-2">
                  <label htmlFor="date" className="form-label">
                    Select Images
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="banner_image"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={loading}
                    multiple
                  />
                </div>
                <div className="alert alert-warning" role="alert">
                  You can only upload{" "}
                  <strong className="fw-bold text-shade2">
                    10 Images at a time
                  </strong>
                  !
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

              <div className="w-100 d-flex justify-content-between align-items-center">
                <h4 className="my-2 text-shade2">
                  Preview ({images.length} selected)
                </h4>
                <button
                  className="btn btn-sm btn-shade1"
                  style={{ height: "fit-content" }}
                  onClick={() => setImages([])}
                >
                  Remove All
                </button>
              </div>

              <div className="my-4 d-flex justify-content-center align-items-start flex-wrap gap-2">
                {images &&
                  images.map((base64String, index) => (
                    <img
                      key={index}
                      src={base64String}
                      alt={`Image ${index}`}
                      style={{
                        width: "300px",
                        height: "auto",
                        cursor: "pointer",
                      }}
                      className="rounded-1 shadow-lg"
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GalleryImages;

const getArray = (getgallery: any) => {
  let arr: any = [];
  getgallery?.map((item_: any) => {
    arr.push(item_?._id);
  });
  return arr;
};
