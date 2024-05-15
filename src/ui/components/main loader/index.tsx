import { useSelector } from "react-redux";
import "./style.css";
import CanvasAnimation from "../bg";
const MainLoader: React.FC = () => {
  const getsettings = useSelector((state: any) => state.getsettings.data);
  return (
    <div
      className="d-flex justify-content-center align-items-center w-100 flex-wrap loader_bg"
      style={{ height: "100vh", position: "relative", overflow: "hidden" }}
    >
      <div className="position-absolute opacity-25">
        <CanvasAnimation
          background="--primary-dark"
          height="100vh"
          width="100vw"
          fillColor="--secondary-light"
        />
      </div>
      <div
        className="wrapper d-flex justify-content-center align-items-center w-100 flex-wrap"
        style={{ position: "absolute", top: "0%", height: "100vh" }}
      >
        <h1>{getsettings?.name ? getsettings?.name : "Please Wait.."}</h1>
      </div>
    </div>
  );
};

export default MainLoader;
