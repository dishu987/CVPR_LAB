import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { fetchGallery } from "../../../services/firebase/getgallery";

const Gallery: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [currentImage, setCurrentImage] = useState<string>("");
  const [active, setActive] = useState<boolean>(false);
  const getgallery = useSelector((state: any) => state.getgallery.data);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchGallery();
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
        <title>Gallery | {import.meta.env.VITE_APP_TITLE}</title>
      </Helmet>
      <div className="container my-5 ">
        <h1 className="fw-bold mb-3 text-danger text-center text-lg-start">
          Image Gallery
          <hr />
        </h1>
        <div className="row1 row">
          {chunkArray(getgallery, 4).map((column, columnIndex) => (
            <div className="column1 column" key={columnIndex}>
              {column.map((image: any, index: number) => (
                <img
                  className="shadow-lg rounded-3"
                  key={index}
                  src={image?.bannerURL}
                  style={{ width: "100%" }}
                  onClick={() => {
                    setCurrentImage(image?.bannerURL);
                    setActive(true);
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      {active && (
        <div className="full_screen_image">
          <img src={currentImage} alt="full screen image" />
          <button
            onClick={() => {
              setActive(false);
              setCurrentImage("");
            }}
            className="btn btn-danger"
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default Gallery;

const chunkArray = (array: string[], chunkSize: number) => {
  const chunks: string[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};
