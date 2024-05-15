import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, storage } from "../../../firebase";
import { ref, uploadBytes } from "firebase/storage";
import { useSelector } from "react-redux";
import { addAlert } from "../../components/alert/push.alert";
import { fetchphd } from "../../../services/firebase/getphd";
import { Link } from "react-router-dom";

interface UserDataType {
  name: string;
  email: string;
  personal_email: string;
  phone: string;
  researchInterests: string;
  introduction: string;
  current_position: string;
  address: string;
  research_collaborators: string;
  recent: { text: string; year: string; month: string }[];
  awards: string[];
  educations: {
    education_title: string;
    subject: string;
    university: string;
    supervisor?: string;
    start_month: string;
    start_year: string;
    end_month: string;
    end_year: string;
  }[];
  links: { linkName: string; linkURL: string }[];
}
const intialState: UserDataType = {
  name: "",
  email: "",
  phone: "",
  researchInterests: "",
  introduction: "",
  links: [],
  personal_email: "",
  address: "",
  awards: [],
  current_position: "",
  educations: [],
  recent: [],
  research_collaborators: "",
};
const ProfilePHD: React.FC = () => {
  const getauth = useSelector((state: any) => state.getauth);
  const getphd = useSelector((state: any) => state.getphdStudents)?.data;
  const getphd_ = getphd?.filter(
    (item_: any) => item_?.data?.email?.stringValue === getauth?.email
  )[0];
  let researchInterests__ = "";
  getphd_?.data?.researchInterests?.arrayValue?.values.map((interest: any) => {
    let x = researchInterests__ === "" ? "" : ",";
    researchInterests__ = researchInterests__ + x + interest?.stringValue;
  });
  let links_data: { linkName: string; linkURL: string }[] = [];
  getphd_?.data?.links?.arrayValue?.values.map((item_: any) => {
    links_data.push({
      linkName: item_?.mapValue?.fields?.linkName?.stringValue,
      linkURL: item_?.mapValue?.fields?.linkURL?.stringValue,
    });
  });
  let awards_data: string[] = [];
  getphd_?.data?.awards?.arrayValue?.values.map((item_: any) => {
    awards_data.push(item_?.stringValue);
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<File>();
  const [userData, setUserData] = useState<UserDataType>({
    name: getphd_?.data?.name?.stringValue,
    email: getphd_?.data?.email?.stringValue,
    phone: getphd_?.data?.mobile?.stringValue,
    researchInterests: researchInterests__,
    introduction: getphd_?.data?.introduction?.stringValue,
    links: links_data || [],
    personal_email: getphd_?.data?.personal_email?.stringValue || "",
    address: getphd_?.data?.address?.stringValue || "",
    awards: awards_data || [],
    current_position: getphd_?.data?.current_position?.stringValue || "",
    educations: getphd_?.data?.educations?.stringValue || [],
    recent: getphd_?.data?.recent?.stringValue || [],
    research_collaborators:
      getphd_?.data?.research_collaborators?.stringValue || "",
  });
  const [linkInput, setLinkInput] = useState<{
    linkName: string;
    linkURL: string;
  }>({
    linkName: "",
    linkURL: "",
  });
  const [awardInput, setAwardInput] = useState<string>("");
  useEffect(() => {
    const fn = async () => {
      await fetchphd();
      setUserData({
        name: getphd_?.data?.name?.stringValue,
        email: getphd_?.data?.email?.stringValue,
        phone: getphd_?.data?.mobile?.stringValue,
        researchInterests: researchInterests__,
        introduction: getphd_?.data?.introduction?.stringValue,
        links: links_data || [],
        personal_email: getphd_?.data?.personal_email?.stringValue || "",
        address: getphd_?.data?.address?.stringValue || "",
        awards: awards_data || [],
        current_position: getphd_?.data?.current_position?.stringValue || "",
        educations: getphd_?.data?.educations?.stringValue || [],
        recent: getphd_?.data?.recent?.stringValue || [],
        research_collaborators:
          getphd_?.data?.research_collaborators?.stringValue || "",
      });
    };
    fn();
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
    setLoading(true);
    const docRef = doc(db, "phdStudents", getphd_?._id);
    if (!image) {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const updatedData = {
            ...docSnap.data(),
            ...userData,
            researchInterests: userData.researchInterests
              .split(",")
              .map((interest) => interest.trim()),
          };
          await updateDoc(docRef, updatedData);
          addAlert("success", "Document successfully updated!");
        } else {
          addAlert("danger", "No such document exists!");
        }
        setUserData(intialState);
        setImage(undefined);
        setLoading(false);
        window.location.reload(); // You might want to handle the page reload differently
      } catch {
        addAlert(
          "danger",
          "Error! While editing the profile, Check you internet connnection and Try Again later."
        );
        setLoading(false);
      }
    } else {
      const storageRef = ref(
        storage,
        `/peoples/phd_profile_images/${userData.name}_${image.name}`
      );
      await uploadBytes(storageRef, image)
        .then(async () => {
          addAlert("success", "Profile image uploaded successfully");
          try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const updatedData = {
                ...docSnap.data(),
                ...userData,
                researchInterests: userData.researchInterests
                  .split(",")
                  .map((interest) => interest.trim()),
                profileImage: userData.name + "_" + image.name,
              };
              await updateDoc(docRef, updatedData);
              addAlert("success", "Document successfully updated!");
            } else {
              addAlert("danger", "No such document exists!");
            }
            setUserData(intialState);
            setImage(undefined);
            setLoading(false);
            window.location.reload(); // You might want to handle the page reload differently
          } catch {
            addAlert(
              "danger",
              "Error! While editing the profile, Check you internet connnection and Try Again later."
            );
            setLoading(false);
          }
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
  return (
    <>
      <div className="col-sm-12 col-md-10 col-lg-10 col-xl-10 px-5">
        <div className="w-100 d-flex justify-content-between">
          <h3>Your Profile</h3>
          <button
            className="btn btn-dark btn-sm rounded-0"
            data-bs-toggle="modal"
            data-bs-target="#AddPeopleModel"
          >
            Edit Profile
          </button>
        </div>
        <hr />
        <div className="overflow-auto mt-3">
          <table className="table table-bordered table-hover">
            <tbody>
              <tr>
                <td colSpan={1}>
                  <a href={getphd_?.profileImage} target="_blank">
                    <img
                      src={getphd_?.profileImage}
                      alt="Profile Image"
                      style={{ width: "120px" }}
                    />
                  </a>
                </td>
                <td colSpan={7}>
                  <h5>{getphd_?.data?.name?.stringValue}</h5>
                  {getphd_?.data?.isAlumni?.booleanValue ? (
                    <div className="fw-bold text-shade2">Alumni Student</div>
                  ) : (
                    <div className="fw-bold text-shade2">Ongoing Student</div>
                  )}
                  {getphd_?.data?.current_position?.stringValue}
                  <hr />
                  {getphd_?.data?.address?.stringValue}
                </td>
              </tr>
              <tr>
                <td>
                  <strong className="text-shade2">Name</strong>
                </td>
                <td>{getphd_?.data?.name?.stringValue}</td>
                <td colSpan={3}>
                  <strong className="text-shade2">Email</strong>
                </td>
                <td>{getphd_?.data?.email?.stringValue}</td>
                <td>
                  {" "}
                  <strong className="text-shade2">Batch</strong>
                </td>
                <td>{getphd_?.data?.batch?.stringValue || "N/A"}</td>
              </tr>
              <tr>
                <td>
                  <strong className="text-shade2">Supervisor</strong>
                </td>
                <td>
                  <div>
                    <strong>Name: </strong>
                    {
                      getphd_?.data?.supervisor?.mapValue?.fields?.name
                        ?.stringValue
                    }
                    , <strong>Email: </strong>
                    {
                      getphd_?.data?.supervisor?.mapValue?.fields?.email
                        ?.stringValue
                    }
                  </div>
                </td>
                <td>
                  {" "}
                  <strong className="text-shade2">Mobile</strong>
                </td>
                <td colSpan={3}>
                  {getphd_?.data?.mobile?.stringValue || "N/A"}
                </td>
                <td>
                  {" "}
                  <strong className="text-shade2">Personal Email</strong>
                </td>
                <td colSpan={3}>
                  {getphd_?.data?.personal_email?.stringValue || "N/A"}
                </td>
              </tr>
              <tr>
                <td colSpan={1}>
                  <strong className="text-shade2">
                    Research Collaborators
                  </strong>
                </td>
                <td colSpan={7}>
                  <div className="d-flex flex-wrap gap-2">
                    {getphd_?.data?.research_collaborators?.stringValue}
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={1}>
                  <strong className="text-shade2">Research Interests</strong>
                </td>
                <td colSpan={7}>
                  <div className="d-flex flex-wrap gap-2">
                    {getphd_?.data?.researchInterests?.arrayValue?.values?.map(
                      (ri: any, i_: any) => {
                        return (
                          <Link
                            to={
                              "https://www.google.com/search?q=" +
                              ri?.stringValue
                            }
                            target="_blank"
                            style={{ textDecoration: "none" }}
                          >
                            <small
                              className="alert alert-success p-1 me-2 rounded-3 text-nowrap"
                              style={{ width: "fit-content" }}
                              key={i_}
                            >
                              {ri?.stringValue}
                            </small>
                          </Link>
                        );
                      }
                    )}
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={1}>
                  <strong className="text-shade2">Introduction</strong>
                </td>
                <td colSpan={7}>{getphd_?.data?.introduction?.stringValue}</td>
              </tr>
              <tr>
                <td colSpan={1}>
                  <strong className="text-shade2">Profile Links</strong>
                </td>
                <td colSpan={7}>
                  {links_data.map((link: any) => {
                    return (
                      <button
                        className="btn btn-success btn-sm me-1"
                        onClick={() => window.open(link?.linkURL, "_blank")}
                      >
                        {link?.linkName}
                      </button>
                    );
                  })}
                </td>
              </tr>
              <tr>
                <td colSpan={1}>
                  <strong className="text-shade2">Awards</strong>
                </td>
                <td colSpan={7}>
                  <ol>
                    {awards_data.map((award: any) => {
                      return <li>{award}</li>;
                    })}
                  </ol>
                </td>
              </tr>
            </tbody>
          </table>
        </div>{" "}
        <EducationDetails getphd_={getphd_} />
      </div>

      <div
        className="modal fade"
        id="AddPeopleModel"
        tabIndex={-1}
        aria-labelledby={"AddPeopleModelLabel"}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content rounded-0 border-none">
            <div className="modal-header">
              <h5 className="modal-title" id={"AddPeopleModelLabel"}>
                Edit Profile
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
                <div className="mb-2 row">
                  <div className="col overflow-auto">
                    <label htmlFor="name" className="form-label">
                      Name{" "}
                      <strong className="text-shade2">
                        *(You can't change name)
                      </strong>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="ie. Dr. XYZ"
                      name="name"
                      value={userData.name}
                      onChange={handleChange}
                      disabled
                    />
                  </div>
                  <div className="col overflow-auto">
                    <label htmlFor="email" className="form-label">
                      Email{" "}
                      <strong className="text-shade2">
                        *(You can't change email)
                      </strong>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="ie. user@gmail.com"
                      name="email"
                      value={userData.email}
                      onChange={handleChange}
                      disabled
                    />
                  </div>
                  <div className="col overflow-auto">
                    <label htmlFor="email" className="form-label">
                      Personal Email
                      <strong className="text-shade2">*(Optional)</strong>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="ie. user@gmail.com"
                      name="personal_email"
                      value={userData.personal_email}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>

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
                    <label htmlFor="current_position" className="form-label">
                      Current Position
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="School of Computing
                      National University of Singapore (NUS)
                      "
                      name="current_position"
                      value={userData.current_position}
                      onChange={handleChange}
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
                {/* research_collaborators */}
                <div className="mb-2">
                  <label htmlFor="researchInterests" className="form-label">
                    Research Collaborators (Comma Separated)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="ie.  Prof. X, Prof. Y"
                    name="research_collaborators"
                    value={userData.research_collaborators}
                    onChange={handleChange}
                  />
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
                    rows={4}
                    placeholder="A brief introduction about the Supervisor"
                    name="introduction"
                    value={userData.introduction}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="type here.."
                    name="address"
                    value={userData?.address}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="date" className="form-label">
                    Add Awards
                  </label>
                  <div className="col-sm-12 d-flex justify-content-between flex-nowrap">
                    <div className="col-sm-10 pe-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="type here award.."
                        onChange={(e) => setAwardInput(e.target.value)}
                        value={awardInput ? awardInput : ""}
                      />
                    </div>
                    <div className="col-sm-2 ps-3">
                      <button
                        className="btn btn-shade1 w-100"
                        onClick={() => {
                          if (!awardInput) {
                            addAlert(
                              "danger",
                              "Award Input is required field."
                            );
                            return;
                          }
                          if (userData.awards.includes(awardInput)) {
                            addAlert("danger", "This link already exists.");
                            return;
                          }
                          setUserData({
                            ...userData,
                            awards: [...userData.awards, awardInput],
                          });
                          setAwardInput("");
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
                          Award
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
                      {userData?.awards?.map((item: any, i_: any) => {
                        return (
                          <tr>
                            <th>{i_ + 1}</th>
                            <th>{item}</th>
                            <th>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => {
                                  if (confirm("Are you sure want to remove?")) {
                                    setUserData({
                                      ...userData,
                                      awards: userData?.awards.filter(
                                        (i__) => i__ !== item
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
                  {!userData?.awards.length && (
                    <>
                      <div className="w-100 text-center">
                        <h5 className="text-shade2">Nothing Added Yet!</h5>
                      </div>
                    </>
                  )}
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

export default ProfilePHD;

interface EducationInterface {
  education_title: string;
  subject: string;
  university: string;
  supervisor?: string;
  start_month: string;
  start_year: string;
  end_month: string;
  end_year: string;
}
const intitialEducation: EducationInterface = {
  education_title: "",
  end_month: "",
  end_year: "",
  start_month: "",
  start_year: "",
  subject: "",
  university: "",
  supervisor: "",
};
const EducationDetails: React.FC<{ getphd_: any }> = ({ getphd_ }) => {
  let educations: EducationInterface[] = [];
  getphd_?.data?.educations?.arrayValue?.values?.map((item_: any) => {
    educations.push({
      education_title: item_?.mapValue?.fields?.education_title?.stringValue,
      end_month: item_?.mapValue?.fields?.end_month?.stringValue,
      end_year: item_?.mapValue?.fields?.end_year?.stringValue,
      start_month: item_?.mapValue?.fields?.start_month?.stringValue,
      start_year: item_?.mapValue?.fields?.start_year?.stringValue,
      subject: item_?.mapValue?.fields?.subject?.stringValue,
      university: item_?.mapValue?.fields?.university?.stringValue,
      supervisor: item_?.mapValue?.fields?.supervisor?.stringValue,
    });
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [educationInput, setEducationInput] =
    useState<EducationInterface>(intitialEducation);
  const currentYear = new Date().getFullYear();
  const years: number[] = Array.from(
    { length: currentYear - 1949 },
    (_, index) => 1950 + index
  ).sort((a, b) => b - a);
  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setEducationInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const submitHandler = async () => {
    if (
      !educationInput.education_title ||
      !educationInput.university ||
      !educationInput.subject ||
      !educationInput.start_month ||
      !educationInput.start_year ||
      !educationInput.end_month ||
      !educationInput.end_year
    ) {
      addAlert("danger", "Education Input Details are required.");
      return;
    }
    if (Number(educationInput.start_year) > Number(educationInput.end_year)) {
      addAlert("danger", "Starting Year can not be greater than Ending Year.");
      return;
    }
    setLoading(true);
    try {
      if (
        educations.some(
          (edu) => edu.education_title === educationInput.education_title
        )
      ) {
        addAlert(
          "danger",
          "Education Details with same title is already existed."
        );
        setLoading(false);
        return;
      }
      const docRef = doc(db, "phdStudents", getphd_?._id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const updatedData = {
          ...docSnap.data(),
          educations: [...educations, educationInput],
        };
        await updateDoc(docRef, updatedData);
        addAlert("success", "Document successfully updated!");
      } else {
        addAlert("danger", "No such document exists!");
      }
      setLoading(false);
      window.location.reload();
    } catch {
      addAlert("danger", "Error! Something went wrong.");
      setLoading(false);
    }
    setEducationInput(intitialEducation);
  };
  const deleteEducation = async (education_title: string) => {
    if (!confirm("Are you sure want to delete?")) {
      return;
    }
    setLoading(true);
    try {
      const new_education = educations.filter(
        (edu: EducationInterface) => edu.education_title !== education_title
      );
      const docRef = doc(db, "phdStudents", getphd_?._id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const updatedData = {
          ...docSnap.data(),
          educations: new_education,
        };
        await updateDoc(docRef, updatedData);
        addAlert("success", "Document successfully deleted!");
      } else {
        addAlert("danger", "No such document exists!");
      }
      setLoading(false);
      window.location.reload();
    } catch {
      addAlert("danger", "Error! Something went wrong.");
      setLoading(false);
    }
  };
  return (
    <>
      <div className="w-100 d-flex justify-content-between mt-4">
        <h3>Education Details</h3>
        <button
          className="btn btn-dark btn-sm rounded-0"
          data-bs-toggle="modal"
          data-bs-target="#AddEducationModel"
        >
          + Add Education
        </button>
      </div>
      <hr />
      <div className="overflow-auto mt-3 mb-5">
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
                Subject/Stream
              </th>
              <th
                scope="col"
                className="top-0 position-sticky bg-dark text-white border-1 border-dark"
              >
                University/College
              </th>
              <th
                scope="col"
                className="top-0 position-sticky bg-dark text-white border-1 border-dark"
              >
                Duration
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
            {educations &&
              educations?.map(
                (education: EducationInterface, index: number) => {
                  return (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{education?.education_title}</td>
                      <td>{education?.subject}</td>
                      <td>
                        {education?.university}
                        {education?.supervisor && (
                          <>
                            <hr />
                            <strong>Supervisor: </strong>
                            {education?.supervisor}
                          </>
                        )}
                      </td>
                      <td>
                        <strong>
                          {education?.start_month} {education?.start_year}
                        </strong>{" "}
                        to{" "}
                        <strong>
                          {education?.end_month} {education?.end_year}
                        </strong>{" "}
                        (
                        {Number(education?.end_year) -
                          Number(education?.start_year)}{" "}
                        Years )
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          disabled={loading}
                          onClick={() =>
                            deleteEducation(education?.education_title)
                          }
                        >
                          {loading ? "Wait.." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                }
              )}
          </tbody>
        </table>
        {!educations.length && (
          <>
            <div className="w-100 text-center">
              <h3 className="fw-bold text-shade2">Not Found!</h3>
            </div>
          </>
        )}
      </div>

      <div
        className="modal fade"
        id="AddEducationModel"
        tabIndex={-1}
        aria-labelledby={"AddEducationModelLabel"}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content rounded-0 border-none">
            <div className="modal-header">
              <h5 className="modal-title" id={"AddEducationModelLabel"}>
                Add Education
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
                <div className="mb-2 row">
                  <div className="col">
                    {" "}
                    <label htmlFor="education_title" className="form-label">
                      Education Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="ie.  Ph.D."
                      name="education_title"
                      onChange={handleChange}
                      value={educationInput.education_title}
                      disabled={loading}
                    />
                  </div>
                  <div className="col">
                    {" "}
                    <label htmlFor="supervisor" className="form-label">
                      Supervisor (if any)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="ie.  Dr. X"
                      name="supervisor"
                      onChange={handleChange}
                      value={educationInput.supervisor}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col">
                    {" "}
                    <label htmlFor="subject" className="form-label">
                      Stream/Subject
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="ie.  Computer Vision"
                      name="subject"
                      onChange={handleChange}
                      value={educationInput.subject}
                      disabled={loading}
                    />
                  </div>
                  <div className="col">
                    {" "}
                    <label htmlFor="university" className="form-label">
                      University/College Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="ie.  IIT Ropar"
                      name="university"
                      onChange={handleChange}
                      value={educationInput.university}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="mb-2 row">
                  <div className="col">
                    <label htmlFor="start_month" className="form-label">
                      Starting Month
                    </label>
                    <select
                      name="start_month"
                      className="form-control"
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="">--select start month--</option>
                      {months?.map((month: string, index: number) => {
                        return (
                          <option value={month} key={index}>
                            {month}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="col">
                    <label htmlFor="start_year" className="form-label">
                      Starting Year
                    </label>
                    <select
                      name="start_year"
                      className="form-control"
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="">--select start year--</option>
                      {years?.map((year: number, index: number) => {
                        return (
                          <option value={year} key={index}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className="mb-2 row">
                  <div className="col">
                    <label htmlFor="end_month" className="form-label">
                      Ending Month
                    </label>
                    <select
                      name="end_month"
                      className="form-control"
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="">--select end month--</option>
                      {months?.map((month: string, index: number) => {
                        return (
                          <option value={month} key={index}>
                            {month}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="col">
                    <label htmlFor="end_year" className="form-label">
                      Ending Year
                    </label>
                    <select
                      name="end_year"
                      className="form-control"
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="">--select end year--</option>
                      {years?.map((year: number, index: number) => {
                        return (
                          <option value={year} key={index}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
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

const months: string[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
