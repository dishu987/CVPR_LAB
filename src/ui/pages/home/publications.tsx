import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPublications } from "../../../services/firebase/getpublications";

const Publications: React.FC<{ ref_: boolean }> = ({ ref_ }) => {
  const getpublications = useSelector(
    (state: any) => state.getpublications.data
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchPublications();
      setLoading(false);
    };
    !ref_ ? fetchData() : "";
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
    <div className={`col-sm-12 container ${!ref_ && "my-5"}`}>
      <h1 className="fw-bold text-danger w-100 my-4">
        {ref_ && "Latest"} Publications
      </h1>
      <hr />
      <div className="overflow-hidden">
        <ul
          className={`p-2 ${ref_ && "marquee_scroll"}`}
          style={{ height: ref_ ? "300px" : "fit-content", overflow: "hidden" }}
        >
          {getpublications?.map((item: any, index: any) => {
            const {
              paperTitle,
              author,
              impact,
              link,
              pages,
              publisher,
              publicationDate,
              volume,
              journalName,
              paperType,
              isbn,
            } = item?.data;
            return (
              <li key={index}>
                <p>
                  <cite>
                    <span className="author">{author?.stringValue},</span>
                    <a
                      href={`https://doi.org/${link.stringValue}`}
                      target="_blank"
                      style={{ textDecoration: "none" }}
                    >
                      <strong
                        className="title text-dark"
                        style={{ display: "inline" }}
                      >
                        "{paperTitle.stringValue}",
                      </strong>
                      <i className="fa-solid fa-aritem-up-right-from-square"></i>
                    </a>
                    <span className="journal" style={{ display: "inline" }}>
                      <i>{journalName.stringValue}</i>,
                    </span>
                    <span className="volume" style={{ display: "inline" }}>
                      {volume.stringValue},{" "}
                    </span>
                    <span className="pages" style={{ display: "inline" }}>
                      {pages.stringValue},{" "}
                    </span>
                    <span className="date" style={{ display: "inline" }}>
                      {publicationDate.stringValue}-{paperType.stringValue}-
                      {isbn.stringValue}-{publisher.stringValue}-
                      {impact.stringValue}
                    </span>
                  </cite>
                </p>
                <hr />
              </li>
            );
          })}
        </ul>
      </div>
      {ref_ && (
        <div className="w-100 my-3">
          <Link to="/publications" className="btn btn-dark text-white">
            See More
          </Link>
        </div>
      )}
    </div>
  );
};

export default Publications;
