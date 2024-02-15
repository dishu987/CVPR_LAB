import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchDatasets } from "../../../services/firebase/getdatasets";

const Datasets: React.FC = () => {
  useEffect(() => {
    fetchDatasets();
  }, []);
  const getdatasets = useSelector((state: any) => state.getdatasets.data);
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
