import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchSupervisors } from "../../../services/firebase/getsupervisors";
import { fetchphd } from "../../../services/firebase/getphd";
import { fetchpgug } from "../../../services/firebase/getphug";
import { fetchvisinterns } from "../../../services/firebase/getvisinterns";
import { Helmet } from "react-helmet";
import { getResumeURL } from "../../../services/firebase/getresume";
import { addAlert } from "../../components/alert/push.alert";

const Peoples: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const getsupervisors = useSelector((state: any) => state.getsupervisors.data);

  const getphd = useSelector((state: any) => state.getphdStudents.data);
  const getpgug = useSelector((state: any) => state.getpgugStudents.data);

  const getvisitorsandinterns = useSelector(
    (state: any) => state.getvisitorsandinterns.data
  );
  const getResume = async (email: string) => {
    try {
      const res: any = await getResumeURL(email);
      const newWindow = window.open(res, "_blank", "width=550,height=700");
      if (newWindow) {
        newWindow.focus();
      }
    } catch {
      addAlert("warning", "CV not found!");
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchSupervisors();
      await fetchphd();
      await fetchpgug();
      await fetchvisinterns();
      setLoading(false);
    };
    fetchData();
  }, []);
  if (loading) {
    return (
      <div
        className="d-flex w-100 justify-content-center align-items-center flex-column flex-wrap"
        style={{ height: "100vh" }}
      >
        <h4>Please Wait..</h4>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Peoples </title>
      </Helmet>
      <div className="container my-5 ">
        <h1 className="fw-bold mb-3 text-shade2 text-center text-lg-start">
          Supervisor
          <hr />
        </h1>
        {getsupervisors?.map((item_: any, index_: number) => {
          return (
            <div key={index_} className="card p-3 mb-4">
              <div className="col-sm-12 d-flex justify-content-between px-lg-0 px-3 flex-row flex-wrap">
                <div className="col-sm-2 py-2 pe-2">
                  <div className="card p-2">
                    <img
                      src={item_?.profileImage}
                      alt=""
                      className="rounded-1"
                    />
                  </div>
                </div>
                <div className="col-sm-10">
                  <h2 className="fw-bold text-dark">{item_?.data?.name}</h2>
                  <p className="text-muted">
                    <strong className="text-shade2">
                      {item_?.data?.designation}
                    </strong>{" "}
                    | <strong>{item_?.data?.email}</strong> |{" "}
                    <strong>
                      +91-
                      {item_?.data?.phone}
                    </strong>
                    <br />
                    <div className="mt-3">
                      <button
                        className="btn btn-shade1 my-2 btn-sm"
                        onClick={() =>
                          window.open("#/profile/" + item_._id, "_blank")
                        }
                      >
                        Detailed Profile <i className="bx bx-link-external"></i>
                      </button>
                      <button
                        className="btn btn-shade1 my-2 btn-sm ms-2"
                        onClick={() => getResume(item_?.data?.email)}
                      >
                        Resume
                      </button>
                      <span className="dropdown ms-2">
                        <button
                          className="btn btn-shade1 dropdown-toggle btn-sm"
                          type="button"
                          id="dropdownMenuButton1"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          Profile Links
                        </button>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuButton1"
                        >
                          {item_?.data?.links?.map((link: any) => {
                            return (
                              <li>
                                <a
                                  className="dropdown-item"
                                  style={{ textDecoration: "none" }}
                                  href={link?.linkURL ? link?.linkURL : "#"}
                                  target="_blank"
                                >
                                  {link?.linkName}
                                  <i className="bx bx-link-external"></i>
                                </a>{" "}
                              </li>
                            );
                          })}
                        </ul>
                      </span>
                    </div>
                  </p>
                </div>
              </div>
              <div className="col-sm-12 px-lg-0 px-3 ">
                <h3 className="fw-bold">Introduction</h3>
                <hr />
                <p>{item_?.data?.introduction}</p>
              </div>
              <table className="table table-bordered table-hover table-responsive">
                <tbody>
                  <tr>
                    <td className="text-nowrap">
                      <strong>Research Interests</strong>
                    </td>
                    <td>
                      <ol className="d-flex flex-wrap">
                        {item_?.data?.researchInterests
                          ?.split(",")
                          .map((item: any, key_: any) => {
                            return (
                              <li key={key_} className="mx-3">
                                {item}
                              </li>
                            );
                          })}
                      </ol>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-nowrap">
                      <strong>Teaching</strong>
                    </td>
                    <td>
                      <ol className="d-flex flex-wrap">
                        {item_?.data?.teaching
                          ?.split(",")
                          .map((item: any, key_: any) => {
                            return (
                              <li key={key_} className="mx-3">
                                {item}
                              </li>
                            );
                          })}
                      </ol>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-nowrap">
                      <strong>Accomplishments</strong>
                    </td>
                    <td>
                      <ol className="d-flex flex-wrap">
                        {item_?.data?.accomplishments
                          ?.split(",")
                          .map((item: any, key_: any) => {
                            return (
                              <li key={key_} className="mx-3">
                                {item}
                              </li>
                            );
                          })}
                      </ol>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-nowrap">
                      <strong>Professional Affiliation</strong>
                    </td>
                    <td>
                      <ol className="d-flex flex-wrap">
                        {item_?.data?.professional_affiliation
                          ?.split(",")
                          .map((item: any, key_: any) => {
                            return (
                              <li key={key_} className="mx-3">
                                {item}
                              </li>
                            );
                          })}
                      </ol>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        })}
        <h1 className="fw-bold mb-2 mt-5 text-shade2 px-lg-0 px-3 ">
          Ph.D. Students
          <hr />
        </h1>
        <div className="d-flex justify-content-start  gap-3 align-items-start mb-4 flex-wrap overflow-auto px-lg-0 px-3 ">
          {getphd?.map((item: any, index: number) => {
            const { name, batch, isAlumni, email, mobile, supervisor } =
              item?.data;
            const supervisor_id = getsupervisors.filter(
              (item_: any) =>
                item_?.data?.email ===
                supervisor?.mapValue?.fields?.email?.stringValue
            )[0]?._id;
            if (isAlumni?.booleanValue) {
              return null;
            }
            return (
              <div
                className="card text-center p-1"
                key={index}
                style={{ width: "300px" }}
              >
                <div className="p-2">
                  <img
                    src={item?.profileImage}
                    alt="Profile Image"
                    style={{
                      height: "150px",
                      width: "150px",
                      borderRadius: "50%",
                      border: "5px solid var(--secondary-light)",
                    }}
                  />
                </div>
                <div className="p-2">
                  <h3>{name?.stringValue}</h3>
                  <hr />
                  <small>
                    Email: {email?.stringValue || "N/A"}
                    <br />
                    Batch: {batch?.stringValue || "N/A"}
                    <br />
                    Mobile: {mobile?.stringValue}
                  </small>
                  <br />
                  <button
                    className="btn btn-shade1 my-2 btn-sm"
                    onClick={() => window.open("#/phd/" + item._id, "_blank")}
                  >
                    Detailed Profile <i className="bx bx-link-external"></i>
                  </button>
                  <br />
                  <h6>
                    Supervisor:
                    <a
                      className="ms-1"
                      style={{ textDecoration: "none" }}
                      href={"#/profile/" + supervisor_id}
                      target="_blank"
                    >
                      {supervisor?.mapValue?.fields?.name?.stringValue}
                      <i className="bx bx-link-external"></i>
                    </a>
                  </h6>
                </div>
              </div>
            );
          })}
        </div>
        <h1 className="fw-bold mb-2 mt-5 text-shade2 px-lg-0 px-3 ">
          Ph.D. Alumni Students
          <hr />
        </h1>
        <div className="d-flex justify-content-start  gap-3 align-items-start mb-4 flex-wrap  overflow-auto px-lg-0 px-3 ">
          {getphd?.map((item: any, index: number) => {
            const { name, batch, isAlumni, email, mobile, supervisor } =
              item?.data;
            const supervisor_id = getsupervisors.filter(
              (item_: any) =>
                item_?.data?.email?.stringValue ===
                supervisor?.mapValue?.fields?.email?.stringValue
            )[0]?._id;
            if (!isAlumni?.booleanValue) {
              return null;
            }
            return (
              <div
                className="card text-center p-1"
                key={index}
                style={{ width: "300px" }}
              >
                <div className="p-2">
                  <img
                    src={item?.profileImage}
                    alt="Profile Image"
                    style={{
                      height: "150px",
                      width: "150px",
                      borderRadius: "50%",
                      border: "5px solid var(--secondary-light)",
                    }}
                  />
                </div>
                <strong className="mt-2">
                  <h3>{name?.stringValue}</h3>
                  <hr />
                  <small>
                    Email: {email?.stringValue || "N/A"}
                    <br />
                    Batch: {batch?.stringValue || "N/A"}
                    <br />
                    Mobile: {mobile?.stringValue}
                  </small>
                  <br />
                  <button
                    className="btn btn-shade1 mt-3 btn-sm"
                    onClick={() => window.open("#/phd/" + item._id, "_blank")}
                  >
                    Detailed Profile <i className="bx bx-link-external"></i>
                  </button>
                </strong>
                <br />
                <h6>
                  Supervisor:
                  <a
                    className="ms-1"
                    style={{ textDecoration: "none" }}
                    href={"#/profile/" + supervisor_id}
                    target="_blank"
                  >
                    {supervisor?.mapValue?.fields?.name?.stringValue}
                    <i className="bx bx-link-external"></i>
                  </a>
                </h6>
              </div>
            );
          })}
        </div>
        <h1 className="fw-bold mb-2 mt-5 text-shade2 px-lg-0 px-3 ">
          Post Graduate and Undergraduate Students
          <hr />
        </h1>
        <div className="d-flex flex-wrap  overflow-auto gap-3 px-lg-0 px-3 ">
          {getpgug?.map((item: any) => {
            const {
              name,
              batch,
              isAlumni,
              email,
              mobile,
              degree,
              currentlyWorkingAt,
            } = item?.data;
            if (isAlumni.booleanValue) return null;
            return (
              <div
                className="card text-center p-1"
                key={item?._id}
                style={{ width: "300px" }}
              >
                <div className="p-2">
                  <h3>{name?.stringValue}</h3>
                  <small> {email?.stringValue || "N/A"}</small>
                  <br />
                  <small>+91-{mobile?.stringValue}</small>
                  {isAlumni.booleanValue && (
                    <>
                      <br />
                      <small className="fw-bold text-shade2">(Alumni)</small>
                    </>
                  )}
                  <hr />
                  <small className="text-dark fw-bold">
                    {degree?.stringValue} student From{" "}
                    {batch?.stringValue || "N/A"} batch
                  </small>
                  <br />
                  <small>Currently Working at</small>
                  <br />
                  <strong className="mt-2">
                    {currentlyWorkingAt?.stringValue}
                  </strong>
                  <br />
                  {/* <button className="btn btn-primary btn-sm my-2">
                    Linkedin
                  </button> */}
                </div>
              </div>
            );
          })}
        </div>
        <h1 className="fw-bold mb-2 mt-5 text-shade2 px-lg-0 px-3 ">
          PG and UG Alumnis
          <hr />
        </h1>
        <div className="d-flex flex-wrap  overflow-auto gap-3 px-lg-0 px-3 ">
          {getpgug?.map((item: any) => {
            const {
              name,
              batch,
              isAlumni,
              email,
              mobile,
              degree,
              currentlyWorkingAt,
            } = item?.data;
            if (!isAlumni.booleanValue) return null;
            return (
              <div
                className="card text-center p-1"
                key={item?._id}
                style={{ width: "300px" }}
              >
                <div className="p-2">
                  <h3>{name?.stringValue}</h3>
                  <small> {email?.stringValue || "N/A"}</small>
                  <br />
                  <small>+91-{mobile?.stringValue}</small>
                  {isAlumni.booleanValue && (
                    <>
                      <br />
                      <small className="fw-bold text-shade2">(Alumni)</small>
                    </>
                  )}
                  <hr />
                  <small className="text-dark fw-bold">
                    {degree?.stringValue} student From{" "}
                    {batch?.stringValue || "N/A"} batch
                  </small>
                  <br />
                  <small>Currently Working at</small>
                  <br />
                  <strong className="mt-2">
                    {currentlyWorkingAt?.stringValue}
                  </strong>
                  <br />
                  {/* <button className="btn btn-primary btn-sm my-2">
                    Linkedin
                  </button> */}
                </div>
              </div>
            );
          })}
        </div>
        <h1 className="fw-bold mb-2 mt-5 text-shade2 px-lg-0 px-3 ">
          Vistors and Inters
          <hr />
        </h1>
        <div className="d-flex flex-wrap  overflow-auto gap-3 px-lg-0 px-3 ">
          {getvisitorsandinterns?.map((item: any) => {
            const { name, collegeName } = item?.data;
            return (
              <div
                className="card text-center p-1"
                key={item?._id}
                style={{ width: "300px" }}
              >
                <div className="p-2">
                  <h4>{name?.stringValue}</h4>
                  <hr />
                  <p className="fw-bold text-dark">
                    {collegeName?.stringValue}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Peoples;
