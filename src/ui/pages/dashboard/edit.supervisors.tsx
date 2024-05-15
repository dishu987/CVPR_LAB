import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, storage } from "../../../firebase";
import { deleteObject, ref, uploadBytes } from "firebase/storage";
import { fetchSupervisors } from "../../../services/firebase/getsupervisors";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
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

const SupervisorsEdit: React.FC = () => {
  const { id } = useParams();
  const getsupervisors = useSelector((state: any) => state.getsupervisors.data);
  const supervisor_ = getsupervisors?.filter(
    (item_: any) => item_?._id == id
  )[0];
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<File>();
  const [userData, setUserData] = useState<UserDataType>({
    name: supervisor_?.data?.name,
    email: supervisor_?.data?.email,
    phone: supervisor_?.data?.phone,
    researchInterests: supervisor_?.data?.researchInterests,
    introduction: supervisor_?.data?.introduction,
    accomplishments: supervisor_?.data?.accomplishments,
    designation: supervisor_?.data?.designation,
    professional_affiliation: supervisor_?.data?.professional_affiliation,
    teaching: supervisor_?.data?.teaching,
    links: supervisor_?.data?.links,
  });
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
      accomplishments,
      designation,
      links,
      professional_affiliation,
      teaching,
    } = userData;

    if (
      !name ||
      !email ||
      !phone ||
      !researchInterests ||
      !introduction ||
      !accomplishments ||
      !designation ||
      !links ||
      !professional_affiliation ||
      !teaching
    ) {
      addAlert("danger", "Error! Please fill all required fields.");
      return;
    }

    setLoading(true);

    const docRef = doc(db, "supervisors", supervisor_?._id);

    if (image) {
      if (supervisor_ && supervisor_.data && supervisor_.data.profileImage) {
        const oldImageRef = ref(
          storage,
          `/peoples/supervisor_profile_images/${supervisor_?.data?.profileImage?.stringValue}`
        );

        try {
          await deleteObject(oldImageRef);
        } catch {}
      }
      const storageRef = ref(
        storage,
        `/peoples/supervisor_profile_images/${name}_${image.name}`
      );

      try {
        await uploadBytes(storageRef, image);
        addAlert("info", "Profile image uploaded successfully");

        const imageUrl = `${name}_${image.name}`;

        await updateDoc(docRef, {
          ...userData,
          profileImage: imageUrl,
        });
        addAlert(
          "success",
          "Supervisor details updated with profile image successfully."
        );
        window.location.href =
          import.meta.env.VITE_APP_redirect_rules + "#/dashboard";
      } catch (err) {
        addAlert(
          "warning",
          "Error! while uploading profile image, check your internet connection and try again."
        );
        setLoading(false);
        return;
      }
    } else {
      try {
        await updateDoc(docRef, {
          ...userData,
        });
        addAlert("success", "Supervisor details updated successfully!");
        window.location.href =
          import.meta.env.VITE_APP_redirect_rules + "#/dashboard";
      } catch (error) {
        addAlert("danger", "Error updating supervisor details.");
        setLoading(false);
        return;
      }
    }
    setLoading(false);
  };
  if (!supervisor_) {
    window.history.back();
    return;
  }
  return (
    <>
      <div className="col-sm-12 col-md-10 col-lg-10 col-xl-10 px-5">
        <div className="w-100 d-flex justify-content-between">
          <h3>Edit Supervisor</h3>
          <button
            className="btn btn-shade1 btn-sm rounded-0"
            onClick={() => {
              window.history.back();
            }}
          >
            Back to Supervisors
          </button>
        </div>
        <hr />
        <>
          <div className="col-sm-12 mb-3">
            <div className="col-sm-2">
              {" "}
              <div className="card p-2">
                <img
                  src={supervisor_?.profileImage}
                  alt=""
                  className="rounded-1"
                />
              </div>
            </div>
          </div>
          <div className="mb-2">
            <label htmlFor="name" className="form-label">
              Name (
              <span className="text-shade2">you can't modify this field</span>)
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
          <div className="mb-2 row">
            <div className="col overflow-auto">
              <label htmlFor="email" className="form-label">
                Email (
                <span className="text-shade2">you can't modify this field</span>
                )
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
                Profile Image (
                <span className="text-shade2">aspect ratio 3:4 only</span>)
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
              Research Interests (
              <span className="text-shade2">
                Use comma separated for multiple
              </span>
              )
            </label>
            <textarea
              className="form-control"
              placeholder="ie.  Machine Learning, AI, Data Science etc."
              name="researchInterests"
              value={userData.researchInterests}
              onChange={handleChange}
              rows={4}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="researchInterests" className="form-label">
              Teaching (Comma Separated)
            </label>
            <textarea
              className="form-control"
              placeholder="ie.  Digital Image Processing, Image analysis, Signal Processing and Communications"
              name="teaching"
              value={userData.teaching || ""}
              onChange={handleChange}
              rows={5}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="researchInterests" className="form-label">
              Accomplishments (Comma Separated)
            </label>
            <textarea
              className="form-control"
              placeholder="ie.  Type here.."
              name="accomplishments"
              value={userData.accomplishments}
              onChange={handleChange}
              rows={5}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="researchInterests" className="form-label">
              Professional Affiliation (Comma Separated)
            </label>
            <textarea
              className="form-control"
              placeholder="ie.  Type here.."
              name="professional_affiliation"
              value={userData.professional_affiliation}
              onChange={handleChange}
              rows={5}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="introduction" className="form-label">
              Introduction
            </label>
            <textarea
              className="form-control"
              rows={10}
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
        <button
          type="button"
          className="btn btn-dark btn-md p-3 w-100 mt-3"
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
    </>
  );
};

export default SupervisorsEdit;
