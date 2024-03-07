import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { db } from "../../../firebase";
import {
  deletePublications,
  fetchPublications,
} from "../../../services/firebase/getpublications";
import { useSelector } from "react-redux";
import { fetchSupervisors } from "../../../services/firebase/getsupervisors";
import { Link } from "react-router-dom";
import Papa from "papaparse";
import { exportToCSV } from "../../../utils/exportcsv";
import {
  publications_csv_data,
  publications_csv_header,
} from "../../../utils/publications.sample";

const Publications: React.FC<{ userEmail: string }> = () => {
  const getpublications = useSelector(
    (state: any) => state.getpublications.data
  );
  const getsupervisors = useSelector((state: any) => state.getsupervisors.data);
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
  const [selectedUsers, setselectedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchPublications();
    fetchSupervisors();
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
      users: selectedUsers,
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
          <div className="d-flex justify-content-end gap-2">
            <button
              className="btn btn-dark btn-sm rounded-0"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              + Add Publication
            </button>
            <button
              className="btn btn-danger btn-sm rounded-0"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal1"
            >
              <i className="bx bx-import me-2"></i> Import CSV
            </button>
          </div>
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
                            <Link
                              className="dropdown-item text-primary"
                              to={item?._id}
                            >
                              Edit
                            </Link>
                          </li>
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
                <div className="col-md-12 d-flex flex-row justify-content-between gap-2 mb-2">
                  <div className="col-md-6">
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
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="useremail" className="form-label">
                      Supervisor Email
                      <span className="text-danger">*</span>
                    </label>
                    <select
                      name="userEmail"
                      className="form-control"
                      onChange={(e) => {
                        const selectedUser = e.target.value;
                        if (!selectedUsers) return;
                        if (selectedUser === "other") {
                          let x: any = prompt("Please enter supervisor name:");
                          if (x) {
                            setselectedUsers([...selectedUsers, x]);
                          }
                        } else {
                          if (!selectedUsers.includes(selectedUser)) {
                            setselectedUsers([...selectedUsers, selectedUser]);
                          } else {
                            alert("User with this name already existed.");
                          }
                        }
                      }}
                    >
                      <option value="">--select user--</option>
                      {getsupervisors?.map((item: any, index: number) => {
                        return (
                          <option
                            value={item?.data?.name?.stringValue}
                            key={index}
                          >
                            {item?.data?.name?.stringValue}-
                            {item?.data?.email?.stringValue}
                          </option>
                        );
                      })}
                      <option value="other">Other</option>
                    </select>
                    <div className="d-flex flex-wrap mt-2 gap-2 w-100">
                      {selectedUsers?.map((item: string, index: number) => {
                        return (
                          <span className="badge bg-success" key={index}>
                            {item}{" "}
                            <span
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                if (confirm("Are you sure want to remove?")) {
                                  const tempArr = selectedUsers.filter(
                                    (email) => email !== item
                                  );
                                  setselectedUsers(tempArr);
                                }
                              }}
                            >
                              <i className="ms-2 bx bxs-trash-alt"></i>
                            </span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

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
          </div>
        </div>
      </div>

      <ImportCSV getsupervisors={getsupervisors} />
    </>
  );
};

export default Publications;

const ImportCSV: React.FC<{ getsupervisors: any }> = ({ getsupervisors }) => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedUsers, setselectedUsers] = useState<string[]>([]);
  const [csvData, setCsvData] = useState<Array<Array<string>>>([]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      Papa.parse(selectedFile, {
        complete: (result: any) => {
          // Filter out empty rows
          const nonEmptyRows: any = result.data.filter((row: any) => {
            return Object.values(row).some((value) => value !== "");
          });
          setCsvData(nonEmptyRows);
        },
        header: true, // If CSV file has header row
      });
    }
  };
  const checkTitleExists = async (title: any) => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "publications"), where("paperTitle", "==", title))
      );
      return !querySnapshot.empty;
    } catch (error) {
      return false;
    }
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedUsers.length) {
      alert("Please select supervisors!");
      return;
    }
    if (!csvData.length) {
      alert("ERROR! Invalid CSV File Selected.");
      return;
    }
    setLoading(true);
    const promises = csvData.map(async (data: any) => {
      const d = Object.values(data);
      const x = await checkTitleExists(d[2]);
      if (!x) {
        return addDoc(collection(db, "publications"), {
          paperTitle: d[2],
          paperType: d[0],
          publisher: d[3],
          publicationDate: d[4],
          link: d[7],
          author: d[1],
          journalName: d[5],
          pages: d[9],
          volume: d[6],
          impact: d[8],
          isbn: d[10],
          users: selectedUsers,
        });
      }
    });
    await Promise.all(promises);
    alert("Publications has been saved!");
    setLoading(false);
    window.location.reload();
  };
  return (
    <div
      className="modal fade"
      id="exampleModal1"
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content rounded-0 border-none">
          <div className="modal-header">
            <h5 className="modal-title">Import Publications</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="col mb-3">
              <label htmlFor="useremail" className="form-label">
                Supervisor Email
                <span className="text-danger">
                  *(these publications will be shown for selected supervisors)
                </span>
              </label>
              <select
                name="userEmail"
                className="form-control"
                onChange={(e) => {
                  const selectedUser = e.target.value;
                  if (!selectedUsers || selectedUser === "") return;

                  if (!selectedUsers.includes(selectedUser)) {
                    setselectedUsers([...selectedUsers, selectedUser]);
                  } else {
                    alert("User with this name already existed.");
                  }
                }}
              >
                <option value="">--select user--</option>
                {getsupervisors?.map((item: any, index: number) => {
                  return (
                    <option value={item?.data?.name?.stringValue} key={index}>
                      {item?.data?.name?.stringValue}-
                      {item?.data?.email?.stringValue}
                    </option>
                  );
                })}
              </select>
              <div className="d-flex flex-wrap mt-2 gap-2 w-100">
                {selectedUsers?.map((item: string, index: number) => {
                  return (
                    <span className="badge bg-success" key={index}>
                      {item}{" "}
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          if (confirm("Are you sure want to remove?")) {
                            const tempArr = selectedUsers.filter(
                              (email) => email !== item
                            );
                            setselectedUsers(tempArr);
                          }
                        }}
                      >
                        <i className="ms-2 bx bxs-trash-alt"></i>
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="col mb-3">
              <label htmlFor="csv_file" className="mb-3">
                Select a valid csv file (
                <a
                  href="#"
                  onClick={() =>
                    exportToCSV(
                      publications_csv_header,
                      publications_csv_data,
                      "sample_publications_csv"
                    )
                  }
                >
                  Download Sample CSV file
                </a>
                )
              </label>
              <input
                ref={fileInputRef}
                type="file"
                name="csv_file"
                id="csv_file"
                accept=".csv"
                className="form-control"
                onChange={handleFileChange}
              />
            </div>
            <div className="d-flex gap-1 flex-wrap">
              {csvData.length > 0 && (
                <div
                  className="mt-3 w-100 overflow-auto"
                  style={{ maxHeight: "400px" }}
                >
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        {Object.keys(csvData[0]).map((header) => (
                          <th key={header}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {csvData.map((row, index) => (
                        <tr key={index}>
                          {Object.values(row).map((cell, index) => (
                            <td key={index}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="alert alert-warning rounded-0" role="alert">
                    It will automatically skip the duplicates entries.
                  </div>
                </div>
              )}
            </div>
            <button
              className="btn btn-dark p-3 w-100"
              type="submit"
              name="submit"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? "Please Wait..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
