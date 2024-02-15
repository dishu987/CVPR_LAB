import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchResearchArea } from "../../../services/firebase/getresearcharea";
import { fetchSubAreas } from "../../../services/firebase/getsubareas";

const ResearchAreas: React.FC = () => {
  useEffect(() => {
    fetchResearchArea();
    fetchSubAreas();
  }, []);
  const getResearchArea = useSelector(
    (state: any) => state.getresearcharea?.data
  );
  const getsubareas1 = useSelector((state: any) => state.getsubareas).data;
  return (
    <>
      <div className="container my-5 ">
        <h1 className="fw-bold mb-3 text-danger text-center text-lg-start">
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
                    <strong className="text-danger">{index + 1}. </strong>
                    {item?.title}
                  </h3>
                  <p>
                    <ul>
                      {getsubareas?.map((item_: any, i_: any) => {
                        return <li key={i_}>{item_?.title}</li>;
                      })}
                    </ul>
                    {getsubareas?.length !== 0 && (
                      <button
                        className="ms-4 btn btn-outline-danger btn-sm"
                        onClick={() =>
                          (location.href = "/research-areas/" + item?._id)
                        }
                      >
                        See More
                      </button>
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
                    <strong className="text-danger">{index + 1}. </strong>
                    {item?.title}
                  </h3>
                  <p>
                    <ul>
                      {getsubareas?.map((item_: any, i_: any) => {
                        return <li key={i_}>{item_?.title}</li>;
                      })}
                    </ul>
                    {getsubareas?.length !== 0 && (
                      <button
                        className="ms-4 btn btn-outline-danger btn-sm"
                        onClick={() =>
                          (location.href = "/research-areas/" + item?._id)
                        }
                      >
                        See More
                      </button>
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
