import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { addAlert } from "../../components/alert/push.alert";
import { db } from "../../../firebase";
import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  updateDoc,
} from "firebase/firestore";
import { Cropper } from "react-cropper";
import { useNavigate } from "react-router-dom";

interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    shade1: string;
    shade2: string;
  };
  current: boolean;
  default?: boolean;
}

const SiteSettings: React.FC = () => {
  const navigate = useNavigate();
  const getauth = useSelector((state: any) => state.getauth);
  useEffect(() => {
    if (!getauth.userType.includes("ADMIN")) {
      navigate("/dashboard");
    }
  }, []);
  return (
    <>
      <div className="col-sm-12 col-md-10 col-lg-10 col-xl-10 px-5">
        <div className="w-100 d-flex justify-content-between">
          <h3>Website Settings</h3>
        </div>
        <hr />
        <div className="alert alert-warning rounded-0 fw-bold">
          Changes here will be directly shown to the website, do not change the
          settings if not required.
        </div>
        <div className="overflow-auto mt-3">
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
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
                  Setting
                </th>{" "}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="fw-bold h6">Website Name</td>
                <td>
                  <WebsiteTitle />
                </td>
              </tr>
              <tr>
                <td className="fw-bold h6">About</td>
                <td>
                  <WebsiteAbout />
                </td>
              </tr>
              <tr>
                <td className="fw-bold h6">Address</td>
                <td>
                  <WebsiteAddress />
                </td>
              </tr>
              <tr>
                <td className="fw-bold h6">Logo</td>
                <td>
                  <WebsiteLogo />
                </td>
              </tr>
              <tr>
                <td className="fw-bold h6">Themes</td>
                <td>
                  <WebsiteTheme />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <WebsiteThemeCreate />
    </>
  );
};

export default SiteSettings;

const WebsiteTitle: React.FC = () => {
  const getsettings = useSelector((state: any) => state.getsettings.data);
  const [loading, setLoading] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [name, setName] = useState<string>(getsettings?.name);
  const handleSubmit = async () => {
    if (name === "") {
      addAlert("warning", "Website Name can not be empty!");
      return;
    }
    setLoading(true);
    setEdit(true);
    try {
      const q = query(collection(db, "website_settings"), limit(1));
      const querySnapshot = await getDocs(q);
      const firstDocument = querySnapshot.docs[0];
      if (firstDocument) {
        const docRef = doc(db, "website_settings", firstDocument.id);
        await updateDoc(docRef, { name: name });
        addAlert("success", "Updated successfully.");
      } else {
        addAlert("danger", "Invalid Action!");
      }
    } catch {
      addAlert("danger", "Error Occurred while Saving the changes.");
    }
    setLoading(false);
    setEdit(false);
    window.location.reload();
  };
  return (
    <div className="d-flex flex-nowrap gap-1">
      <input
        className="form-control form-control"
        type="text"
        name="website_name"
        id="website_name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={loading || !edit}
      />
      {!edit && (
        <button className="btn btn-primary" onClick={() => setEdit(true)}>
          Edit
        </button>
      )}
      {edit && (
        <button
          className="btn btn-success"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving.." : "Save"}
        </button>
      )}
      {edit && (
        <button
          className="btn btn-shade1"
          onClick={() => setEdit(false)}
          disabled={loading}
        >
          Cancel
        </button>
      )}
    </div>
  );
};

const WebsiteAbout: React.FC = () => {
  const getsettings = useSelector((state: any) => state.getsettings.data);
  const [loading, setLoading] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [about, setAbout] = useState<string>(getsettings?.about);
  const handleSubmit = async () => {
    if (about === "") {
      addAlert("warning", "Website About can not be empty!");
      return;
    }
    setLoading(true);
    setEdit(true);
    try {
      const q = query(collection(db, "website_settings"), limit(1));
      const querySnapshot = await getDocs(q);
      const firstDocument = querySnapshot.docs[0];
      if (firstDocument) {
        const docRef = doc(db, "website_settings", firstDocument.id);
        await updateDoc(docRef, { about: about });
        addAlert("success", "Updated successfully.");
      } else {
        addAlert("danger", "Invalid Action!");
      }
    } catch {
      addAlert("danger", "Error Occurred while Saving the changes.");
    }
    setLoading(false);
    setEdit(false);
    window.location.reload();
  };
  return (
    <div className="d-flex flex-nowrap gap-1">
      <textarea
        className="form-control form-control"
        name="website_about"
        id="website_about"
        rows={5}
        value={about}
        onChange={(e) => setAbout(e.target.value)}
        disabled={loading || !edit}
        placeholder="about the website..."
      />
      {!edit && (
        <button className="btn btn-primary h-100" onClick={() => setEdit(true)}>
          Edit
        </button>
      )}
      {edit && (
        <button
          className="btn btn-success h-100"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving.." : "Save"}
        </button>
      )}
      {edit && (
        <button
          className="btn btn-shade1 h-100"
          onClick={() => setEdit(false)}
          disabled={loading}
        >
          Cancel
        </button>
      )}
    </div>
  );
};

const WebsiteAddress: React.FC = () => {
  const getsettings = useSelector((state: any) => state.getsettings.data);
  const [loading, setLoading] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [address, setAddress] = useState<string>(getsettings?.address);
  const handleSubmit = async () => {
    if (address === "") {
      addAlert("warning", "Website Address can not be empty!");
      return;
    }
    setLoading(true);
    setEdit(true);
    try {
      const q = query(collection(db, "website_settings"), limit(1));
      const querySnapshot = await getDocs(q);
      const firstDocument = querySnapshot.docs[0];
      if (firstDocument) {
        const docRef = doc(db, "website_settings", firstDocument.id);
        await updateDoc(docRef, { address: address });
        addAlert("success", "Updated successfully.");
      } else {
        addAlert("danger", "Invalid Action!");
      }
    } catch {
      addAlert("danger", "Error Occurred while Saving the changes.");
    }
    setLoading(false);
    setEdit(false);
    window.location.reload();
  };
  return (
    <div className="d-flex flex-nowrap gap-1">
      <textarea
        className="form-control form-control"
        name="website_address"
        id="website_address"
        rows={5}
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        disabled={loading || !edit}
        placeholder="ie. Room Number : 3rd Floor,EE Department"
      />
      {!edit && (
        <button className="btn btn-primary h-100" onClick={() => setEdit(true)}>
          Edit
        </button>
      )}
      {edit && (
        <button
          className="btn btn-success h-100"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving.." : "Save"}
        </button>
      )}
      {edit && (
        <button
          className="btn btn-shade1 h-100"
          onClick={() => setEdit(false)}
          disabled={loading}
        >
          Cancel
        </button>
      )}
    </div>
  );
};
const WebsiteLogo: React.FC = () => {
  const getsettings = useSelector((state: any) => state.getsettings.data);
  const [loading, setLoading] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [image, setImage] = useState<any>();
  const [croppedImage, setCroppedImage] = useState<any>("");

  const cropperRef = useRef<HTMLImageElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader: any = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCrop = () => {
    if (cropperRef && cropperRef.current) {
      const cropper: any = (cropperRef as any).current.cropper;
      setCroppedImage(cropper.getCroppedCanvas().toDataURL());
    }
  };
  const handleSubmit = async () => {
    if (!croppedImage) {
      addAlert("danger", "Please select an image!");
      return;
    }
    setLoading(true);
    try {
      const q = query(collection(db, "website_settings"), limit(1));
      const querySnapshot = await getDocs(q);
      const firstDocument = querySnapshot.docs[0];
      if (firstDocument) {
        const docRef = doc(db, "website_settings", firstDocument.id);
        await updateDoc(docRef, { logo: croppedImage });
        addAlert("success", "Updated successfully.");
      } else {
        addAlert("danger", "Invalid Action!");
      }
    } catch {
      addAlert("danger", "Error Occurred while Saving the changes.");
    }
    setLoading(false);
    setEdit(false);
    window.location.reload();
  };
  return (
    <>
      <div className="mb-2 d-flex flex-nowrap">
        {getsettings?.logo && (
          <img
            className="card p-3 rounded-0"
            src={getsettings?.logo}
            alt="website_logo"
            srcSet={getsettings?.logo}
            style={{ height: "100px" }}
          />
        )}
        {!edit && (
          <button
            className="btn btn-primary h-100 ms-2"
            onClick={() => setEdit(true)}
          >
            Edit
          </button>
        )}
      </div>
      <div className="d-flex flex-nowrap">
        {edit && (
          <div className="">
            <input
              className="form-control form-control"
              name="website_logo"
              id="website_logo"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              disabled={loading || !edit}
              style={{ width: "fit-content" }}
            />
            <div className="">
              <Cropper
                src={image}
                ref={cropperRef}
                //   aspectRatio={16 / 4}
                guides={true}
                crop={handleCrop}
              />
            </div>
          </div>
        )}

        {edit && (
          <button
            className="btn btn-success h-100 ms-2"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving.." : "Save"}
          </button>
        )}
        {edit && (
          <button
            className="btn btn-shade1 h-100 ms-2 "
            onClick={() => setEdit(false)}
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </div>
    </>
  );
};

const WebsiteTheme: React.FC = () => {
  const getsettings = useSelector((state: any) => state.getsettings.data);
  const [loading, setLoading] = useState<boolean>(false);
  const handleApply = async (id: string) => {
    if (id === "") {
      addAlert("warning", "Invalid Action!");
      return;
    }
    setLoading(true);
    try {
      let themes_ = [
        ...getsettings.themes.filter((item_: any) => item_.name !== id),
      ];

      themes_ = themes_.map((item_) => ({
        ...item_,
        current: false,
      }));

      let selected_theme = getsettings.themes.find(
        (item_: any) => item_.name === id
      );

      if (!selected_theme) {
        addAlert("danger", "Invalid Action!");
        return;
      }

      themes_.push({
        name: selected_theme.name,
        colors: selected_theme.colors,
        default: selected_theme.default,
        current: true,
      });
      const q = query(collection(db, "website_settings"), limit(1));
      const querySnapshot = await getDocs(q);
      const firstDocument = querySnapshot.docs[0];
      if (firstDocument) {
        const docRef = doc(db, "website_settings", firstDocument.id);

        await updateDoc(docRef, {
          themes: themes_,
        });
        addAlert("success", "Updated successfully.");
      } else {
        addAlert("danger", "Invalid Action!");
      }
    } catch {
      addAlert("danger", "Error Occurred while Saving the changes.");
    }
    setLoading(false);
    window.location.reload();
  };
  const handleDelete = async (id: string) => {
    if (id === "") {
      addAlert("warning", "Invalid Action!");
      return;
    }
    setLoading(true);
    try {
      let themes_ = [
        ...getsettings.themes.filter((item_: any) => item_.name !== id),
      ];
      const q = query(collection(db, "website_settings"), limit(1));
      const querySnapshot = await getDocs(q);
      const firstDocument = querySnapshot.docs[0];
      if (firstDocument) {
        const docRef = doc(db, "website_settings", firstDocument.id);

        await updateDoc(docRef, {
          themes: themes_,
        });
        addAlert("success", "Deleted successfully.");
      } else {
        addAlert("danger", "Invalid Action!");
      }
    } catch {
      addAlert("danger", "Error Occurred while Saving the changes.");
    }
    setLoading(false);
    window.location.reload();
  };
  return (
    <div className="d-flex flex-wrap m-1">
      <div className="w-100 text-end mb-3">
        <button
          className="btn btn-shade1"
          data-bs-toggle="modal"
          data-bs-target="#AddPeopleModel"
        >
          + Create Theme
        </button>
      </div>
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th
              scope="col"
              className="top-0 position-sticky bg-dark text-white border-1 border-dark"
            >
              Theme Name
            </th>
            <th
              scope="col"
              className="top-0 position-sticky bg-dark text-white border-1 border-dark"
            >
              Colors (Primary, Secondary, Shade 1, Shade 2)
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
          {getsettings?.themes.map((theme_: Theme, index: number) => {
            return (
              <tr key={index}>
                <td className="fw-bold">
                  {theme_?.name}
                  {theme_.default ? " (Default Theme)" : " (Custom Theme)"}
                </td>
                <td>
                  <input
                    title="Primary Color"
                    className="me-1 p-0 border-0 w0"
                    name={"saved_theme_" + theme_.colors.primary}
                    type="color"
                    value={theme_.colors.primary}
                    readOnly
                  />
                  <input
                    title="Secondary Color"
                    className="me-1 p-0 border-0"
                    name={"saved_theme_" + theme_.colors.secondary}
                    type="color"
                    value={theme_.colors.secondary}
                    readOnly
                  />
                  <input
                    title="Shade 1 Color"
                    className="me-1 p-0 border-0"
                    name={"saved_theme_" + theme_.colors.shade1}
                    type="color"
                    value={theme_.colors.shade1}
                    readOnly
                  />
                  <input
                    title="Shade 2 Color"
                    className="me-1 p-0 border-0"
                    name={"saved_theme_" + theme_.colors.shade2}
                    type="color"
                    value={theme_.colors.shade2}
                    readOnly
                  />
                </td>
                <td>
                  <div className="d-flex flex-nowrap">
                    {!theme_.current ? (
                      <>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => handleApply(theme_.name)}
                          disabled={loading}
                        >
                          Apply
                        </button>{" "}
                        {!theme_.default && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(theme_.name)}
                            disabled={loading}
                          >
                            Delete
                          </button>
                        )}
                      </>
                    ) : (
                      <button className="btn btn-sm btn-primary me-2" disabled>
                        Applied
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="alert alert-info w-100 rounded-0 fw-bold p-1">
        You can only delete custom themes, you can not delete default themes.
      </div>
    </div>
  );
};

const WebsiteThemeCreate: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<{
    name: string;
    colors: {
      primary: string;
      secondary: string;
      shade1: string;
      shade2: string;
    };
  }>({
    name: "",
    colors: {
      primary: "",
      secondary: "",
      shade1: "",
      shade2: "",
    },
  });
  const handleSubmit = async () => {
    if (data.name === "") {
      addAlert("warning", "Theme Name can not be empty!");
      return;
    }
    if (
      data.colors.primary === "" ||
      data.colors.secondary === "" ||
      data.colors.shade1 === "" ||
      data.colors.shade2 === ""
    ) {
      addAlert("warning", "Theme Colors can not be empty!");
      return;
    }
    setLoading(true);
    try {
      const q = query(collection(db, "website_settings"), limit(1));
      const querySnapshot = await getDocs(q);
      const firstDocument: any = querySnapshot.docs[0];
      if (firstDocument) {
        const docRef = doc(db, "website_settings", firstDocument.id);
        const data_ = firstDocument.data();
        const res = data_.themes.filter(
          (item_: any) => item_.name === data.name
        )[0];
        if (res) {
          addAlert("danger", "Theme with same name already existed");
          return;
        }
        await updateDoc(docRef, {
          themes: [
            ...data_.themes,
            {
              name: data.name,
              colors: data.colors,
              default: false,
              current: false,
            },
          ],
        });
        addAlert("success", "Updated successfully.");
      } else {
        addAlert("danger", "Invalid Action!");
      }
    } catch {
      addAlert("danger", "Error Occurred while Saving the changes.");
    }
    setLoading(false);
    window.location.reload();
  };
  return (
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
              Create Custom Theme
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
                <label htmlFor="title" className="form-label">
                  Theme Name{" "}
                  <strong className="text-shade2">*(required)</strong>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  aria-describedby="title"
                  placeholder="Type Here.."
                  disabled={loading}
                  onChange={(e) =>
                    setData({ name: e.target.value, colors: data.colors })
                  }
                />
              </div>
              <div className="mb-2">
                <label htmlFor="date" className="form-label">
                  Select Colours{" "}
                  <strong className="text-shade2">*(required)</strong>
                </label>
                <table className="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                      >
                        Colour Type
                      </th>
                      <th
                        scope="col"
                        className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                      >
                        Paste Color Code
                      </th>
                      <th
                        scope="col"
                        className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                      >
                        Select Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        Primary Color{" "}
                        <strong style={{ color: data.colors.primary }}>
                          (dark in general for light themes)
                        </strong>{" "}
                      </td>
                      <td>
                        <input
                          type="text"
                          value={data.colors.primary}
                          disabled={loading}
                          onChange={(e) =>
                            setData({
                              name: data.name,
                              colors: {
                                primary: e.target.value,
                                secondary: data.colors.secondary,
                                shade1: data.colors.shade1,
                                shade2: data.colors.shade2,
                              },
                            })
                          }
                        />
                      </td>
                      <td>
                        {" "}
                        <input
                          className="form-control"
                          type="color"
                          disabled={loading}
                          value={data.colors.primary}
                          onChange={(e) =>
                            setData({
                              name: data.name,
                              colors: {
                                primary: e.target.value,
                                secondary: data.colors.secondary,
                                shade1: data.colors.shade1,
                                shade2: data.colors.shade2,
                              },
                            })
                          }
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Secondary Color{" "}
                        <strong style={{ color: data.colors.secondary }}>
                          (light in general for light themes)
                        </strong>{" "}
                      </td>
                      <td>
                        <input
                          type="text"
                          value={data.colors.secondary}
                          disabled={loading}
                          onChange={(e) =>
                            setData({
                              name: data.name,
                              colors: {
                                primary: data.colors.primary,
                                secondary: e.target.value,
                                shade1: data.colors.shade1,
                                shade2: data.colors.shade2,
                              },
                            })
                          }
                        />
                      </td>
                      <td>
                        {" "}
                        <input
                          className="form-control"
                          type="color"
                          value={data.colors.secondary}
                          disabled={loading}
                          onChange={(e) =>
                            setData({
                              name: data.name,
                              colors: {
                                primary: data.colors.primary,
                                secondary: e.target.value,
                                shade1: data.colors.shade1,
                                shade2: data.colors.shade2,
                              },
                            })
                          }
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Shade 1{" "}
                        <strong style={{ color: data.colors.shade1 }}>
                          (can be any colour, dark for light themes)
                        </strong>{" "}
                      </td>
                      <td>
                        <input
                          type="text"
                          value={data.colors.shade1}
                          disabled={loading}
                          onChange={(e) =>
                            setData({
                              name: data.name,
                              colors: {
                                primary: data.colors.primary,
                                secondary: data.colors.secondary,
                                shade1: e.target.value,
                                shade2: data.colors.shade2,
                              },
                            })
                          }
                        />
                      </td>
                      <td>
                        {" "}
                        <input
                          className="form-control"
                          type="color"
                          disabled={loading}
                          value={data.colors.shade1}
                          onChange={(e) =>
                            setData({
                              name: data.name,
                              colors: {
                                primary: data.colors.primary,
                                secondary: data.colors.secondary,
                                shade1: e.target.value,
                                shade2: data.colors.shade2,
                              },
                            })
                          }
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Shade 2{" "}
                        <strong style={{ color: data.colors.shade2 }}>
                          (can be any colour, dark for light themes)
                        </strong>{" "}
                      </td>
                      <td>
                        <input
                          type="text"
                          value={data.colors.shade2}
                          disabled={loading}
                          onChange={(e) =>
                            setData({
                              name: data.name,
                              colors: {
                                primary: data.colors.primary,
                                secondary: data.colors.secondary,
                                shade1: data.colors.shade1,
                                shade2: e.target.value,
                              },
                            })
                          }
                        />
                      </td>
                      <td>
                        {" "}
                        <input
                          className="form-control"
                          type="color"
                          value={data.colors.shade2}
                          disabled={loading}
                          onChange={(e) =>
                            setData({
                              name: data.name,
                              colors: {
                                primary: data.colors.primary,
                                secondary: data.colors.secondary,
                                shade1: data.colors.shade1,
                                shade2: e.target.value,
                              },
                            })
                          }
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="alert alert-info rounded-0 p-2">
                You can prefer this{" "}
                <a href="https://colorhunt.co/" target="_blank">
                  colorhunt.co
                </a>{" "}
                for the color scheme. If you want to use your own colors.
              </div>
            </>
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
                "+ Add"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
