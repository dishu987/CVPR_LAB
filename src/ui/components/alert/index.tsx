import { useDispatch, useSelector } from "react-redux";
import { getAlertsSuccessAction } from "../../../store/reducers/slice/getalerts";

interface AlertInterface {
  id: string;
  type: string;
  content: string;
}

const Alert: React.FC<AlertInterface> = ({ content, id, type }) => {
  const dispatch = useDispatch();
  const getalerts = useSelector((state: any) => state.getalerts.data);
  return (
    <>
      <div
        className={`alert-anm alert alert-${type} rounded-0 my-1 d-flex flex-nowrap`}
        role="alert"
      >
        <h6>{content}</h6>
        <button
          type="button"
          className="btn-close ms-2"
          onClick={() => {
            dispatch(
              getAlertsSuccessAction(
                getalerts.filter((item_: any) => item_.id != id)
              )
            );
          }}
        ></button>
      </div>
    </>
  );
};

export default Alert;
