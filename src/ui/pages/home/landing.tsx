import { Link } from "react-router-dom";
import Slider from "../../components/slider";
import AboutUs from "./aboutus";
import Publications from "./publications";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchNews } from "../../../services/firebase/getnews";

const Landing: React.FC = () => {
  const getnews = useSelector((state: any) => state.getnews.data);
  useEffect(() => {
    fetchNews();
  }, []);
  return (
    <>
      <Slider />
      <div className="col-sm-12 d-flex justify-content-around flex-md-row flex-column flex-sm-column p-4 container mt-4">
        <div className="col-sm-8">
          <Publications ref_={true} />
        </div>
        <div className="col-sm-4">
          <div className="border d-flex flex-column mt-4">
            <div>
              <h3 className="py-2  px-4 bg-danger text-white">Updates</h3>
            </div>
            <div
              className="overflow-hidden"
              style={{ overflow: "hidden", height: "400px" }}
            >
              <div className="marquee_scroll ">
                <div className="text-secondary">
                  <ul style={{ listStyle: "none" }}>
                    {getnews?.map((item: any, _index: any) => {
                      if (_index > 5) {
                        return;
                      }
                      return (
                        <li key={_index}>
                          <strong className="text-danger me-1">
                            {_index + 1}.
                          </strong>
                          {item?.title}-{item?.datetime1}-{item?.description}|
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <div className="py-2 px-4 bg-dark text-white">
                <Link
                  to="#"
                  className="text-white mx-2"
                  style={{ textDecoration: "none" }}
                >
                  More News
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AboutUs />
    </>
  );
};

export default Landing;
