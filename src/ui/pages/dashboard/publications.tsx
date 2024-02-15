import { addDoc, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../../firebase";
import {
  deletePublications,
  fetchPublications,
} from "../../../services/firebase/getpublications";
import { useSelector } from "react-redux";

const Publications: any = () => {
  const getpublications = useSelector(
    (state: any) => state.getpublications.data
  );
  const [paperTitle, setPaperTitle] = useState<string>("");
  const [paperType, setPaperType] = useState<string>("");
  const [publisher, setPublisher] = useState<string>("");
  const [publicationDate, setPublicationDate] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [journalName, setJournalName] = useState<string>("");
  const [pages, setPages] = useState<string>("");
  const [volume, setVolume] = useState<string>("");
  const [impact, setImpact] = useState<string>("");
  const [isbn, setIsbn] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchPublications();
  }, []);
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (
      !paperTitle ||
      !paperType ||
      !publisher ||
      !publicationDate ||
      !link ||
      !author ||
      !journalName ||
      !pages ||
      !volume ||
      !impact ||
      !isbn
    ) {
      console.log("Please fill all required fields!");
      return;
    }
    setLoading(true);
    addDoc(collection(db, "publications"), {
      paperTitle,
      paperType,
      publisher,
      publicationDate,
      link,
      author,
      journalName,
      pages,
      volume,
      impact,
      isbn,
    })
      .then(() => {
        alert(
          "Publication has been saved! You can view it in the admin panel."
        );
        setLoading(false);
        window.location.reload();
      })
      .catch((error: any) => {
        alert(`Error adding document: ${error.message}`);
        setLoading(false);
      });
  };
  return (
    <>
      <div className="col-sm-12 col-md-10 col-lg-10 col-xl-10 px-5">
        <div className="w-100 d-flex justify-content-between">
          <h3>List of Publications</h3>
          <button
            className="btn btn-dark btn-sm rounded-0"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            + Add Publication
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
                  Contributors
                </th>
                <th
                  scope="col"
                  className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                >
                  Impact Factor
                </th>

                <th
                  scope="col"
                  className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                >
                  Pages
                </th>
                <th
                  scope="col"
                  className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                >
                  Publisher
                </th>
                <th
                  scope="col"
                  className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                >
                  Publication Date
                </th>
                <th
                  scope="col"
                  className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                >
                  Volume
                </th>
                <th
                  scope="col"
                  className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                >
                  Journal Name
                </th>
                <th
                  scope="col"
                  className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                >
                  Paper Type
                </th>
                <th
                  scope="col"
                  className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                >
                  ISBN
                </th>
                <th
                  scope="col"
                  className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                >
                  Link
                </th>
                <th
                  scope="col"
                  className="top-0 position-sticky bg-dark text-white border-1 border-dark"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {getpublications?.map((item: any, index: number) => {
                const {
                  paperTitle,
                  author,
                  impact,
                  link,
                  pages,
                  publisher,
                  publicationDate,
                  volume,
                  journalName,
                  paperType,
                  isbn,
                } = item?.data;
                return (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td className="fw-bold text-danger">
                      {paperTitle?.stringValue}
                    </td>
                    <td>{author?.stringValue}</td>
                    <td>{impact?.stringValue}</td>
                    <td>{pages?.stringValue}</td>
                    <td>{publisher?.stringValue}</td>
                    <td>{publicationDate?.stringValue}</td>
                    <td>{volume?.stringValue}</td>
                    <td>{journalName?.stringValue}</td>
                    <td>{paperType?.stringValue}</td>
                    <td>{isbn?.stringValue}</td>
                    <td>
                      <a
                        href={link?.stringValue}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-link"
                      >
                        Link
                      </a>
                    </td>
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
                              onClick={() => deletePublications(item._id)}
                            >
                              Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!getpublications.length && (
            <>
              <div className="w-100 text-center">
                <h3 className="fw-bold text-danger">Not Found!</h3>
              </div>
            </>
          )}
        </div>
      </div>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content rounded-0 border-none">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Add New Publication
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} noValidate>
                <label htmlFor="name" className="form-label">
                  Title
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="paperTitle"
                  autoComplete="false"
                  className="form-control mb-3"
                  placeholder="Article Title"
                  value={paperTitle}
                  onChange={(e) => setPaperTitle(e.target.value)}
                  required
                  disabled={loading}
                />
                <div className="col-md-12 d-flex flex-row justify-content-between gap-2 mb-2">
                  <div className="col-md-6">
                    <label htmlFor="type" className="form-label">
                      Type of Article
                      <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control mb-3"
                      name="paperType"
                      value={paperType}
                      onChange={(e) => setPaperType(e.target.value)}
                      required
                      disabled={loading}
                    >
                      <option value="">---select type---</option>
                      <option value="Conference">Conference</option>
                      <option value="Patent">Patent</option>
                      <option value="Journal">Journal</option>
                      <option value="Book">Book</option>
                      <option value="Book Chapter">Book Chapter</option>
                      <option value="Publications">Publications</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="validationDefault02" className="form-label">
                      Publisher
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="publisher"
                      autoComplete="false"
                      className="form-control mb-3"
                      placeholder="ie. IECON 2021 – 47th Annual Conference of the IEEE Industrial Electronics Society"
                      value={publisher}
                      onChange={(e) => setPublisher(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="col-md-12 d-flex flex-row justify-content-between gap-2 mb-2">
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">
                      Year of Publication
                      <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control mb-3"
                      name="publicationDate"
                      value={publicationDate}
                      onChange={(e) => setPublicationDate(e.target.value)}
                      required
                      disabled={loading}
                    >
                      <option value="">---select year---</option>
                      {[...Array(16)].map((_, index) => (
                        <option key={index} value={2008 + index}>
                          {2008 + index}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">
                      DOI Link of Publication
                    </label>
                    <input
                      type="text"
                      name="link"
                      autoComplete="false"
                      className="form-control mb-3"
                      placeholder="ie. ieee standard paper link.."
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="col-md-12 mb-2">
                  <label htmlFor="contributors" className="form-label">
                    Name of the Authors(Comma Separated)
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="authors"
                    onChange={(e) => setAuthor(e.target.value)}
                    id="authors"
                    placeholder="ie. Dr. A, Dr. B, Dr. C"
                    disabled={loading}
                  />
                </div>
                <label htmlFor="validationDefault02" className="form-label">
                  Name of the Article
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="journalName"
                  autoComplete="false"
                  className="form-control mb-3"
                  placeholder="Publication Name"
                  value={journalName}
                  onChange={(e) => setJournalName(e.target.value)}
                  required
                  disabled={loading}
                />
                <div className="col-md-12 d-flex flex-row justify-content-between gap-2 mb-2">
                  <div className="col-md-6">
                    <label htmlFor="validationDefault02" className="form-label">
                      Number of Pages in the Article
                    </label>
                    <input
                      type="text"
                      name="pages"
                      autoComplete="false"
                      className="form-control mb-3"
                      placeholder="Number of Pages"
                      value={pages}
                      onChange={(e) => setPages(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="validationDefault02" className="form-label">
                      Volume of the Article
                    </label>
                    <input
                      type="text"
                      name="volume"
                      autoComplete="false"
                      className="form-control mb-3"
                      placeholder="Volume"
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="col-md-12 d-flex flex-row justify-content-between gap-2 mb-2">
                  <div className="col-md-6">
                    <label htmlFor="validationDefault02" className="form-label">
                      Impact Factor
                    </label>
                    <input
                      type="text"
                      name="impact"
                      autoComplete="false"
                      className="form-control mb-3"
                      placeholder="Impact Factor"
                      value={impact}
                      onChange={(e) => setImpact(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="validationDefault02" className="form-label">
                      ISBN
                    </label>
                    <input
                      type="text"
                      name="isbn"
                      autoComplete="false"
                      className="form-control mb-3"
                      placeholder="ISBN"
                      value={isbn}
                      onChange={(e) => setIsbn(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="mb-3 d-flex gap-1 flex-wrap"></div>
                <button
                  className="btn btn-dark p-3 w-100"
                  type="submit"
                  name="submit"
                  disabled={loading}
                >
                  {loading ? "Please Wait..." : "Submit"}
                </button>
              </form>
            </div>
            {/* <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-danger"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-success">
                Save changes
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Publications;
