import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchDatasets } from "../../../services/firebase/getdatasets";

const Datasets: React.FC = () => {
  const getdatasets = useSelector((state: any) => state.getdatasets?.data);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchDatasets();
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
      <div className="container my-5 ">
        <h1 className="fw-bold mb-3 text-danger text-center text-lg-start">
          Datasets
          <hr />
        </h1>
        {getdatasets?.map((item: any, index: any) => {
          return (
            <div className="col-sm-12 card p-3 mb-3" key={index}>
              <h3>
                <strong className="text-danger">{index + 1}. </strong>
                {item?.title}
              </h3>
              <p>{item?.description}</p>
              <img
                src={item?.bannerURL}
                alt="Banner Image"
                className="rounded-3 border border-1 border-secondary"
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Datasets;
