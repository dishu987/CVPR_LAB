import { createUserWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { Helmet } from "react-helmet";
import { addAlert } from "../../components/alert/push.alert";
import { Link } from "react-router-dom";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { userTypes } from "../../../utils/userTypes";

const Register: any = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [userExisted, setUserExisted] = useState<boolean>(false);
  // Check if user is already logged
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      if (user) {
        window.location.href =
          import.meta.env.VITE_APP_redirect_rules + "#/dashboard";
      }
    });
    return () => unsubscribe();
  }, []);
  const varifyUser = async (e: any) => {
    e.preventDefault();
    if (!email || !userType) {
      addAlert("warning", "Email and User Type fields are required!");
      setLoading(false);
      return;
    }
    setLoading(true);
    let q: any;
    if (userType === "SUPERVISOR") {
      q = query(collection(db, "supervisors"), where("email", "==", email));
    } else if (userType === "PHD") {
      q = query(collection(db, "phdStudents"), where("email", "==", email));
    }
    const docSnapshot = await getDocs(q);
    if (!docSnapshot.empty) {
      setUserExisted(true);
      addAlert(
        "success",
        "User with this email is existed, Choose your password and proceed!"
      );
      setLoading(false);
      return;
    }
    addAlert(
      "danger",
      "User with this email does not existed, contact your admin!"
    );
    setLoading(false);
  };
  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    if (!userType) {
      addAlert("warning", "User Type field is required!");
      return;
    }
    if (!email || !password || !confirmPassword) {
      addAlert(
        "warning",
        "Email, Password and Confirm Pasword fields are required!"
      );
      return;
    }
    if (password !== confirmPassword) {
      addAlert("warning", "Password and Confirm Password does not match!");
      return;
    }
    if (password.length < 6) {
      addAlert("warning", "Password must be atleast 6 charactors long!");
      return;
    }
    setLoading(true);
    if (userType === "SUPERVISOR") {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        await addDoc(collection(db, "users"), {
          email: email,
          userType: "SUPERVISOR",
        });
        window.location.href =
          import.meta.env.VITE_APP_redirect_rules + "#/dashboard";
      } catch (error: any) {
        addAlert("danger", "Error while creating account, try again!");
      }
    } else if (userType === "PHD") {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        await addDoc(collection(db, "users"), {
          email: email,
          userType: "PHD",
        });
        window.location.href =
          import.meta.env.VITE_APP_redirect_rules + "#/dashboard";
      } catch (error: any) {
        if (error.code == "auth/email-already-in-use") {
          addAlert(
            "success",
            "Account already created, Login with your email and password!"
          );
          window.location.href = "#/login";
          return;
        }
        addAlert("danger", "Error while creating account, try again!");
      }
    }
    setLoading(false);
  };
  return (
    <div
      className="container d-flex justify-content-center align-items-center w-100 my-5"
      style={{ height: "100vh" }}
    >
      <div className="col-sm-12 rounded-3 shadow-lg p-3 disabled">
        <form>
          <h1 className="w-100 text-center">Activate Your Account</h1>
          <div className="mb-2">
            <label htmlFor="exampleInputEmail1" className="form-label">
              User Type
            </label>
            <select
              name="userType"
              id="userType"
              className="form-control"
              onChange={(e) => setUserType(e.target.value)}
              disabled={loading || userExisted}
            >
              <option value="">--select user type--</option>
              {userTypes.map((item__: any, key: number) => {
                if (item__ === "ADMIN") return;
                return (
                  <option value={item__} key={key}>
                    {item__}
                  </option>
                );
              })}
            </select>
          </div>
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
              disabled={loading || userExisted}
            />
          </div>
          {userExisted ? (
            <div className="alert alert-success p-1 rounded-0 mb-0">
              <ul>
                <li>
                  User Existed, choose your password and proceed to login!
                </li>
              </ul>
            </div>
          ) : (
            <div className="alert alert-warning p-1 rounded-0 mb-0">
              <ul>
                <li>
                  Utilize the email address provided to the administrator.
                </li>
                <li>
                  If an email address has not been provided, kindly furnish it
                  to the administrator prior to activating your account.
                </li>
                <li>
                  The email address must be affiliated with the institute, e.g.,
                  test@iitrpr.ac.in.
                </li>
              </ul>
            </div>
          )}

          {userExisted ? (
            <>
              <div className="mb-2">
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
              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="exampleInputPassword2"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="alert alert-warning p-1 rounded-0 ">
                <ul>
                  <li>Password and Confirm password must be same.</li>
                  <li>Password must be atleast 6 charactors long.</li>
                </ul>
              </div>
              <button
                onClick={handleFormSubmit}
                className="btn btn-success w-100 p-2 text-uppercase"
                disabled={loading}
              >
                {!loading ? "Proceed" : "Please Wait.."}
              </button>
            </>
          ) : (
            <button
              onClick={varifyUser}
              className="btn btn-dark w-100 p-2 text-uppercase mt-3"
              disabled={loading}
            >
              {!loading ? "Check the user availablity" : "Please Wait.."}
            </button>
          )}
        </form>
        <hr />
        <div className="text-center mb-3">
          {" "}
          <Link to="/login">Already have an account?</Link>
        </div>
      </div>
      <Helmet>
        <title>Register </title>
      </Helmet>
    </div>
  );
};

export default Register;
