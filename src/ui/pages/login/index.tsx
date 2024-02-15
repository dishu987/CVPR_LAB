import {
  getRedirectResult,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { useState } from "react";
import { auth } from "../../../firebase";
import { GoogleAuthProvider } from "firebase/auth/cordova";

const Login: any = () => {
  const [email, setEmail] = useState("");
  const [email_, setEmail_] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "/dashboard";
      // Redirect user to dashboard or desired page
    } catch (error: any) {
      console.log(error);
      setError(true);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
    auth.languageCode = "it";
    provider.setCustomParameters({
      login_hint: "user@example.com",
    });

    signInWithPopup(auth, provider)
      .then((result) => {
        window.location.href = "/dashboard";
      })
      .catch((error) => {
        alert(`Error While Login with goole! ${JSON.stringify(error)}`);
        // window.close();
      });
    setLoading(false);
  };
  const handlePasswordReset = () => {
    setLoading(true);
    if (!email_) {
      alert("Email should not be empty!");
      return;
    }
    sendPasswordResetEmail(auth, email_)
      .then(() => {
        alert("Password reset email sent!");
        window.close();
      })
      .catch((error) => {
        console.error("Error sending password reset email:", error);
      });
    setLoading(false);
  };
  return (
    <div
      className="container d-flex justify-content-center align-items-center w-100"
      style={{ height: "100vh" }}
    >
      <form className="col-sm-6 rounded-3 shadow-lg p-3 disabled">
        <h1 className="w-100 text-center">Admin Login</h1>
        {error && (
          <div className="alert alert-danger p-2" role="alert">
            Error signing in. Please check your credentials and try again.
          </div>
        )}
        <div className="mb-3">
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
            Forget Password
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
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="staticBackdropLabel">
                    Forget Pasword
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
                    className="btn btn-danger"
                    onClick={handlePasswordReset}
                    disabled={loading}
                  >
                    {loading ? "Please Wait.." : "Send"}
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
        <hr />
        <button
          className="btn text-muted w-100 p-2 text-uppercase gap-2"
          onClick={handleGoogleSignIn}
          disabled
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
      </form>
    </div>
  );
};

export default Login;
