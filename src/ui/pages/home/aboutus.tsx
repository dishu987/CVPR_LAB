import { useSelector } from "react-redux";
import { fetchResearchArea } from "../../../services/firebase/getresearcharea";
import { useEffect, useState } from "react";
import { fetchGallery } from "../../../services/firebase/getgallery";
import { Link } from "react-router-dom";

const AboutUs = () => {
  const getsettings = useSelector((state: any) => state.getsettings.data);
  const getResearchArea = useSelector(
    (state: any) => state.getresearcharea?.data
  );
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const getgallery = useSelector((state: any) => state.getgallery.data);
  useEffect(() => {
    fetchGallery();
    fetchResearchArea();
  }, []);

  const handlePrev = () => {
    const newIndex = (activeIndex - 1 + getgallery.length) % getgallery.length;
    setActiveIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = (activeIndex + 1) % getgallery.length;
    setActiveIndex(newIndex);
  };
  return (
    <div className="col-sm-12 py-3 px-4  my-3 mb-5">
      {/* <div className="h1 text-shade2 w-100 text-center mt-4 mb-5">About Us</div> */}
      <div className="col-md-12 col-sm-12 d-flex flex-md-row flex-sm-column flex-column gap-3">
        <div className="col-md-6 col-sm-12 p-lg-2 px-0 py-0">
          <div
            id="carouselExampleCaptions"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-indicators">
              {getgallery.map((item: any, index: any) => (
                <button
                  key={index}
                  type="button"
                  title={item?.title}
                  data-bs-target="#carouselExampleCaptions"
                  data-bs-slide-to={index}
                  className={index === activeIndex ? "active" : ""}
                  aria-current={index === activeIndex ? "true" : "false"}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
            <div className="carousel-inner rounded-2 hover_bg">
              {getgallery.map((item: any, index: any) => (
                <div
                  key={index}
                  className={
                    index === activeIndex
                      ? "carousel-item active"
                      : "carousel-item"
                  }
                >
                  <div
                    style={{ height: "400px", width: "100%" }}
                    className="overflow-hidden"
                  >
                    <img
                      src={item?.bannerURL}
                      className="d-block w-100"
                      alt="banner image"
                      height="100%"
                      width="auto"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              className="carousel-control-prev btn btn-dark"
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide="prev"
              onClick={handlePrev}
              style={{ transition: "0.3s ease all" }}
            >
              <span className="carousel-control-prev-icon" aria-hidden="true" />
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next btn btn-dark"
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide="next"
              onClick={handleNext}
              style={{ transition: "0.3s ease all" }}
            >
              <span className="carousel-control-next-icon" aria-hidden="true" />
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
        <div className="col-md-6 col-sm-12">
          <h1 className="fw-bold text-shade2">Our Objective</h1>
          <hr />
          <p>{getsettings?.about}. Currently, we are dealing with:-</p>
          <ol>
            {getResearchArea?.map((item: any, index: any) => {
              return <li key={index}>{item?.title}</li>;
            })}
          </ol>
          {/* <div className="py-2 px-4 bg-dark text-white"> */}
          <Link
            to="research-areas"
            className="btn btn-shade2"
            style={{ textDecoration: "none" }}
          >
            More
          </Link>
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
