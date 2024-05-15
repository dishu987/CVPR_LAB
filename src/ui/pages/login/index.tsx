import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, provider } from "../../../firebase";
import { Helmet } from "react-helmet";
import { addAlert } from "../../components/alert/push.alert";
import { Link } from "react-router-dom";
import { fetchSupervisors } from "../../../services/firebase/getsupervisors";

const Login: any = () => {
  const [email, setEmail] = useState("");
  const [email_, setEmail_] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      if (user) {
        window.location.href =
          import.meta.env.VITE_APP_redirect_rules + "#/dashboard";
      }
    });
    return () => unsubscribe();
  }, []);
  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    if (!email || !password) {
      addAlert("warning", "Email and Password fields are required!");
      return;
    }
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      await fetchSupervisors();
      window.location.reload();
    } catch (error: any) {
      addAlert("danger", "Invalid Email or Password!");
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    auth.languageCode = "it";
    signInWithPopup(auth, provider)
      .then(async () => {
        await fetchSupervisors();
        window.location.reload();
      })
      .catch((error) => {
        if (error?.code === "auth/admin-restricted-operation") {
          addAlert("danger", "User does not existed!");
        } else {
          addAlert("danger", "Invalid Email or Password!");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePasswordReset = async () => {
    if (!email_) {
      addAlert("warning", "Email should not be empty!");
      return;
    }
    setLoading(true);
    await sendPasswordResetEmail(auth, email_)
      .then(() => {
        addAlert("success", "Password reset email sent!");
        window.close();
      })
      .catch(() => {
        addAlert(
          "danger",
          "Error sending password reset email. Please try again later."
        );
      });
    setLoading(false);
  };
  return (
    <div
      className="container d-flex justify-content-center align-items-center w-100"
      style={{ height: "100vh" }}
    >
      <div className="col-sm-6 rounded-3 shadow-lg p-3 disabled">
        <form>
          <h1 className="w-100 text-center">Login</h1>
          <div className="mb-2">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="mb-0">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="mb-3 text-end me-0 p-0">
            <button
              className="btn btn-link"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
              type="button"
            >
              Forgot Password?
            </button>
            <div
              className="modal fade"
              id="staticBackdrop"
              data-bs-backdrop="static"
              data-bs-keyboard="false"
              tabIndex={-1}
              aria-labelledby="staticBackdropLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content rounded-0">
                  <div className="modal-header">
                    <h5 className="modal-title" id="staticBackdropLabel">
                      Forgot Password
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    />
                  </div>
                  <div className="modal-body">
                    <input
                      type="text"
                      className="form-control"
                      name="email_"
                      id="email_"
                      onChange={(e) => setEmail_(e.target.value)}
                      placeholder="ie. user@gmail.com"
                    />
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-dark"
                      onClick={handlePasswordReset}
                      disabled={loading}
                    >
                      {loading ? "Please Wait.." : "Send Mail"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleFormSubmit}
            className="btn btn-dark w-100 p-2 text-uppercase"
            disabled={loading}
          >
            {!loading ? "Submit" : "Please Wait.."}
          </button>
        </form>
        <hr />
        <button
          className="btn text-muted w-100 p-2 text-uppercase gap-2 border-1 border-secondary"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width={30}
            height={30}
            viewBox="0 0 48 48"
          >
            <path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            />
            <path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            />
            <path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            />
          </svg>
          Sign-In with Google
        </button>
        <hr />
        <div className="text-center mb-3">
          {" "}
          <Link to="/register">New Supervisor or PHD Student?</Link>
        </div>
      </div>
      <Helmet>
        <title>Login </title>
      </Helmet>
    </div>
  );
};

export default Login;
