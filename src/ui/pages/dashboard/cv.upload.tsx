import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { addAlert } from "../../components/alert/push.alert";
import { storage } from "../../../firebase";
import { deleteObject, ref, uploadBytes } from "firebase/storage";
import pdf_icon from "./../../../assets/pdf.png";
import { getResumeURL } from "../../../services/firebase/getresume";
import { copyToClipboard } from "../../../utils/copy.clipboard";

const FILE_SIZE = 1; // in MBs
const CVUpload: any = () => {
  const getauth = useSelector((state: any) => state.getauth);
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<any>(null);
  const [cv, setCV] = useState<string>("");
  useEffect(() => {
    const handleCV = async () => {
      setLoading(true);
      const res: any = await getResumeURL(getauth?.email);
      if (!res || res === null) {
        setLoading(false);
        return;
      }
      setCV(res);
      setLoading(false);
    };
    handleCV();
  }, []);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      const fileSizeInMB = selectedFile.size / (1024 * 1024);
      if (fileSizeInMB > FILE_SIZE) {
        addAlert("danger", "File size must be less than " + FILE_SIZE + "Mb");
        setFile(null);
      } else {
        setFile(selectedFile);
      }
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
  const UploadFile = async () => {
    if (!file) {
      addAlert("danger", "Please select a file.");
      return;
    }
    setLoading(true);
    try {
      if (!getauth?.email) {
        addAlert("danger", "Invalid Parameters.");
        return;
      }
      const storageRef = ref(storage, "users_resume/" + getauth?.email);
      const reader = new FileReader();
      const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
        reader.onload = (event) => {
          if (event.target?.result instanceof ArrayBuffer) {
            resolve(event.target.result);
          } else {
            reject(new Error("Failed to read file"));
          }
        };
        reader.readAsArrayBuffer(file);
      });
      const uint8Array = new Uint8Array(arrayBuffer);
      const metadata = {
        contentType: "application/pdf",
      };
      await uploadBytes(storageRef, uint8Array, metadata);
      addAlert("success", "Upload Successful!");
    } catch {
      addAlert(
        "danger",
        "Error, while uploading the CV, Please try again later."
      );
    }
    setFile(null);
    setLoading(false);
    window.location.reload();
  };
  const deleteCV = async () => {
    if (confirm("Are you sure want to delete?")) {
      setLoading(true);
      try {
        const oldcvRef = ref(storage, "users_resume/" + getauth?.email);
        await deleteObject(oldcvRef);
        addAlert("success", "CV Deleted Successfully!");
        window.location.reload();
      } catch {
        addAlert(
          "danger",
          "Error while deleting the cv. Please try again later."
        );
      }
      setLoading(false);
    }
  };
  return (
    <>
      <div className="col-sm-12 col-md-10 col-lg-10 col-xl-10 px-5">
        <div className="w-100 d-flex justify-content-between">
          <h3>Your Resume</h3>
          <button
            className="btn btn-dark btn-sm rounded-0"
            data-bs-toggle="modal"
            data-bs-target="#AddPeopleModel"
          >
            + Upload CV
          </button>
        </div>
        <hr />
        <div className="col-sm-12 card py-4 d-flex flex-nowrap flex-row hover_bg">
          {!cv && !loading && (
            <div className="w-100 text-center">
              <h3>No CV Uploaded</h3>
            </div>
          )}
          {loading && (
            <div className="w-100 text-center">
              <h3>Please wait..</h3>
            </div>
          )}
          {cv && !loading && (
            <>
              <div style={{ width: "fit-content" }}>
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
                      cv,
                      "_blank",
                      "width=550,height=700"
                    );
                    if (newWindow) {
                      newWindow.focus();
                    }
                  }}
                  disabled={loading}
                >
                  <h3>Resume.pdf</h3>
                </button>
                <p className="text-muted">
                  Current Version({" "}
                  <a
                    href={cv}
                    target="_blank"
                    style={{ textDecoration: "none" }}
                  >
                    View
                  </a>{" "}
                  )
                </p>
                <div className="d-flex flex-nowrap">
                  <button
                    className="btn btn-shade1 btn-sm me-2"
                    onClick={() => copyToClipboard(cv)}
                  >
                    Copy Link
                  </button>{" "}
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={deleteCV}
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
        id="AddPeopleModel"
        tabIndex={-1}
        aria-labelledby={"AddPeopleModelLabel"}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content rounded-0 border-none">
            <div className="modal-header">
              <h5 className="modal-title" id={"AddPeopleModelLabel"}>
                Upload Your CV
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="alert-primary alert card p-3 rounded-0 ">
                <label htmlFor="file_upload">Select PDF file</label>
                <div className="input-group mb-2 d-flex justify-content-between align-items-center">
                  <input
                    type="file"
                    name="file_upload"
                    accept="application/pdf"
                    id="file_upload"
                    multiple={false}
                    className="form-control p-3 border-1 border-danger"
                    onChange={handleFileChange}
                  />
                  <div className="input-group-postpend">
                    <button
                      className="btn btn-shade1 p-3"
                      style={{ width: "100px" }}
                      disabled={loading || !file}
                      onClick={() => viewFile()}
                    >
                      Open
                    </button>
                  </div>
                </div>
              </div>
              <div className="alert alert-info rounded-0">
                <h4 className="alert-heading">Instructions:</h4>
                <p>Please follow these steps to select a PDF file:</p>
                <ol>
                  <li>Click on the "Select PDF file" button.</li>
                  <li>
                    Choose the PDF file you want to upload from your computer.
                  </li>
                  <li>Click "Open" to confirm your selection.</li>
                </ol>
                <hr />
                <p className="mb-0">Accepted file format: PDF (.pdf)</p>
                <p className="mb-0">Maximum file size: {FILE_SIZE}MB</p>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-danger"
                data-bs-dismiss="modal"
                disabled={loading}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={UploadFile}
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

export default CVUpload;
