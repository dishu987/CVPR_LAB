import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchphd } from "../../../services/firebase/getphd";
import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";
import { getResumeURL } from "../../../services/firebase/getresume";
import BibTexEntryRenderer from "../../components/bibtex.render";
import { fetchPublications } from "../../../services/firebase/getpublications";
import { addAlert } from "../../components/alert/push.alert";
import { fetchResearchTopics } from "../../../services/firebase/gettopics";
import { fetchProjectsItems } from "../../../services/firebase/getprojectitems";

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
  let awards_data: string[] = [];
  getphd_?.data?.awards?.arrayValue?.values.map((item_: any) => {
    awards_data.push(item_?.stringValue);
  });
  let educations: any = [];
  getphd_?.data?.educations?.arrayValue?.values?.map((item_: any) => {
    educations.push({
      education_title: item_?.mapValue?.fields?.education_title?.stringValue,
      end_month: item_?.mapValue?.fields?.end_month?.stringValue,
      end_year: item_?.mapValue?.fields?.end_year?.stringValue,
      start_month: item_?.mapValue?.fields?.start_month?.stringValue,
      start_year: item_?.mapValue?.fields?.start_year?.stringValue,
      subject: item_?.mapValue?.fields?.subject?.stringValue,
      university: item_?.mapValue?.fields?.university?.stringValue,
      supervisor: item_?.mapValue?.fields?.supervisor?.stringValue,
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
  const getResearchTopics = useSelector(
    (state: any) => state.getprojectitems?.data
  );
  const getResearchTopics_ = getResearchTopics.filter(
    (item_: any) => item_?.user == getphd_?.data?.email?.stringValue
  );
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchphd();
      await fetchPublications();
      await fetchResearchTopics();
      await fetchProjectsItems();
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
        <title>{getphd_?.data?.name?.stringValue}</title>
      </Helmet>
      <div className="container my-5 ">
        <h1 className="fw-bold mb-3 text-shade2 text-center text-lg-start">
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
                  <h2 className="fw-bold text-shade2">
                    {getphd_?.data?.name?.stringValue}
                  </h2>
                  {getphd_?.data?.current_position?.stringValue}
                  {getphd_?.data?.isAlumni?.booleanValue ? (
                    <div className="fw-bold text-secondary">Alumni Student</div>
                  ) : (
                    <div className="fw-bold text-secondary">
                      Ongoing Student
                    </div>
                  )}
                  <button
                    className="btn btn-shade1 mt-2 btn-sm"
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
                  <hr />
                  <strong>Address: </strong>
                  {getphd_?.data?.address?.stringValue}
                </td>
              </tr>
              <tr>
                <td>
                  <strong className="text-shade2">Name</strong>
                </td>
                <td>{getphd_?.data?.name?.stringValue}</td>
                <td colSpan={3}>
                  <strong className="text-shade2">Email</strong>
                </td>
                <td>{getphd_?.data?.email?.stringValue}</td>
                <td>
                  {" "}
                  <strong className="text-shade2">Batch</strong>
                </td>
                <td>{getphd_?.data?.batch?.stringValue || "N/A"}</td>
              </tr>
              <tr>
                <td>
                  <strong className="text-shade2">Supervisor</strong>
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
                  <strong className="text-shade2">Mobile</strong>
                </td>
                <td colSpan={3}>
                  {getphd_?.data?.mobile?.stringValue || "N/A"}
                </td>
                <td>
                  {" "}
                  <strong className="text-shade2">Personal Email</strong>
                </td>
                <td colSpan={3}>
                  {getphd_?.data?.personal_email?.stringValue || "N/A"}
                </td>
              </tr>
              <tr>
                <td colSpan={1}>
                  <strong className="text-shade2">
                    Research Collaborators
                  </strong>
                </td>
                <td colSpan={7}>
                  <div className="d-flex flex-wrap gap-2">
                    {getphd_?.data?.research_collaborators?.stringValue}
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={1}>
                  <strong className="text-shade2">Research Interests</strong>
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
                  <strong className="text-shade2">Introduction</strong>
                </td>
                <td colSpan={7}>{getphd_?.data?.introduction?.stringValue}</td>
              </tr>
              <tr>
                <td colSpan={1}>
                  <strong className="text-shade2">Profile Links</strong>
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
              <tr>
                <td colSpan={1}>
                  <strong className="text-shade2">Awards</strong>
                </td>
                <td colSpan={7}>
                  <ol>
                    {awards_data.map((award: any) => {
                      return <li>{award}</li>;
                    })}
                  </ol>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="card p-3 mb-4 rounded-0">
            <div className="col-sm-12 d-flex justify-content-between px-lg-0 flex-row flex-wrap">
              <h3 className="fw-bold w-100 mb-3">Education Details</h3>
              <hr />
              <div className="overflow-hidden">
                <ol
                  style={{
                    height: "fit-content",
                    overflow: "hidden",
                  }}
                >
                  {/* PhD (Jan 2016 - August 2020)
                Vision Intelligence Lab
                Computer Science and Engineering
                Malaviya National Institute of Technology Jaipur, India
                Supervisor: Dr. Santosh Kumar Vipparthi */}
                  {educations?.map((education: any, index: any) => {
                    return (
                      <li key={index} className="mb-2">
                        <h5 className="fw-bold">
                          {education?.education_title} ({education?.start_month}{" "}
                          {education?.start_year}
                          to {education?.end_month} {education?.end_year} (
                          {Number(education?.end_year) -
                            Number(education?.start_year)}{" "}
                          Years ))
                        </h5>
                        <p>
                          University/College: {education?.university}
                          <br />
                          Department: {education?.subject}
                          {education?.supervisor && (
                            <>
                              <br />
                              Supervisor: {education?.supervisor}
                            </>
                          )}
                        </p>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          </div>
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
          <div className="card p-3 mb-4">
            <div className="col-sm-12 d-flex justify-content-between px-lg-0 flex-row flex-wrap">
              <h3 className="fw-bold w-100 mb-3">Research Topics</h3>
              <hr />
              <div
                className="accordion w-100 overflow-auto"
                id="accordionExample"
              >
                {getResearchTopics_?.map((item: any, index: any) => {
                  return (
                    <div
                      className="accordion-item w-100 overflow-auto"
                      key={index}
                    >
                      <h1 className="accordion-header" id={"heading" + index}>
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={"#" + "collapse" + index}
                          aria-expanded="true"
                          aria-controls={"collapse" + index}
                        >
                          <h5>
                            <strong className="text-shade2">
                              {index + 1}.{" "}
                            </strong>
                            {item?.title}
                          </h5>
                        </button>
                      </h1>
                      <div className="w-100 overflow-auto col-sm-12">
                        <div
                          id={"collapse" + index}
                          className="accordion-collapse collapse"
                          aria-labelledby={"heading" + index}
                          data-bs-parent="#accordionExample"
                        >
                          <div className="accordion-body">
                            <div
                              className="col-sm-12 mb-3 overflow-auto"
                              key={"item_" + index}
                            >
                              <div className="col-sm-12">
                                <p>
                                  {item?.description} <br />
                                </p>
                              </div>
                              <h5>Links</h5>
                              <p className="mb-4">
                                <Link
                                  className="btn-primary"
                                  style={{
                                    textDecoration: "none",
                                  }}
                                  to={item?.pdfLink}
                                  target="_blank"
                                >
                                  PDF Link
                                </Link>{" "}
                                |{" "}
                                <Link
                                  to={item?.pptLink}
                                  target="_blank"
                                  className="btn-primary"
                                  style={{
                                    textDecoration: "none",
                                  }}
                                >
                                  PPT Link
                                </Link>
                                |{" "}
                                <Link
                                  to={item?.githubLink}
                                  target="_blank"
                                  className="btn-primary"
                                  style={{
                                    textDecoration: "none",
                                  }}
                                >
                                  Github Link
                                </Link>
                              </p>

                              <h5>Image</h5>
                              <hr />
                              <div className="col-sm-12">
                                <img
                                  className="w-100"
                                  src={item?.bannerURL}
                                  alt="Banner Image"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailProfilePHD;
