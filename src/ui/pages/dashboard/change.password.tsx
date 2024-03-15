import React, { useEffect, useState } from "react";
import "firebase/auth";
import { auth } from "../../../firebase";
import { updatePassword } from "firebase/auth";
import { addAlert } from "../../components/alert/push.alert";

const ChangePassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(false);
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
        .catch(() => {
          addAlert("danger", `Logout and try again!`);
        });
    } else {
      addAlert("danger", "No user is currently signed in.");
    }
    setCPassword("");
    setPassword("");
  };

  useEffect(() => {
    if (password === cpassword && password != "" && cpassword != "") {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(false);
    }
  }, [password, cpassword]);

  return (
    <>
      <div className="col-sm-12 col-md-10 col-lg-10 col-xl-10 px-5">
        <div className="w-100 d-flex justify-content-between">
          <h3>Change Password</h3>
        </div>
        <hr />
        <form className="row g-3" onSubmit={handleSubmit} noValidate>
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
            <div
              className={`rounded-0 p-2 mt-2 ${
                passwordMatch ? "alert alert-success" : "alert alert-danger"
              }`}
              role="alert"
            >
              {passwordMatch
                ? "Password and Confirm Password Matched!"
                : "Password and Confirm Password do not Match!"}
            </div>
          </div>
          <div className="mb-3">
            <button
              type="submit"
              className="btn btn-danger text-uppercase w-full"
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
