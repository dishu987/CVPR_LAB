import { useEffect, useState } from "react";
import "firebase/storage";
import "firebase/firestore";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../firebase";
import { useSelector } from "react-redux";
import {
  deleteNews,
  editNewsItem,
  fetchNews,
} from "../../../services/firebase/getnews";
import Modal from "../../components/modal";
import { addAlert } from "../../components/alert/push.alert";

const News: any = () => {
  const getnews = useSelector((state: any) => state.getnews).data;
  const [description, setDescription] = useState<string>();
  const [title, setTitle] = useState<string>();
  const [datetime, setDateTime] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    fetchNews();
  }, []);
  const submitHandler = () => {
    if (!description || !title || !datetime) {
      addAlert("danger", "Please fill all required fields.");
      return;
    }
    setLoading(true);
    addDoc(collection(db, "news"), {
      title: title,
      timestamp: datetime,
      description: description,
    })
      .then(() => {
        addAlert(
          "success",
          "News has been saved! You can view it in the admin panel."
        );
        setTitle("");
        setDescription("");
        setLoading(false);
        window.location.reload();
      })
      .catch((error) => {
        addAlert(
          "danger",
          "Error! While adding a News, Check you internet connnection and Try Again later."
        );
        console.error("Error saving image data:", error);
        setLoading(false);
      });
  };
  const editNews = (item: any) => {
    setDateTime(item.datetime1);
    setTitle(item.title);
  };
  return (
    <>
      <div className="col-sm-12 col-md-10 col-lg-10 col-xl-10 px-5">
        <div className="w-100 d-flex justify-content-between">
          <h3>Latest News</h3>
          <button
            className="btn btn-dark btn-sm rounded-0"
            data-bs-toggle="modal"
            data-bs-target="#AddNewsModal"
          >
            + Add News
          </button>
        </div>
        <hr />
        <div className="overflow-auto mt-3" style={{ height: "500px" }}>
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                >
                  Sr. No.
                </th>
                <th
                  scope="col"
                  className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                  style={{ zIndex: "999" }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {getnews?.map((item: any, index: any) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.title}</td>
                    <td>{fnDate(item?.datetime1)}</td>
                    <td>{item.description}</td>
                    <td>
                      <div className="dropdown">
                        <button
                          className="btn btn-secondary dropdown-toggle btn-sm"
                          type="button"
                          id="dropdownMenuButton1"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          Action
                        </button>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuButton1"
                        >
                          <li>
                            <button
                              className="dropdown-item text-danger"
                              onClick={() => deleteNews(item._id)}
                            >
                              Delete
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item text-primary"
                              onClick={() => editNews(item)}
                              data-bs-toggle="modal"
                              data-bs-target={`#EditNewsModal${item._id}`}
                              disabled
                            >
                              Edit
                            </button>
                            <Modal
                              _id={`EditNewsModal${item._id}`}
                              submitHandler={() =>
                                editNewsItem(item._id, {
                                  title: title,
                                  datetime: datetime,
                                })
                              }
                              datetime={datetime}
                              loading={loading}
                              setDescription={setDescription}
                              setDateTime={setDateTime}
                              setTitle={setTitle}
                            />
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!getnews.length && (
            <>
              <div className="w-100 text-center">
                <h3 className="fw-bold text-danger">News Not Found!</h3>
              </div>
            </>
          )}
        </div>
      </div>
      <Modal
        _id="AddNewsModal"
        submitHandler={submitHandler}
        datetime={datetime}
        loading={loading}
        setDescription={setDescription}
        setDateTime={setDateTime}
        setTitle={setTitle}
      />
    </>
  );
};

export default News;

const fnDate = (date: string) => {
  const dateTime = new Date(date);
  const options: any = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  const formattedDateTime = dateTime.toLocaleDateString("en-US", options);
  return formattedDateTime;
};
