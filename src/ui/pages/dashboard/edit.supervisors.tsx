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
  phone: string;
  researchInterests: string;
  introduction: string;
  googleScholarLink: string;
  researchGateLink: string;
  personalProfileLink: string;
  otherLink: string;
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
    name: supervisor_?.data?.name?.stringValue,
    email: supervisor_?.data?.email?.stringValue,
    phone: supervisor_?.data?.phone?.stringValue,
    researchInterests: supervisor_?.data?.researchInterests?.stringValue,
    introduction: supervisor_?.data?.introduction?.stringValue,
    googleScholarLink: supervisor_?.data?.googleScholarLink?.stringValue,
    researchGateLink: supervisor_?.data?.researchGateLink?.stringValue,
    personalProfileLink: supervisor_?.data?.personalProfileLink?.stringValue,
    otherLink: supervisor_?.data?.otherLink?.stringValue,
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
        } catch (error) {
          addAlert(
            "danger",
            "Error! Check your internet connection and try again."
          );
          setLoading(false);
          return;
        }
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
          name,
          email,
          phone,
          researchInterests,
          introduction,
          googleScholarLink,
          researchGateLink,
          personalProfileLink,
          otherLink,
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
          name,
          email,
          phone,
          researchInterests,
          introduction,
          googleScholarLink,
          researchGateLink,
          personalProfileLink,
          otherLink,
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
            className="btn btn-danger btn-sm rounded-0"
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
              <span className="text-danger">you can't modify this field</span>)
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
                <span className="text-danger">you can't modify this field</span>
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
                <span className="text-danger">aspect ratio 3:4 only</span>)
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
              <span className="text-danger">
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
                Other Link (<span className="text-danger">if any</span>)
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
