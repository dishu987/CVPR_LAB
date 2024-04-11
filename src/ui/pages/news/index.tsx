import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { fetchNews } from "../../../services/firebase/getnews";
import { formatDate } from "../../../utils/format.date";

const News: React.FC = () => {
  const getnews = useSelector((state: any) => state.getnews.data);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchNews();
      setLoading(false);
    };
    fetchData();
  }, []);
  return (
    <>
      <Helmet>
        <title>News | {import.meta.env.VITE_APP_TITLE}</title>
      </Helmet>
      <div className="my-5 container">
        <h1 className="fw-bold mb-4 text-danger text-center text-lg-start">
          Latest News
          <hr />
        </h1>
        <div className="">
          <table className="table table-bordered table-hover table-responsive">
            <thead>
              <tr>
                <th scope="col" className="fw-bold text-white bg-dark">
                  Sr. No.
                </th>
                <th scope="col" className="fw-bold text-white bg-dark">
                  Title
                </th>
                <th scope="col" className="fw-bold text-white bg-dark">
                  Description
                </th>
                <th scope="col" className="fw-bold text-white bg-dark">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={4}>
                    <h2 className="fw-bold text-center my-5 text-danger">
                      Loading...
                    </h2>
                  </td>
                </tr>
              )}
              {!loading &&
                getnews.length > 0 &&
                getnews?.map((item: any, _index: any) => {
                  if (_index > 5) {
                    return;
                  }
                  return (
                    <tr key={_index}>
                      <td>{_index + 1}</td>
                      <td className="fw-bold text-danger">{item?.title}</td>
                      <td>{item?.description}</td>
                      <td>{formatDate(item?.datetime1)}</td>
                    </tr>
                  );
                })}
              {getnews.length < 1 && (
                <tr>
                  <td colSpan={4}>
                    <h2 className="fw-bold text-center my-5 text-danger">
                      No Data
                    </h2>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default News;
