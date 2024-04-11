import { useEffect, useState } from "react";
import { fetchSupervisors } from "../../../services/firebase/getsupervisors";
import { useSelector } from "react-redux";
import { addAlert } from "../../components/alert/push.alert";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { getUserAuth } from "../../../services/firebase/getauth";
import { fetchphd } from "../../../services/firebase/getphd";

const SiteAdmin: React.FC = () => {
  const getatuth = useSelector((state: any) => state.getauth);
  const getsupervisors = useSelector((state: any) => state.getsupervisors.data);
  const getphd = useSelector((state: any) => state.getphdStudents.data);
  const [loading, setLoading] = useState<boolean>(false);
  const [loading_, setLoading_] = useState<boolean>(false);
  const [adminEmails, setAdminEmails] = useState<
    {
      email: string;
      userType: string;
    }[]
  >([]);
  const [requestsEmails, setRequestsEmails] = useState<
    {
      email: string;
      userType: string;
    }[]
  >([]);
  const [selectedUser, setselectedUser] = useState<{
    name: string;
    email: string;
  }>({ email: "", name: "" });
  const getadminEmail = async () => {
    setLoading_(true);
    const usersSnapshot = await getDocs(collection(db, "users"));
    let temp_: any = [];
    usersSnapshot.forEach(async (userDoc) => {
      const userData = userDoc.data();
      if (userData?.userType?.includes("ADMIN")) {
        const userType = userData.userType;
        console.log({ email: userData.email, userType: userType });
        temp_.push({ email: userData.email, userType: userType });
      }
    });
    setAdminEmails(temp_);
    setLoading_(false);
  };
  const getRequestAdminEmail = async () => {
    setLoading_(true);
    setRequestsEmails([]);
    const usersSnapshot = await getDocs(collection(db, "users_requests"));
    let temp_: any = [];
    usersSnapshot.forEach(async (userDoc) => {
      const userData = userDoc.data();
      const userType = userData.userType;
      temp_.push({ email: userData.email, userType: userType });
    });
    setRequestsEmails(temp_);
    setLoading_(false);
  };
  useEffect(() => {
    getUserAuth();
    fetchphd();
    fetchSupervisors();
    getadminEmail();
    if (getatuth?.userType?.includes("ADMIN")) {
      getRequestAdminEmail();
    }
  }, []);
  const handleAdminRequest = async () => {
    setLoading(true);
    try {
      // Check if request already exists in the database
      const querySnapshot = await getDocs(
        query(
          collection(db, "users_requests"),
          where("email", "==", getatuth?.email),
          where("userType", "==", getatuth?.userType)
        )
      );

      if (!querySnapshot.empty) {
        addAlert(
          "warning",
          "A request with the same email and user type already exists. Please wait for the admin's approval."
        );
      } else {
        // If request doesn't exist, add it to the database
        await addDoc(collection(db, "users_requests"), {
          email: getatuth?.email,
          userType: getatuth?.userType,
        });
        addAlert(
          "success",
          "Your request has been sent successfully. Please wait for the admin's approval."
        );
      }
    } catch (error) {
      console.error("Error while adding admin request:", error);
      addAlert("danger", "Error while adding admin request!");
    }
    setLoading(false);
  };
  const deleteRequestByEmail = async (email_: string) => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "users_requests"), where("email", "==", email_))
      );
      if (!querySnapshot.empty) {
        const deletePromises = querySnapshot.docs.map(async (doc) => {
          await deleteDoc(doc.ref);
        });
        await Promise.all(deletePromises);
        addAlert("success", "Requests deleted successfully");
        window.location.reload();
      } else {
        addAlert("danger", "No requests found with the provided email");
      }
    } catch (error) {
      addAlert("danger", "Error deleting requests!");
    }
    setLoading(false);
  };

  const handleApproveAdminRequest = async (email_: string) => {
    setLoading(true);
    try {
      // Add "ADMIN" rights to the selected user
      const q = query(collection(db, "users"), where("email", "==", email_));
      const docSnapshot = await getDocs(q);
      const userData = docSnapshot.docs[0].data();

      if (!userData.userType || !userData.userType.includes("ADMIN")) {
        // Add ADMIN rights to the selected user
        const selectedUserType = userData.userType
          ? userData.userType + ",ADMIN"
          : "ADMIN";
        await updateDoc(doc(db, "users", docSnapshot.docs[0].id), {
          userType: selectedUserType,
        });
        addAlert("success", "Admin rights given successfully.");
        await deleteRequestByEmail(email_);
        window.location.reload();
      } else {
        addAlert("warning", "The selected user is already an admin.");
      }
    } catch {
      addAlert("danger", "Error while approving admin request!");
    }
    setLoading(false);
  };
  const handleChangeAdmin = async () => {
    setLoading(true);
    try {
      // // Remove "ADMIN" rights from all users
      // const usersSnapshot = await getDocs(collection(db, "users"));
      // usersSnapshot.forEach(async (userDoc) => {
      //   const userData = userDoc.data();
      //   if (userData.userType.includes("ADMIN")) {
      //     const updatedUserType = userData.userType
      //       .replace("ADMIN", "")
      //       .replace(",", "");
      //     await updateDoc(doc(db, "users", userDoc.id), {
      //       userType: updatedUserType,
      //     });
      //   }
      // });

      // Add "ADMIN" rights to the selected user
      const q = query(
        collection(db, "users"),
        where("email", "==", selectedUser.email)
      );
      const docSnapshot = await getDocs(q);
      const userData = docSnapshot.docs[0].data();

      if (!userData.userType || !userData.userType.includes("ADMIN")) {
        // Add ADMIN rights to the selected user
        const selectedUserType = userData.userType
          ? userData.userType + ",ADMIN"
          : "ADMIN";
        await updateDoc(doc(db, "users", docSnapshot.docs[0].id), {
          userType: selectedUserType,
        });
        addAlert("success", "Admin rights given successfully.");
        // addAlert("warning", "You are not longer as ADMIN.");
        window.location.reload();
      } else {
        addAlert("warning", "The selected user is already an admin.");
      }
    } catch (error) {
      console.error("Error in changing admin rights:", error);
      addAlert("danger", "Error in changing admin rights");
    }
    setLoading(false);
  };
  const handleRemoveAdminRights = async (email_: string) => {
    setLoading(true);
    try {
      // Remove "ADMIN" rights from all users
      const querySnapshot = await getDocs(
        query(collection(db, "users"), where("email", "==", email_))
      );
      const promises: any = [];
      querySnapshot.forEach((userDoc) => {
        const userData = userDoc.data();
        if (userData.userType.includes("ADMIN")) {
          const updatedUserType = userData.userType
            .replace("ADMIN", "")
            .replace(",", "");

          // Add the update operation promise to the array
          promises.push(
            updateDoc(doc(db, "users", userDoc.id), {
              userType: updatedUserType,
            })
          );
        }
      });

      // Wait for all update operations to complete
      await Promise.all(promises);

      addAlert("success", "Admin rights removed successfully from this user.");
      window.location.reload();
    } catch {
      addAlert(
        "danger",
        "Error, while removing admin rights. Try again later."
      );
    }
    setLoading(false);
  };
  return (
    <>
      <div className="col-sm-12 col-md-10 col-lg-10 col-xl-10 px-5">
        <div className="w-100 d-flex justify-content-between">
          <h3>Current Site Admins</h3>
          {getatuth?.userType?.includes("ADMIN") ? (
            <div className="d-flex flex-nowrap">
              <button
                className="btn btn-danger btn-sm rounded-0 d-flex justify-content-center align-items-center me-1"
                disabled
              >
                Remove Admin Rights
              </button>
              <button
                className="btn btn-dark btn-sm rounded-0 d-flex justify-content-center align-items-center"
                data-bs-toggle="modal"
                data-bs-target="#AddPeopleModel"
              >
                <i className="bx bxs-edit me-1"></i> Change Site Admin
              </button>
            </div>
          ) : (
            <button
              className="btn btn-primary btn-sm rounded-0 d-flex justify-content-center align-items-center"
              onClick={handleAdminRequest}
              disabled={loading}
            >
              {loading ? "Sending Request..." : "Request Admin Rights"}
            </button>
          )}
        </div>
        <hr />
        <div className="overflow-auto mt-3">
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                >
                  Designation
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
              {loading_ ? (
                <tr>
                  <td colSpan={3}>
                    <h2 className="fw-bold text-danger text-center w-100">
                      Loading...
                    </h2>
                  </td>
                </tr>
              ) : (
                <>
                  {adminEmails.map((adminEmail: any, index: number) => {
                    return (
                      <tr key={index}>
                        <th className="fw-bold text-danger">
                          {adminEmail.email}
                        </th>
                        <th className="fw-bold text-success">
                          {adminEmail.userType
                            .split(",")
                            .map((name_: string) => {
                              return (
                                <button
                                  key={name_}
                                  className="btn  btn-success me-2 btn-sm"
                                >
                                  {name_}
                                </button>
                              );
                            })}
                        </th>
                        <th>
                          {" "}
                          {getatuth?.email !== adminEmail.email &&
                          getatuth.userType.includes("ADMIN") ? (
                            <button
                              className="btn btn-outline-danger ms-2 btn-sm"
                              onClick={() => {
                                if (
                                  confirm("Are you sure to delete this user?")
                                ) {
                                  handleRemoveAdminRights(adminEmail.email);
                                }
                              }}
                              disabled={loading}
                            >
                              Delete
                            </button>
                          ) : (
                            <button
                              className="btn btn-primary ms-2 btn-sm"
                              disabled
                            >
                              Not Available
                            </button>
                          )}
                        </th>
                      </tr>
                    );
                  })}
                </>
              )}
              {!adminEmails.length && !loading_ && (
                <tr>
                  <td colSpan={3}>
                    <h2 className="fw-bold text-danger text-center w-100">
                      No Data
                    </h2>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {getatuth?.userType?.includes("ADMIN") && (
          <>
            <h3>Admin Requests</h3>
            <hr />
            <div className="overflow-auto mt-3">
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                    >
                      Designation
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
                  {loading_ ? (
                    <tr>
                      <td colSpan={3}>
                        <h2 className="fw-bold text-danger text-center w-100">
                          Loading...
                        </h2>
                      </td>
                    </tr>
                  ) : (
                    <>
                      {requestsEmails.map((adminEmail: any, index: number) => {
                        return (
                          <tr key={index}>
                            <th className="fw-bold text-danger">
                              {adminEmail.email}
                            </th>
                            <th className="fw-bold text-success">
                              {adminEmail.userType
                                .split(",")
                                .map((name_: string) => {
                                  return (
                                    <button
                                      key={name_}
                                      className="btn  btn-success me-2 btn-sm"
                                    >
                                      {name_}
                                    </button>
                                  );
                                })}
                            </th>
                            <th>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() =>
                                  deleteRequestByEmail(adminEmail.email)
                                }
                                disabled={loading}
                              >
                                Reject
                              </button>
                              <button
                                className=" ms-2 btn btn-outline-primary btn-sm"
                                onClick={() =>
                                  handleApproveAdminRequest(adminEmail.email)
                                }
                                disabled={loading}
                              >
                                Approve
                              </button>
                            </th>
                          </tr>
                        );
                      })}
                    </>
                  )}
                  {!requestsEmails.length && !loading_ && (
                    <tr>
                      <td colSpan={3}>
                        <h2 className="fw-bold text-danger text-center w-100">
                          No Requests
                        </h2>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
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
                Change Site Admin
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="col">
                <label htmlFor="useremail" className="form-label">
                  Select User (
                  <strong className="text-danger">
                    *It can be supervisor as well as PHD Student.
                  </strong>
                  )<span className="text-danger">*</span>
                </label>
                <select
                  name="userEmail"
                  className="form-control"
                  onChange={(e) => {
                    let res = getsupervisors.filter(
                      (item_: any) => item_?.data?.name === e.target.value
                    )[0]?.data?.email;
                    if (!res) {
                      res = getphd.filter(
                        (item_: any) =>
                          item_?.data?.name?.stringValue === e.target.value
                      )[0]?.data?.email?.stringValue;
                    }
                    setselectedUser({
                      name: e.target.value,
                      email: res,
                    });
                  }}
                  disabled={loading}
                >
                  <option value="">--select user--</option>
                  {getsupervisors?.map((item: any, index: number) => {
                    return (
                      <option value={item?.data?.name} key={index}>
                        {item?.data?.name},{item?.data?.email}, Supervisor
                      </option>
                    );
                  })}
                  {getphd?.map((item: any, index: number) => {
                    return (
                      <option value={item?.data?.name?.stringValue} key={index}>
                        {item?.data?.name?.stringValue},
                        {item?.data?.email?.stringValue}, PHD Student
                      </option>
                    );
                  })}
                </select>
                <div className="d-flex flex-wrap mt-2 gap-2 w-100">
                  {selectedUser.name ? (
                    <table className="table table-bordered table-responsive">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th>{selectedUser.name}</th>
                          <th>{selectedUser.email}</th>
                          <th>
                            <button
                              className="btn btn-danger btn-sm rounded-0"
                              onClick={() =>
                                setselectedUser({ email: "", name: "" })
                              }
                              disabled={loading}
                            >
                              Remove
                            </button>
                          </th>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <div className="w-100 h5 text-danger text-center my-3">
                      No User Selected
                    </div>
                  )}
                </div>
              </div>
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
                onClick={handleChangeAdmin}
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

export default SiteAdmin;
