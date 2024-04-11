import React, { useState } from "react";
import "firebase/auth";
import { auth } from "../../../firebase";
import { updatePassword } from "firebase/auth";
import { addAlert } from "../../components/alert/push.alert";

const ChangePassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== cpassword || password === "" || cpassword === "") {
      addAlert("warning", "Passwords do not match");
      return;
    }
    const user = auth.currentUser;
    if (!user) {
      location.href = import.meta.env.VITE_APP_redirect_rules + "#/";
      return;
    }
    if (user) {
      updatePassword(user, cpassword)
        .then(() => {
          addAlert("success", "Password updated successfully");
          location.href =
            import.meta.env.VITE_APP_redirect_rules + "#/dashboard";
        })
        .catch((error: any) => {
          addAlert(
            "danger",
            `Error while changing the password, Message: ` +
              extractStringAfterSlash(error.code).toUpperCase()
          );
        });
    } else {
      addAlert("danger", "No user is currently signed in.");
    }
    setCPassword("");
    setPassword("");
  };

  return (
    <>
      <div className="col-sm-12 col-md-10 col-lg-10 col-xl-10 px-5">
        <div className="w-100 d-flex justify-content-between">
          <h3>Change Password</h3>
        </div>
        <hr />
        <form
          className="card g-3 p-3 gap-3 my-3 rounded-1 "
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="mb-0">
            <label htmlFor="newPassword" className="form-label">
              New Password
            </label>
            <input
              type="password"
              className="form-control"
              id="newPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div id="emailHelp" className="form-text">
              Password should be at least 6 characters long.
            </div>
          </div>
          <div className="mb-0">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              value={cpassword}
              onChange={(e) => setCPassword(e.target.value)}
              required
            />
          </div>
          <div className="">
            <button
              type="submit"
              className="btn btn-primary text-uppercase w-full w-100 p-3"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChangePassword;

function extractStringAfterSlash(inputString: string) {
  const index = inputString.indexOf("/");
  return index !== -1 ? inputString.substring(index + 1) : "";
}
