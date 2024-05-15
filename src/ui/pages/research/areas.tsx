import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchResearchArea } from "../../../services/firebase/getresearcharea";
import { fetchSubAreas } from "../../../services/firebase/getsubareas";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const ResearchAreas: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const getResearchArea = useSelector(
    (state: any) => state.getresearcharea?.data
  );
  const getsubareas1 = useSelector((state: any) => state.getsubareas).data;
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchResearchArea();
      await fetchSubAreas();
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
        <title>Research Areas </title>
      </Helmet>
      <div className="container my-5 ">
        <h1 className="fw-bold mb-3 text-shade2 text-center text-lg-start">
          Research Areas
          <hr />
        </h1>
        {getResearchArea?.map((item: any, index: any) => {
          const subareasArray = item?.subareas || [];
          const getsubareas = getsubareas1?.filter((item: any) =>
            subareasArray.some(
              (subarea: any) => subarea.stringValue === item?._id
            )
          );
          if ((index + 1) % 2 !== 0) {
            return (
              <div
                className="col-sm-12 d-flex flex-wrap flex-row card p-3 mb-4"
                key={index}
              >
                <div className="col-sm-6 pe-3">
                  <img
                    src={item?.bannerURL}
                    alt="Banner Image"
                    style={{ width: "100%" }}
                    className="rounded-3 border border-1 border-secondary"
                  />
                </div>
                <div className="col-sm-8=6">
                  <h3>
                    <strong className="text-shade2">{index + 1}. </strong>
                    {item?.title}
                  </h3>
                  <p>
                    <ul>
                      {getsubareas?.map((item_: any, i_: any) => {
                        return <li key={i_}>{item_?.title}</li>;
                      })}
                    </ul>
                    {getsubareas?.length !== 0 && (
                      <Link to={"/research-areas/" + item?._id}>
                        <button className="ms-4 btn btn-shade1 btn-sm">
                          See More
                        </button>
                      </Link>
                    )}
                  </p>
                </div>
              </div>
            );
          } else {
            return (
              <div
                className="col-sm-12 d-flex flex-wrap flex-row card p-3 mb-4"
                key={index}
              >
                <div className="col-sm-6">
                  <h3>
                    <strong className="text-shade2">{index + 1}. </strong>
                    {item?.title}
                  </h3>
                  <p>
                    <ul>
                      {getsubareas?.map((item_: any, i_: any) => {
                        return <li key={i_}>{item_?.title}</li>;
                      })}
                    </ul>
                    {getsubareas?.length !== 0 && (
                      <Link to={"/research-areas/" + item?._id}>
                        <button className="ms-4 btn btn-shade1 btn-sm">
                          See More
                        </button>
                      </Link>
                    )}
                  </p>
                </div>
                <div className="col-sm-6 pe-3">
                  <img
                    src={item?.bannerURL}
                    alt="Banner Image"
                    style={{ width: "100%" }}
                    className="rounded-3 border border-1 border-secondary"
                  />
                </div>
              </div>
            );
          }
        })}
      </div>
    </>
  );
};

export default ResearchAreas;
