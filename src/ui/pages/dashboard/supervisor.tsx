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
import { addAlert } from "../../components/alert/push.alert";

interface UserDataType {
  name: string;
  email: string;
  designation: string;
  phone: string;
  researchInterests: string;
  introduction: string;
  teaching: string;
  accomplishments: string;
  professional_affiliation: string;
  links: { linkName: string; linkURL: string }[];
}
const professorDesignations = [
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Adjunct Professor",
  "Visiting Professor",
  "Emeritus Professor",
  "Research Professor",
];
const intialData: UserDataType = {
  name: "",
  email: "",
  designation: "",
  phone: "",
  researchInterests: "",
  introduction: "",
  teaching: "",
  accomplishments: "",
  professional_affiliation: "",
  links: [],
};
const Supervisor: React.FC = () => {
  const getauth = useSelector((state: any) => state.getauth);

  const getsupervisors = useSelector((state: any) => state.getsupervisors.data);
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<File>();
  const [userData, setUserData] = useState<UserDataType>(intialData);
  const [linkInput, setLinkInput] = useState<{
    linkName: string;
    linkURL: string;
  }>({
    linkName: "",
    linkURL: "",
  });
  useEffect(() => {
    fetchSupervisors();
  }, []);
  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const submitHandler = async () => {
    const { name, email, designation } = userData;

    if (!name || !email || !designation) {
      addAlert("danger", "Designation, Email and Name are required fields.");
      return;
    }

    setLoading(true);
    if (!image) {
      addDoc(collection(db, "supervisors"), {
        ...userData,
        startDate: new Date(),
        endDate: "NA",
      })
        .then(async () => {
          await addDoc(collection(db, "users"), {
            email: email,
            userType: "SUPERVISOR",
          });
          addAlert(
            "success",
            "Supervisor details has been saved successfully!"
          );
          setUserData(intialData);
          setImage(undefined);
          setLoading(false);
          window.location.reload(); // You might want to handle the page reload differently
        })
        .catch(() => {
          addAlert(
            "danger",
            "Error! While adding a Supervisor, Check you internet connnection and Try Again later."
          );
          setLoading(false);
        });
    } else {
      const storageRef = ref(
        storage,
        `/peoples/supervisor_profile_images/${name}_${image.name}`
      );
      await uploadBytes(storageRef, image)
        .then(async () => {
          addAlert("success", "Profile image uploaded successfully");
          addDoc(collection(db, "supervisors"), {
            ...userData,
            startDate: new Date(),
            endDate: "NA",
            profileImage: name + image.name,
          })
            .then(async () => {
              await addDoc(collection(db, "users"), {
                email: email,
                userType: "SUPERVISOR",
              });
              addAlert(
                "success",
                "Supervisor details along with profile image have been saved successfully!"
              );
              setUserData(intialData);
              setImage(undefined);
              setLoading(false);
              window.location.reload(); // You might want to handle the page reload differently
            })
            .catch(() => {
              addAlert(
                "danger",
                "Error! While adding a Supervisor, Check you internet connnection and Try Again later."
              );
              setLoading(false);
            });
        })
        .catch(() => {
          addAlert(
            "danger",
            "Error! While adding a Supervisor, Check you internet connnection and Try Again later."
          );
          setLoading(false);
        });
    }
  };
  const isSupervisor = getauth?.userType.includes("SUPERVISOR");
  const isAdmin = getauth?.userType.includes("ADMIN");
  return (
    <>
      <div className="col-sm-12 col-md-10 col-lg-10 col-xl-10 px-5">
        <div className="w-100 d-flex justify-content-between">
          <h3>{!isAdmin && isSupervisor ? "Your Profile" : "Supervisors"}</h3>
          {isAdmin && (
            <button
              className="btn btn-dark btn-sm rounded-0"
              data-bs-toggle="modal"
              data-bs-target="#AddPeopleModel"
            >
              + Add New
            </button>
          )}
        </div>
        <hr />
        <div className="overflow-auto mt-3">
          <table className="table table-bordered table-hover w-100">
            <thead>
              <tr>
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
                  designation,
                  email,
                  phone,
                  researchInterests,
                  introduction,
                  links,
                  teaching,
                  accomplishments,
                  professional_affiliation,
                } = item?.data;
                if (!isAdmin && isSupervisor && getauth?.email != email) {
                  return;
                }
                return (
                  <>
                    <tr key={item._id}>
                      <td>
                        {item?.profileImage ? (
                          <a href={item?.profileImage} target="_blank">
                            <img
                              src={item?.profileImage}
                              alt={`${name}'s profile`}
                              style={{ width: "50px", height: "auto" }}
                            />
                          </a>
                        ) : (
                          "Not Uploaded"
                        )}
                      </td>
                      <td>
                        {isSupervisor && getauth.email === email && (
                          <>
                            {" "}
                            <strong className="text-shade2">
                              Your Profile
                            </strong>
                            <hr />
                          </>
                        )}

                        <h6 className="fw-bold text-primary">{name}</h6>
                        <small className="fw-bold text-shade2">
                          ({designation})
                        </small>
                      </td>
                      <td>
                        Email:{" "}
                        <a href={"mailto:" + email} target="_blank">
                          {email}
                        </a>
                        <hr />
                        Mobile: {phone}
                      </td>
                      <td>
                        <strong>Research Interests: </strong>
                        {researchInterests}
                      </td>
                      <td>
                        <p
                          style={{
                            width: "200px",
                            height: "300px",
                            overflow: "auto",
                          }}
                        >
                          {introduction}
                        </p>
                      </td>
                      <td>
                        <ol>
                          {links?.map((li_: any, index_: number) => {
                            return (
                              <li key={index_}>
                                <Link
                                  to={li_?.linkURL}
                                  target="_blank"
                                  className="btn-link bnt-sm p-0"
                                >
                                  {li_?.linkName}
                                </Link>
                              </li>
                            );
                          })}
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
                            {(getauth.email === email || isAdmin) && (
                              <li>
                                <Link
                                  className="dropdown-item text-primary"
                                  to={item?._id}
                                >
                                  Edit
                                </Link>
                              </li>
                            )}
                            {isAdmin && (
                              <li>
                                <button
                                  className="dropdown-item text-shade2"
                                  onClick={() => deleteSupervisors(item._id)}
                                >
                                  Delete
                                </button>
                              </li>
                            )}
                          </ul>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                        {" "}
                        <strong>Techings: </strong>
                      </td>
                      <td colSpan={5}>{teaching}</td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                        {" "}
                        <strong>Accomplishments: </strong>
                      </td>
                      <td colSpan={5}>{accomplishments}</td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                        {" "}
                        <strong>Professional Affiliation: </strong>
                      </td>
                      <td colSpan={5}>{professional_affiliation}</td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>

          {!getsupervisors.length && (
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
                <h4 className="fw-bold text-primary">Personal Information:</h4>
                <hr />
                <div className="mb-2 row">
                  <div className="col overflow-auto">
                    <label htmlFor="name" className="form-label">
                      Designation(
                      <strong className="text-shade2">required</strong>)
                    </label>
                    <select
                      name="designation"
                      className="form-control"
                      value={userData.designation}
                      onChange={handleChange}
                      id="designation"
                    >
                      <option value="">--select designation--</option>
                      {professorDesignations.map(
                        (item_: string, i_: number) => {
                          return (
                            <option value={item_} key={i_}>
                              {item_}
                            </option>
                          );
                        }
                      )}
                    </select>
                  </div>
                  <div className="col overflow-auto">
                    <label htmlFor="name" className="form-label">
                      Name (<strong className="text-shade2">required</strong>)
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
                  <div className="col overflow-auto">
                    <label htmlFor="email" className="form-label">
                      Email (<strong className="text-shade2">required</strong>)
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
                </div>
                <div
                  className="alert alert-primary p-2 rounded-0 mb-3"
                  role="alert"
                >
                  Name and Email fields are required, Supervisor can also edit
                  other things later.
                </div>
                <div className="text-end">
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
                <h4 className="fw-bold text-primary">
                  Other Details (User can fill later):
                </h4>
                <hr />
                <div className="mb-2 row">
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
                      min={0}
                      max={9999999999}
                    />
                  </div>
                  <div className="col overflow-auto">
                    <label htmlFor="image" className="form-label">
                      Profile Image (User can upload later)
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
                  <label htmlFor="researchInterests" className="form-label">
                    Teaching (Comma Separated)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="ie.  Digital Image Processing, Image analysis, Signal Processing and Communications"
                    name="teaching"
                    value={userData.teaching || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="researchInterests" className="form-label">
                    Accomplishments (Comma Separated)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="ie.  Type here.."
                    name="accomplishments"
                    value={userData.accomplishments}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="researchInterests" className="form-label">
                    Professional Affiliation (Comma Separated)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="ie.  Type here.."
                    name="professional_affiliation"
                    value={userData.professional_affiliation}
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
                <div className="mb-2">
                  <label htmlFor="date" className="form-label">
                    Add Links
                  </label>
                  <div className="col-sm-12 d-flex justify-content-between flex-nowrap">
                    <div className="col-sm-4 pe-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="ie. Google Scholar Profile..."
                        onChange={(e) =>
                          setLinkInput({
                            linkName: e.target.value,
                            linkURL: linkInput.linkURL,
                          })
                        }
                        value={linkInput.linkName || ""}
                      />
                    </div>
                    <div className="col-sm-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="ie. Paste link here..."
                        onChange={(e) =>
                          setLinkInput({
                            linkName: linkInput.linkName,
                            linkURL: e.target.value,
                          })
                        }
                        value={linkInput.linkURL || ""}
                      />
                    </div>
                    <div className="col-sm-2 ps-3">
                      <button
                        className="btn btn-shade1 w-100"
                        onClick={() => {
                          if (!linkInput.linkName || !linkInput.linkURL) {
                            addAlert(
                              "danger",
                              "Link Name and URL are required fields."
                            );
                            return;
                          }
                          if (userData.links.includes(linkInput)) {
                            addAlert("danger", "This link already exists.");
                            return;
                          }
                          setUserData({
                            ...userData,
                            links: [...userData.links, linkInput],
                          });
                          setLinkInput({ linkName: "", linkURL: "" });
                        }}
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                  <table className="table table-bordered table-hover my-3">
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
                          Link Name
                        </th>
                        <th
                          scope="col"
                          className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                        >
                          Link URL
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
                      {userData?.links?.map((item: any, i_: any) => {
                        return (
                          <tr>
                            <th>{i_ + 1}</th>
                            <th>{item?.linkName}</th>
                            <th>
                              <a href={item?.linkURL} target="_blank">
                                {item?.linkURL}
                              </a>
                            </th>
                            <th>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => {
                                  if (confirm("Are you sure want to remove?")) {
                                    setUserData({
                                      ...userData,
                                      links: userData?.links.filter(
                                        (i__) => i__.linkName !== item?.linkName
                                      ),
                                    });
                                  }
                                }}
                              >
                                Remove
                              </button>
                            </th>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {!userData?.links.length && (
                    <>
                      <div className="w-100 text-center">
                        <h5 className="text-shade2">Nothing Added Yet!</h5>
                      </div>
                    </>
                  )}
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
