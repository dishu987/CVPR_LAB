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
  links: { linkName: string; linkURL: string }[];
}

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
  });
  const [linkInput, setLinkInput] = useState<{
    linkName: string;
    linkURL: string;
  }>({
    linkName: "",
    linkURL: "",
  });
  useEffect(() => {
    fetchphd();
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
          console.log("Document successfully updated!");
        } else {
          console.log("No such document exists!");
        }
        setUserData({
          name: "",
          email: "",
          phone: "",
          researchInterests: "",
          introduction: "",
          links: [],
          personal_email: "",
        });
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
              console.log("No such document exists!");
            }
            setUserData({
              name: "",
              email: "",
              phone: "",
              researchInterests: "",
              introduction: "",
              links: [],
              personal_email: "",
            });
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
                  {getphd_?.data?.isAlumni?.booleanValue ? (
                    <div className="fw-bold text-danger">Alumni Student</div>
                  ) : (
                    <div className="fw-bold text-danger">Ongoing Student</div>
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  <strong className="text-danger">Name</strong>
                </td>
                <td>{getphd_?.data?.name?.stringValue}</td>
                <td colSpan={3}>
                  <strong className="text-danger">Email</strong>
                </td>
                <td>{getphd_?.data?.email?.stringValue}</td>
                <td>
                  {" "}
                  <strong className="text-danger">Batch</strong>
                </td>
                <td>{getphd_?.data?.batch?.stringValue || "N/A"}</td>
              </tr>
              <tr>
                <td>
                  <strong className="text-danger">Supervisor</strong>
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
                  <strong className="text-danger">Mobile</strong>
                </td>
                <td colSpan={3}>
                  {getphd_?.data?.mobile?.stringValue || "N/A"}
                </td>
                <td>
                  {" "}
                  <strong className="text-danger">Personal Email</strong>
                </td>
                <td colSpan={3}>
                  {getphd_?.data?.personal_email?.stringValue || "N/A"}
                </td>
              </tr>
              <tr>
                <td colSpan={1}>
                  <strong className="text-danger">Research Interests</strong>
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
                  <strong className="text-danger">Introduction</strong>
                </td>
                <td colSpan={7}>{getphd_?.data?.introduction?.stringValue}</td>
              </tr>
              <tr>
                <td colSpan={1}>
                  <strong className="text-danger">Links</strong>
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
            </tbody>
          </table>
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
                      <strong className="text-danger">
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
                      <strong className="text-danger">
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
                      <strong className="text-danger">*(Optional)</strong>
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
                        className="btn btn-danger w-100"
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
                        <h5 className="text-danger">Nothing Added Yet!</h5>
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
