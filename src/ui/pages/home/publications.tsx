import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPublications } from "../../../services/firebase/getpublications";
import { Helmet } from "react-helmet";
import BibTexEntryRenderer from "../../components/bibtex.render";

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
        <h4>Please Wait..</h4>
      </div>
    );
  }
  return (
    <div className={`col-sm-12 container ${!ref_ && "my-5"}`}>
      <h1 className="fw-bold text-shade2 w-100 my-4">
        {ref_ && "Latest"} Publications
      </h1>
      <hr />
      <div
        className="overflow-hidden"
        style={{ height: ref_ ? "370px" : "fit-content" }}
      >
        <ol
          className={`px-0 ${ref_ && "marquee_scroll"}`}
          style={{ height: "fit-content", overflow: "hidden" }}
        >
          {getpublications?.map((item: any, index: any) => {
            return (
              <li key={index} className="card rounded-2 mb-2 p-2">
                <BibTexEntryRenderer entry={item?.data} id={item?._id} />
              </li>
            );
          })}
        </ol>
      </div>
      {ref_ && (
        <div className="w-100 my-3">
          <Link to="/publications" className="btn btn-dark text-white">
            See More
          </Link>
        </div>
      )}
      {!ref_ && (
        <Helmet>
          <title>Publications </title>
        </Helmet>
      )}
    </div>
  );
};

export default Publications;
