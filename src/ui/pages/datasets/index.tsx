import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchDatasets } from "../../../services/firebase/getdatasets";
import { Helmet } from "react-helmet";

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
      <Helmet>
        <title>Datasets | {import.meta.env.VITE_APP_TITLE}</title>
      </Helmet>
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
              <div className="card p-3">
                <div
                  id={"carouselExampleControls" + index}
                  className="carousel slide"
                  data-bs-ride="carousel"
                >
                  <div className="carousel-inner">
                    {item.images.map((image__: any, key: number) => {
                      return (
                        <div
                          className={`carousel-item ${key === 0 && "active"}`}
                          key={key}
                        >
                          <img
                            src={image__?.url}
                            className="d-block w-100"
                            alt={"This is image"}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <button
                    className="carousel-control-prev btn btn-dark"
                    type="button"
                    data-bs-target={"#carouselExampleControls" + index}
                    data-bs-slide="prev"
                  >
                    <span
                      className="carousel-control-prev-icon"
                      aria-hidden="true"
                    />
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button
                    className="carousel-control-next  btn btn-dark"
                    type="button"
                    data-bs-target={"#carouselExampleControls" + index}
                    data-bs-slide="next"
                  >
                    <span
                      className="carousel-control-next-icon"
                      aria-hidden="true"
                    />
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Datasets;
