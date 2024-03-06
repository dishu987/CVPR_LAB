import { addDoc, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, storage } from "../../../firebase";
import { ref, uploadBytes } from "firebase/storage";
import {
  deleteSupervisors,
  fetchSupervisors,
} from "../../../services/firebase/getsupervisors";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

interface UserDataType {
  name: string;
  email: string;
  phone: string;
  researchInterests: string;
  introduction: string;
  googleScholarLink: string;
  researchGateLink: string;
  personalProfileLink: string;
  otherLink: string;
}

const Supervisor: React.FC = () => {
  const getsupervisors = useSelector((state: any) => state.getsupervisors.data);
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<File>();
  const [userData, setUserData] = useState<UserDataType>({
    name: "",
    email: "",
    phone: "",
    researchInterests: "",
    introduction: "",
    googleScholarLink: "",
    researchGateLink: "",
    personalProfileLink: "",
    otherLink: "",
  });
  useEffect(() => {
    fetchSupervisors();
  }, []);
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const submitHandler = async () => {
    const {
      name,
      email,
      phone,
      researchInterests,
      introduction,
      googleScholarLink,
      researchGateLink,
      personalProfileLink,
      otherLink,
    } = userData;

    if (!name || !email || !phone || !researchInterests || !introduction) {
      console.log("Please fill all required fields.");
      return;
    }

    if (!image) {
      console.log("Please upload a profile image.");
      return;
    }

    setLoading(true);
    const storageRef = ref(
      storage,
      `/peoples/supervisor_profile_images/${name}_${image.name}`
    );
    await uploadBytes(storageRef, image)
      .then(async () => {
        console.log("Profile image uploaded successfully");
        addDoc(collection(db, "supervisors"), {
          name: name,
          email: email,
          phone: phone,
          researchInterests: researchInterests,
          introduction: introduction,
          googleScholarLink: googleScholarLink,
          researchGateLink: researchGateLink,
          personalProfileLink: personalProfileLink,
          otherLink: otherLink,
          profileImage: name + "_" + image.name,
          startDate: new Date(),
          endDate: "NA",
        })
          .then(() => {
            alert(
              "Supervisor details along with profile image have been saved successfully!"
            );
            setUserData({
              name: "",
              email: "",
              phone: "",
              researchInterests: "",
              introduction: "",
              googleScholarLink: "",
              researchGateLink: "",
              personalProfileLink: "",
              otherLink: "",
            });
            setImage(undefined);
            setLoading(false);
            window.location.reload(); // You might want to handle the page reload differently
          })
          .catch((error: any) => {
            console.error("Error saving supervisor data:", error);
            setLoading(false);
          });
      })
      .catch((error: any) => {
        console.error("Error uploading profile image:", error);
        setLoading(false);
      });
  };

  return (
    <>
      <div className="col-sm-12 col-md-10 col-lg-10 col-xl-10 px-5">
        <div className="w-100 d-flex justify-content-between">
          <h3>Supervisor</h3>
          <button
            className="btn btn-dark btn-sm rounded-0"
            data-bs-toggle="modal"
            data-bs-target="#AddPeopleModel"
          >
            + Add New
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
                  Profile Image
                </th>
                <th
                  scope="col"
                  className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                >
                  Contact
                </th>
                <th
                  scope="col"
                  className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                >
                  Research Interests
                </th>
                <th
                  scope="col"
                  className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                >
                  Introduction
                </th>
                <th
                  scope="col"
                  className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                >
                  Profile Links
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
              {getsupervisors?.map((item: any, index: number) => {
                const {
                  name,
                  email,
                  phone,
                  researchInterests,
                  introduction,
                  googleScholarLink,
                  researchGateLink,
                  personalProfileLink,
                  otherLink,
                  startDate,
                  endDate,
                } = item?.data;
                return (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>
                      <a href={item?.profileImage} target="_blank">
                        <img
                          src={item?.profileImage}
                          alt={`${name}'s profile`}
                          style={{ width: "50px", height: "auto" }}
                        />
                      </a>
                    </td>
                    <td>
                      {name?.stringValue}
                      <hr />
                      (From {startDate?.timestampValue} to
                      {endDate?.timestampValue
                        ? endDate?.timestampValue
                        : " NA"}
                      )
                    </td>
                    <td>
                      Email:{" "}
                      <a href={"mailto:" + email?.stringValue} target="_blank">
                        {email?.stringValue}
                      </a>
                      <hr />
                      Mobile: {phone?.stringValue}
                    </td>
                    <td>{researchInterests?.stringValue}</td>
                    <td>
                      <p
                        style={{
                          width: "200px",
                          height: "300px",
                          overflow: "auto",
                        }}
                      >
                        {introduction?.stringValue}
                      </p>
                    </td>
                    <td>
                      <ol>
                        <li>
                          <Link
                            to={googleScholarLink?.stringValue}
                            target="_blank"
                            className="btn-link bnt-sm p-0"
                          >
                            Google Scholar
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={researchGateLink?.stringValue}
                            target="_blank"
                            className="btn-link bnt-sm p-0"
                          >
                            Researchgate
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={personalProfileLink?.stringValue}
                            target="_blank"
                            className="btn-link bnt-sm p-0"
                          >
                            Personal Profile
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={otherLink?.stringValue}
                            target="_blank"
                            className="btn-link bnt-sm p-0"
                          >
                            Other Link
                          </Link>
                        </li>
                      </ol>
                    </td>
                    <td>
                      <div className="dropdown">
                        <button
                          className="btn btn-secondary dropdown-toggle btn-sm"
                          type="button"
                          id={`dropdownMenuButton${index}`}
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          Action
                        </button>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby={`dropdownMenuButton${index}`}
                        >
                          <li>
                            <Link
                              className="dropdown-item text-primary"
                              to={"supervisors/" + item?._id}
                            >
                              Edit
                            </Link>
                          </li>
                          <li>
                            <button
                              className="dropdown-item text-danger"
                              onClick={() => deleteSupervisors(item._id)}
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

          {!getsupervisors.length && (
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
        id="AddPeopleModel"
        tabIndex={-1}
        aria-labelledby={"AddPeopleModelLabel"}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content rounded-0 border-none">
            <div className="modal-header">
              <h5 className="modal-title" id={"AddPeopleModelLabel"}>
                Add New Supervisor
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
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="ie. Dr. XYZ"
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-2 row">
                  <div className="col overflow-auto">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="ie. user@gmail.com"
                      name="email"
                      value={userData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col overflow-auto">
                    <label htmlFor="phone" className="form-label">
                      Phone
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="ie. 10 digits mobile number"
                      name="phone"
                      value={userData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col overflow-auto">
                    <label htmlFor="image" className="form-label">
                      Profile Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      name="image"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        setImage(file);
                      }}
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <label htmlFor="researchInterests" className="form-label">
                    Research Interests (Comma Separated)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="ie.  Machine Learning, AI, Data Science etc."
                    name="researchInterests"
                    value={userData.researchInterests}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="introduction" className="form-label">
                    Introduction
                  </label>
                  <textarea
                    className="form-control"
                    rows={5}
                    placeholder="A brief introduction about the Supervisor"
                    name="introduction"
                    value={userData.introduction}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-2 row">
                  <div className="col">
                    <label htmlFor="googleScholarLink" className="form-label">
                      Google Scholar Link
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="googleScholarLink"
                      value={userData.googleScholarLink}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col">
                    <div className="mb-2">
                      <label htmlFor="researchGateLink" className="form-label">
                        Research Gate Link
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="researchGateLink"
                        value={userData.researchGateLink}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-2 row">
                  <div className="col">
                    <label htmlFor="personalProfileLink" className="form-label">
                      Personal Profile Link
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="personalProfileLink"
                      value={userData.personalProfileLink}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="otherLink" className="form-label">
                      Other Link (if any)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="otherLink"
                      value={userData.otherLink}
                      onChange={handleChange}
                    />
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Supervisor;
