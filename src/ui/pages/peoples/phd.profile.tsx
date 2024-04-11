import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchphd } from "../../../services/firebase/getphd";
import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";
import { getResumeURL } from "../../../services/firebase/getresume";
import BibTexEntryRenderer from "../../components/bibtex.render";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { fetchPublications } from "../../../services/firebase/getpublications";
import { addAlert } from "../../components/alert/push.alert";

const DetailProfilePHD: React.FC = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const getphd = useSelector((state: any) => state.getphdStudents.data);
  const getphd_ = getphd.filter((item_: any) => item_._id == id)[0];
  let researchInterests__ = "";
  getphd_?.data?.researchInterests?.arrayValue?.values.map((interest: any) => {
    let x = researchInterests__ === "" ? "" : ",";
    researchInterests__ = researchInterests__ + x + interest?.stringValue;
  });
  let links_data: { linkName: string; linkURL: string }[] = [];
  getphd_?.data?.links?.arrayValue?.values.map((item_: any) => {
    links_data.push({
      linkName: item_?.mapValue?.fields?.linkName?.stringValue,
      linkURL: item_?.mapValue?.fields?.linkURL?.stringValue,
    });
  });
  const getpublications_ = useSelector(
    (state: any) => state.getpublications.data
  );
  const getpublications = getpublications_.filter((item_: any) => {
    const values = item_?.data?.users;
    if (values && values.length > 0) {
      return values.some((value: any) => {
        return value === getphd_?.data?.email?.stringValue;
      });
    }
    return false;
  });
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchphd();
      await fetchPublications();
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
        <h1 className="fw-bold text-danger">Vision Intelligence Lab</h1>
        <h4>Please Wait..</h4>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {getphd_?.data?.name?.stringValue} | {import.meta.env.VITE_APP_TITLE}
        </title>
      </Helmet>
      <Navbar />
      <div className="container my-5 ">
        <h1 className="fw-bold mb-3 text-danger text-center text-lg-start">
          Ph.D. Student
          <hr />
        </h1>
        <div className="overflow-auto mt-3">
          <table className="table table-bordered table-hover">
            <tbody>
              <tr>
                <td colSpan={1}>
                  <a href={getphd_?.profileImage} target="_blank">
                    <img
                      src={getphd_?.profileImage}
                      alt="Profile Image"
                      style={{ width: "120px" }}
                    />
                  </a>
                </td>
                <td colSpan={7}>
                  <h2 className="fw-bold text-danger">
                    {getphd_?.data?.name?.stringValue}
                  </h2>
                  {getphd_?.data?.isAlumni?.booleanValue ? (
                    <div className="fw-bold text-secondary">Alumni Student</div>
                  ) : (
                    <div className="fw-bold text-secondary">
                      Ongoing Student
                    </div>
                  )}
                  <button
                    className="btn btn-danger my-3 btn-sm"
                    onClick={async () => {
                      const res: any = await getResumeURL(
                        getphd_?.data?.email?.stringValue
                      );
                      if (!res) {
                        addAlert("warning", "Resume not uploaded!");
                        return;
                      }
                      window.open(res, "_blank");
                    }}
                  >
                    Resume
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <strong className="text-danger">Name</strong>
                </td>
                <td>{getphd_?.data?.name?.stringValue}</td>
                <td colSpan={3}>
                  <strong className="text-danger">Email</strong>
                </td>
                <td>{getphd_?.data?.email?.stringValue}</td>
                <td>
                  {" "}
                  <strong className="text-danger">Batch</strong>
                </td>
                <td>{getphd_?.data?.batch?.stringValue || "N/A"}</td>
              </tr>
              <tr>
                <td>
                  <strong className="text-danger">Supervisor</strong>
                </td>
                <td>
                  <div>
                    <strong>Name: </strong>
                    {
                      getphd_?.data?.supervisor?.mapValue?.fields?.name
                        ?.stringValue
                    }
                    , <strong>Email: </strong>
                    {
                      getphd_?.data?.supervisor?.mapValue?.fields?.email
                        ?.stringValue
                    }
                  </div>
                </td>
                <td>
                  {" "}
                  <strong className="text-danger">Mobile</strong>
                </td>
                <td colSpan={3}>
                  {getphd_?.data?.mobile?.stringValue || "N/A"}
                </td>
                <td>
                  {" "}
                  <strong className="text-danger">Personal Email</strong>
                </td>
                <td colSpan={3}>
                  {getphd_?.data?.personal_email?.stringValue || "N/A"}
                </td>
              </tr>
              <tr>
                <td colSpan={1}>
                  <strong className="text-danger">Research Interests</strong>
                </td>
                <td colSpan={7}>
                  <div className="d-flex flex-wrap gap-2">
                    {getphd_?.data?.researchInterests?.arrayValue?.values?.map(
                      (ri: any, i_: any) => {
                        return (
                          <Link
                            to={
                              "https://www.google.com/search?q=" +
                              ri?.stringValue
                            }
                            target="_blank"
                            style={{ textDecoration: "none" }}
                          >
                            <small
                              className="alert alert-success p-1 me-2 rounded-3 text-nowrap"
                              style={{ width: "fit-content" }}
                              key={i_}
                            >
                              {ri?.stringValue}
                            </small>
                          </Link>
                        );
                      }
                    )}
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={1}>
                  <strong className="text-danger">Introduction</strong>
                </td>
                <td colSpan={7}>{getphd_?.data?.introduction?.stringValue}</td>
              </tr>
              <tr>
                <td colSpan={1}>
                  <strong className="text-danger">Links</strong>
                </td>
                <td colSpan={7}>
                  {links_data.map((link: any) => {
                    return (
                      <button
                        className="btn btn-success btn-sm me-1"
                        onClick={() => window.open(link?.linkURL, "_blank")}
                      >
                        {link?.linkName}
                      </button>
                    );
                  })}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="card p-3 mb-4 rounded-0">
            <div className="col-sm-12 d-flex justify-content-between px-lg-0 flex-row flex-wrap">
              <h3 className="fw-bold w-100 mb-3">Research Papers</h3>
              <hr />
              <div className="overflow-hidden">
                <ol
                  style={{
                    height: "fit-content",
                    overflow: "hidden",
                  }}
                >
                  {getpublications?.map((item: any, index: any) => {
                    const { users } = item?.data;
                    const isContain = users.filter(
                      (item_: any) =>
                        item_ === getphd_?.data?.email?.stringValue
                    )[0];
                    if (!isContain) return;
                    return (
                      <li key={index} className="mb-2">
                        <BibTexEntryRenderer
                          entry={item?.data}
                          id={item?._id}
                        />
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DetailProfilePHD;
