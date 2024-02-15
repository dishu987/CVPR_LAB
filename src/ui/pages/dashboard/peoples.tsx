import { addDoc, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { deletephd, fetchphd } from "../../../services/firebase/getphd";
import { useSelector } from "react-redux";
import { deletepgug, fetchpgug } from "../../../services/firebase/getphug";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../firebase";
import {
  deletevisinterns,
  fetchvisinterns,
} from "../../../services/firebase/getvisinterns";

const Peoples: any = () => {
  const getphd = useSelector((state: any) => state.getphdStudents.data);
  const getpgug = useSelector((state: any) => state.getpgugStudents.data);
  const getvisitorsandinterns = useSelector(
    (state: any) => state.getvisitorsandinterns.data
  );
  const [active, setActive] = useState<number>(1);
  const [designation, setDesignation] = useState<string>("");
  useEffect(() => {
    fetchphd();
    fetchpgug();
    fetchvisinterns();
  }, []);
  return (
    <>
      <div className="col-sm-12 col-md-10 col-lg-10 col-xl-10 px-5">
        <div className="w-100 d-flex justify-content-between">
          <h3>Peoples</h3>
          <button
            className="btn btn-dark btn-sm rounded-0"
            data-bs-toggle="modal"
            data-bs-target="#AddPeopleModel"
          >
            + Add New
          </button>
        </div>
        <hr />
        <div className="w-100">
          <>
            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${
                    active === 1 ? "bg-dark text-white" : "text-dark"
                  }`}
                  id="pills-profile-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-profile"
                  type="button"
                  role="tab"
                  aria-controls="pills-profile"
                  aria-selected="false"
                  onClick={() => setActive(1)}
                >
                  Ph.D. Scholars
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${
                    active === 2 ? "bg-dark text-white" : "text-dark"
                  }`}
                  id="pills-contact-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-contact"
                  type="button"
                  role="tab"
                  aria-controls="pills-contact"
                  aria-selected="false"
                  onClick={() => setActive(2)}
                >
                  Post Graduate students
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${
                    active === 3 ? "bg-dark text-white" : "text-dark"
                  }`}
                  id="pills-contact-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-contact"
                  type="button"
                  role="tab"
                  aria-controls="pills-contact"
                  aria-selected="false"
                  onClick={() => setActive(3)}
                >
                  Alumni PhD
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${
                    active === 4 ? "bg-dark text-white" : "text-dark"
                  }`}
                  id="pills-contact-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-contact"
                  type="button"
                  role="tab"
                  aria-controls="pills-contact"
                  aria-selected="false"
                  onClick={() => setActive(4)}
                >
                  Alumni Masters and Bachelors
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${
                    active === 5 ? "bg-dark text-white" : "text-dark"
                  }`}
                  id="pills-contact-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-contact"
                  type="button"
                  role="tab"
                  aria-controls="pills-contact"
                  aria-selected="false"
                  onClick={() => setActive(5)}
                >
                  Interns and Visitors
                </button>
              </li>
            </ul>
            <hr />
            <div className="overflow-auto mt-3" style={{ height: "500px" }}>
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    {(active === 1 || active === 3) && (
                      <th
                        scope="col"
                        className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                      >
                        Profile
                      </th>
                    )}
                    <th
                      scope="col"
                      className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                    >
                      Name
                    </th>
                    {active !== 5 && (
                      <th
                        scope="col"
                        className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                      >
                        Email
                      </th>
                    )}
                    {(active === 2 || active === 4) && (
                      <th
                        scope="col"
                        className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                      >
                        Degree
                      </th>
                    )}
                    {active !== 5 && (
                      <>
                        {" "}
                        <th
                          scope="col"
                          className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                        >
                          Batch
                        </th>
                        <th
                          scope="col"
                          className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                        >
                          Mobile
                        </th>
                        <th
                          scope="col"
                          className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                        >
                          {active === 3 || active === 1
                            ? "Research Interests"
                            : "Currently Working At"}
                        </th>
                      </>
                    )}
                    {active === 5 && (
                      <th
                        scope="col"
                        className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                      >
                        Institute
                      </th>
                    )}
                    <th
                      scope="col"
                      className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(active === 1 || active === 3) &&
                    getphd?.map((item: any, index: number) => {
                      const {
                        name,
                        batch,
                        isAlumni,
                        email,
                        mobile,
                        researchInterests,
                      } = item?.data;
                      if (active === 1 && isAlumni?.booleanValue) {
                        return null;
                      } else if (active === 3 && !isAlumni?.booleanValue) {
                        return null;
                      } else {
                        return (
                          <tr key={item._id}>
                            <td>
                              <a href={item?.profileImage} target="_blank">
                                <img
                                  src={item?.profileImage}
                                  alt="Profile Image"
                                  style={{ width: "80px" }}
                                />
                              </a>
                            </td>
                            <td>
                              {name?.stringValue}
                              {isAlumni?.booleanValue && (
                                <div className="fw-bold text-danger">
                                  (Alumni)
                                </div>
                              )}
                            </td>
                            <td>
                              <a
                                href={"mailto:" + email?.stringValue}
                                target="_blank"
                              >
                                {email?.stringValue || "N/A"}
                              </a>
                            </td>
                            <td>{batch?.stringValue || "N/A"}</td>
                            <td>{mobile?.stringValue}</td>
                            <td>
                              <ol>
                                {researchInterests?.arrayValue?.values?.map(
                                  (ri: any, i_: any) => {
                                    return <li key={i_}>{ri.stringValue}</li>;
                                  }
                                )}
                              </ol>
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
                                      onClick={() => deletephd(item._id)}
                                    >
                                      Delete
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    })}
                  {(active === 2 || active === 4) &&
                    getpgug?.map((item: any, index: number) => {
                      const {
                        name,
                        batch,
                        isAlumni,
                        email,
                        mobile,
                        degree,
                        currentlyWorkingAt,
                      } = item?.data;
                      if (active === 2 && isAlumni?.booleanValue) {
                        return null;
                      } else if (active === 4 && !isAlumni?.booleanValue) {
                        return null;
                      } else {
                        return (
                          <tr key={item._id}>
                            <td>
                              {name?.stringValue}
                              {isAlumni?.booleanValue && (
                                <div className="fw-bold text-danger">
                                  (Alumni)
                                </div>
                              )}
                            </td>
                            <td>
                              <a
                                href={"mailto:" + email?.stringValue}
                                target="_blank"
                              >
                                {email?.stringValue || "N/A"}
                              </a>
                            </td>
                            <td>{degree?.stringValue || "N/A"}</td>
                            <td>{batch?.stringValue || "N/A"}</td>
                            <td>{mobile?.stringValue}</td>
                            <td>{currentlyWorkingAt?.stringValue}</td>
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
                                      onClick={() => deletepgug(item._id)}
                                    >
                                      Delete
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    })}
                  {active === 5 &&
                    getvisitorsandinterns?.map((item: any, index: number) => {
                      const { name, collegeName } = item?.data;
                      return (
                        <tr key={item._id}>
                          <td>{name?.stringValue}</td>
                          <td>{collegeName?.stringValue}</td>
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
                                    onClick={() => deletevisinterns(item._id)}
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
              {!getvisitorsandinterns.length && active === 5 && (
                <>
                  <div className="w-100 text-center">
                    <h3 className="fw-bold text-danger">Not Found!</h3>
                  </div>
                </>
              )}
              {!getphd.length && (active === 1 || active === 3) && (
                <>
                  <div className="w-100 text-center">
                    <h3 className="fw-bold text-danger">Not Found!</h3>
                  </div>
                </>
              )}
              {!getpgug.length && (active === 2 || active === 4) && (
                <>
                  <div className="w-100 text-center">
                    <h3 className="fw-bold text-danger">Not Found!</h3>
                  </div>
                </>
              )}
            </div>
          </>
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
                Add New People
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
                  <label htmlFor="designation" className="form-label">
                    Designation
                  </label>
                  <select
                    name="designation"
                    className="form-control border-2 border-primary"
                    onChange={(e) => setDesignation(e.target.value)}
                  >
                    <option value="">--select designation--</option>
                    <option value="Ph.D. Scholars">Ph.D. Scholars</option>
                    <option value="Post Graduate students">
                      Post Graduate students
                    </option>
                    <option value="Alumni Ph.D.">Alumni Ph.D.</option>
                    <option value="Alumni Masters and Bachelors">
                      Alumni Masters and Bachelors
                    </option>
                    <option value="Visitors and Interns">
                      Visitors and Interns
                    </option>
                  </select>
                </div>
                <hr />
                <div className="mb-2">
                  {(designation === "Ph.D. Scholars" ||
                    designation === "Alumni Ph.D.") && <AddPhd />}
                  {(designation === "Post Graduate students" ||
                    designation === "Alumni Masters and Bachelors") && (
                    <ADDPGUS />
                  )}
                  {designation === "Visitors and Interns" && (
                    <VisitorsAndInterns />
                  )}
                </div>
              </>
            </div>
            {/* <div className="modal-footer">
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
                // onClick={submitHandler}
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
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Peoples;

const AddPhd = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [batch, setBatch] = useState("");
  const [researchInterests, setResearchInterests] = useState("");
  const [isAlumni, setIsAlumni] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File>();

  const submitHandler = async (event: any) => {
    event.preventDefault();

    if (!name || !email || !mobile || !batch || !researchInterests) {
      alert("Please fill all required fields.");
      return;
    }
    if (!image) {
      console.log("Please upload a profile image.");
      return;
    }
    setLoading(true);
    const storageRef = ref(
      storage,
      `/peoples/phd_profile_images/${name}_${image.name}`
    );
    await uploadBytes(storageRef, image).then(async () => {
      console.log("Profile image uploaded successfully");
      addDoc(collection(db, "phdStudents"), {
        name: name,
        email: email,
        mobile: mobile,
        batch: batch,
        researchInterests: researchInterests
          .split(",")
          .map((interest) => interest.trim()),
        isAlumni: isAlumni,
        profileImage: name + "_" + image.name,
      })
        .then(() => {
          alert("PhD student data has been saved!");
          setName("");
          setEmail("");
          setMobile("");
          setBatch("");
          setResearchInterests("");
          setIsAlumni(false);
          setLoading(false);
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error saving PhD student data:", error);
          setLoading(false);
        });
    });
  };
  return (
    <>
      <form onSubmit={submitHandler} noValidate>
        <div className="mb-1 row">
          <div className="col">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="ie. Mr. X"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col">
            <label htmlFor="name">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ie. user@gmail.com"
            />
          </div>
        </div>
        <div className="mb-1 row">
          <div className="col">
            <label htmlFor="name">Mobile</label>
            <input
              type="number"
              className="form-control"
              name="mobille"
              max={9999999999}
              min={0}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="ie. 10 digits mobile number"
            />
          </div>
          <div className="col">
            <label htmlFor="name">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              name="email"
              onChange={(event) => {
                const file = event.target.files?.[0];
                setImage(file);
              }}
              disabled={loading}
            />
          </div>
          <div className="col">
            <label htmlFor="name">Batch</label>
            <input
              type="number"
              max={2050}
              min={1867}
              className="form-control"
              placeholder="ie. 2020"
              onChange={(e) => setBatch(e.target.value)}
            />
          </div>
        </div>
        <div className="mb-1">
          <label htmlFor="name">Research Interests(Comma Separated)</label>
          <input
            type="text"
            className="form-control"
            name="email"
            placeholder="ie. AI, ML, IoT"
            onChange={(e) => setResearchInterests(e.target.value)}
          />
        </div>
        <div className="mb-1 mt-2">
          <div className="form-control rounded-0 border-1 border-dark">
            <input
              type="checkbox"
              className="form-check-input bg-bg-danger me-2"
              id="alumni"
              onChange={(e) => setIsAlumni(e.target.checked)}
            />
            <label
              htmlFor="alumni"
              className="text-danger"
              style={{ userSelect: "none", cursor: "pointer" }}
            >
              Is this student is Alumni?
            </label>
          </div>
        </div>
        <div className="mb-1 mt-3">
          <button
            type="submit"
            className="btn btn-dark w-100"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </>
  );
};

const ADDPGUS = () => {
  const [degree, setDegree] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [batch, setBatch] = useState("");
  const [currentlyWorkingAt, setCurrentlyWorkingAt] = useState("");
  const [isAlumni, setIsAlumni] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitHandler = (event: any) => {
    event.preventDefault();

    if (
      !degree ||
      !name ||
      !email ||
      !mobile ||
      !batch ||
      !currentlyWorkingAt
    ) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);

    addDoc(collection(db, "pgusStudents"), {
      degree: degree,
      name: name,
      email: email,
      mobile: mobile,
      batch: batch,
      currentlyWorkingAt: currentlyWorkingAt,
      isAlumni: isAlumni,
    })
      .then(() => {
        alert("PG/UG student data has been saved!");
        setDegree("");
        setName("");
        setEmail("");
        setMobile("");
        setBatch("");
        setCurrentlyWorkingAt("");
        setIsAlumni(false);
        setLoading(false);
        location.reload();
      })
      .catch((error) => {
        console.error("Error saving PG/UG student data:", error);
        setLoading(false);
      });
  };

  return (
    <>
      <form onSubmit={submitHandler} noValidate>
        <div className="mb-1 row">
          <div className="col">
            <label htmlFor="degree">Select UG or PG</label>
            <select
              name="degree"
              className="form-control"
              id="degree"
              onChange={(e) => setDegree(e.target.value)}
            >
              <option value="">--select--</option>
              <option value="B.Tech">B.Tech</option>
              <option value="M.Tech">M.Tech</option>
            </select>
          </div>
          <div className="col">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              onChange={(e) => setName(e.target.value)}
              placeholder="ie. Mr. X"
            />
          </div>
          <div className="col">
            <label htmlFor="name">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="ie. user_@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="mb-1 row">
          <div className="col">
            <label htmlFor="name">Mobile</label>
            <input
              type="number"
              className="form-control"
              name="mobille"
              max={9999999999}
              min={0}
              placeholder="ie. 10 digits mobile number"
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
          <div className="col">
            <label htmlFor="name">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              name="email"
              disabled
            />
          </div>
          <div className="col">
            <label htmlFor="name">Batch</label>
            <input
              type="number"
              max={2050}
              min={1867}
              className="form-control"
              placeholder="ie. 2020"
              onChange={(e) => setBatch(e.target.value)}
            />
          </div>
        </div>
        <div className="mb-1">
          <label htmlFor="name">Currently Working At</label>
          <input
            type="text"
            className="form-control"
            name="email"
            placeholder="ie. Company or Organisation name"
            onChange={(e) => setCurrentlyWorkingAt(e.target.value)}
          />
        </div>
        <div className="mb-1 mt-2">
          <div className="form-control rounded-0 border-1 border-dark">
            <input
              type="checkbox"
              className="form-check-input bg-bg-danger me-2"
              id="alumni"
              onChange={(e) => setIsAlumni(e.target.checked)}
            />
            <label
              htmlFor="alumni"
              className="text-danger"
              style={{ userSelect: "none", cursor: "pointer" }}
            >
              Is this student is Alumni?
            </label>
          </div>
        </div>
        <div className="mb-1 mt-3">
          <button
            type="submit"
            className="btn btn-dark w-100"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </>
  );
};

const VisitorsAndInterns = () => {
  const [name, setName] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = (event: any) => {
    event.preventDefault();

    if (!name || !collegeName) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);

    addDoc(collection(db, "visitorsAndInterns"), {
      name: name,
      collegeName: collegeName,
    })
      .then(() => {
        alert("Visitor/Intern data has been saved!");
        setName("");
        setCollegeName("");
        setLoading(false);
        location.reload();
      })
      .catch((error) => {
        console.error("Error saving Visitor/Intern data:", error);
        setLoading(false);
      });
  };
  return (
    <>
      <form onSubmit={submitHandler} noValidate>
        <div className="mb-1 row">
          <div className="col">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              onChange={(e) => setName(e.target.value)}
              placeholder="ie. Mr. X"
            />
          </div>
          <div className="col">
            <label htmlFor="name">College Name</label>
            <input
              type="text"
              className="form-control"
              name="email"
              onChange={(e) => setCollegeName(e.target.value)}
              placeholder="ie. Chandigarh Univeristy"
            />
          </div>
        </div>
        <div className="mb-1 mt-3">
          <button
            type="submit"
            className="btn btn-dark w-100"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </>
  );
};
