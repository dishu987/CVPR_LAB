import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase";
import { useSelector } from "react-redux";
import { addAlert } from "../../components/alert/push.alert";
import { storage } from "../../../firebase";
import { deleteObject, ref, uploadBytesResumable } from "firebase/storage";
import { getVideoURL } from "../../../services/firebase/getresume";
import { copyToClipboard } from "../../../utils/copy.clipboard";
import pdf_icon from "./../../../assets/video.png";
import { fetchProjectsMain } from "../../../services/firebase/getprojects.main";
import { timeAgo } from "../../../utils/format.date";

const FILE_SIZE = 10; //MB

const ProjectVideo: React.FC = () => {
  const { id }: any = useParams();
  const getProjectsMain = useSelector(
    (state: any) => state.getprojectsmain?.data
  );
  const project_ = getProjectsMain.find((v: any) => v._id === id);
  if (!project_ || !getProjectsMain) {
    history.back();
    return;
  }
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<any>(null);
  const [progress, setProgress] = useState<number>(0);
  const [video, setVideo] = useState<string>("");
  useEffect(() => {
    const handleCV = async () => {
      setLoading(true);
      const res: any = await getVideoURL(id);
      if (!res || res === null) {
        setLoading(false);
        return;
      }
      setVideo(res);
      setLoading(false);
    };
    fetchProjectsMain();
    handleCV();
  }, []);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      const fileSizeInMB = selectedFile.size / (1024 * 1024);
      if (fileSizeInMB > FILE_SIZE) {
        addAlert(
          "danger",
          "Video File size must be less than " +
            FILE_SIZE +
            "Mb, Select File Size:" +
            fileSizeInMB.toFixed(0) +
            "MB"
        );
        setFile(null);
      } else {
        setFile(selectedFile);
      }
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      addAlert("danger", "Please select a valid video file!");
      return;
    }
    setLoading(true);

    try {
      const metadata = {
        contentType: "video/mp4", // Correct MIME type for MP4 files
      };
      const filename = "video_" + id;
      const storageRef = ref(storage, `project_videos/${filename}`);
      const blob = file; // Use the file object directly
      const uploadTask = uploadBytesResumable(storageRef, blob, metadata);

      await new Promise<void>((resolve, reject) => {
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
            addAlert("danger", "Error uploading video! Try again.");
            setLoading(false);
            reject(error);
          },
          async () => {
            const docRef = doc(db, "projects_main", project_?._id);
            await updateDoc(docRef, {
              video: {
                timestamp: serverTimestamp(),
                name: filename,
              },
            });
            addAlert("success", "Video has been uploaded!");
            setLoading(false);
            resolve();
            location.reload(); // Move location.reload() here
          }
        );
      });
    } catch (error) {
      addAlert("danger", "Error uploading the video, Try Again!");
      setLoading(false);
    }
    setFile(null);
  };
  const deleteCV = async () => {
    if (confirm("Are you sure want to delete?")) {
      setLoading(true);
      try {
        const oldcvRef = ref(storage, "project_videos/video_" + id);
        await deleteObject(oldcvRef);
        const docRef = doc(db, "projects_main", id);
        await updateDoc(docRef, {
          video: {
            timestamp: null,
            name: null,
          },
        });
        addAlert("success", "Deleted Successfully!");
        window.location.reload();
      } catch {
        addAlert("danger", "Error while deleting. Please try again later.");
      }
      setLoading(false);
    }
  };
  const viewFile = () => {
    if (file) {
      const fileURL = URL.createObjectURL(file);
      const newWindow = window.open(fileURL, "_blank", "width=500,height=600");
      if (newWindow) {
        newWindow.focus();
      }
    } else {
      addAlert("danger", "No File Selected");
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
            <i className="bx bx-upload me-1"></i>Upload Video
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
        <div className="col-sm-12 card py-4 d-flex flex-nowrap flex-row hover_bg">
          {!video && !loading && (
            <div className="w-100 text-center">
              <h3>No Video Uploaded</h3>
            </div>
          )}
          {loading && (
            <div className="w-100 text-center">
              <h3>Please wait..</h3>
            </div>
          )}
          {video && !loading && (
            <>
              <div className="ps-3" style={{ width: "fit-content" }}>
                <img
                  src={pdf_icon}
                  alt="PDF Icons"
                  style={{ width: "200px" }}
                  srcSet={pdf_icon}
                />
              </div>
              <div style={{ width: "fit-content" }} className="mx-3">
                <button
                  className="btn btn-link mx-0 px-0"
                  onClick={() => {
                    const newWindow = window.open(
                      video,
                      "_blank",
                      "width=550,height=700"
                    );
                    if (newWindow) {
                      newWindow.focus();
                    }
                  }}
                  disabled={loading}
                >
                  <h3>Video_{id}.mp4</h3>
                </button>
                <p className="text-muted">
                  Current Version(
                  <a
                    href={video}
                    target="_blank"
                    style={{ textDecoration: "none" }}
                  >
                    View
                  </a>{" "}
                  )
                  <br />{" "}
                  <small>
                    Uploaded On:{" "}
                    <strong className="text-danger">
                      {timeAgo(
                        project_?.video?.mapValue?.fields?.timestamp
                          ?.timestampValue
                      )}
                    </strong>{" "}
                    (
                    {
                      project_?.video?.mapValue?.fields?.timestamp
                        ?.timestampValue
                    }
                    )
                  </small>
                </p>

                <div className="d-flex flex-nowrap">
                  <button
                    className="btn btn-danger btn-sm me-2"
                    onClick={() => copyToClipboard(video)}
                  >
                    Copy Link
                  </button>{" "}
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={deleteCV}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
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
                <i className="bx bx-upload me-1"></i> Upload Video
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
                <div className="alert-primary alert card p-3 rounded-0 ">
                  <label htmlFor="file_upload">Select Video file</label>
                  <div className="input-group mb-2 d-flex justify-content-between align-items-center">
                    <input
                      type="file"
                      name="file_upload"
                      accept="video/mp4"
                      id="file_upload"
                      multiple={false}
                      className="form-control p-3 border-1 border-danger"
                      onChange={handleFileChange}
                    />
                    <div className="input-group-postpend">
                      <button
                        className="btn btn-danger p-3"
                        style={{ width: "100px" }}
                        disabled={loading || !file}
                        onClick={() => viewFile()}
                      >
                        Open
                      </button>
                    </div>
                  </div>
                </div>
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
                      {progress} %
                    </div>
                  </div>
                )}
                <div className="alert alert-info rounded-0">
                  <h4 className="alert-heading">Instructions:</h4>
                  <p>Please follow these steps to select a Video file:</p>
                  <ol>
                    <li>Click on the "Select Video file" button.</li>
                    <li>
                      Choose the Video file you want to upload from your
                      computer.
                    </li>
                    <li>Click "Open" to confirm your selection.</li>
                  </ol>
                  <hr />
                  <p className="mb-0">Accepted file format: Video (.mp4)</p>
                  <p className="mb-0">Maximum file size: {FILE_SIZE}MB</p>
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

export default ProjectVideo;
