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
import { addAlert } from "../../components/alert/push.alert";
import BibTexEntryRenderer from "../../components/bibtex.render";
import { fetchphd } from "../../../services/firebase/getphd";
import { BibTexEntry } from "../../../interface/publications.interface";
const months: string[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const Publications: React.FC = () => {
  const getpublications = useSelector(
    (state: any) => state.getpublications.data
  );
  const getauth = useSelector((state: any) => state.getauth);
  const getsupervisors = useSelector((state: any) => state.getsupervisors.data);
  const getphd = useSelector((state: any) => state.getphdStudents.data);
  const [paperTitle, setPaperTitle] = useState<string>("");
  const [paperType, setPaperType] = useState<string>("");
  const [publisher, setPublisher] = useState<string>("");
  const [publicationYear, setPublicationYear] = useState<string>("");
  const [publicationMonth, setPublicationMonth] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [pages, setPages] = useState<string>("");
  const [volume, setVolume] = useState<string>("");
  const [impact, setImpact] = useState<string>("");
  const [isbn, setIsbn] = useState<string>("");
  const [abstract, setAbstract] = useState<string>("");
  const [selectedUsers, setselectedUsers] = useState<string[]>([
    getauth?.email,
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    fetchPublications();
    fetchSupervisors();
    fetchphd();
  }, []);
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (
      !paperTitle ||
      !paperType ||
      !publisher ||
      !publicationYear ||
      !link ||
      !author ||
      !pages ||
      !volume ||
      !impact ||
      !isbn
    ) {
      addAlert("danger", "Please fill all required fields!");
      return;
    }
    setLoading(true);
    addDoc(collection(db, "publications"), {
      type: paperType,
      author: author,
      title: paperTitle,
      year: publicationYear,
      volume: volume,
      journal: publisher,
      pages: pages,
      abstract: abstract || "",
      doi: link || "",
      month: publicationMonth || "",
      isbn: isbn || "", // Book, Proceedings
      users: selectedUsers,
    })
      .then(() => {
        addAlert(
          "success",
          "Paper has been saved! You can view it in the admin panel."
        );
        setLoading(false);
        window.location.reload();
      })
      .catch(() => {
        addAlert("danger", "Error adding Paper! Please try again later.");
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
              data-bs-target="#exampleModal_"
            >
              + Add (By BibTeX)
            </button>
            <button
              className="btn btn-dark btn-sm rounded-0"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              + Add (By Manual)
            </button>
            <button
              className="btn btn-shade1 btn-sm rounded-0"
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
                  Paper
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
                if (
                  !item?.data?.users?.includes(getauth.email) &&
                  !getauth.userType.includes("ADMIN")
                ) {
                  return;
                }
                return (
                  <tr key={index}>
                    <td>
                      <BibTexEntryRenderer entry={item?.data} id={item?._id} />
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
                          {getauth?.userType?.includes("ADMIN") ||
                          item?.data?.users.some(
                            (item_: any) => item_ == getauth.email
                          ) ? (
                            <>
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
                                  className="dropdown-item text-shade2"
                                  onClick={() => deletePublications(item._id)}
                                >
                                  Delete
                                </button>
                              </li>
                            </>
                          ) : (
                            "NA"
                          )}
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
                <h3 className="fw-bold text-shade2">Not Found!</h3>
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
              <div className="alert alert-warning rounded-0">
                Manual addition of Research Paper is not recommended, please use
                the <strong>BibTeX</strong> format for adding of Paper.
              </div>
              <div className="alert alert-info rounded-0">
                If you want to add all fields of Research Paper, Try with{" "}
                <strong>BibTeX</strong> format.
              </div>
              <form onSubmit={handleSubmit} noValidate>
                <div className="col-md-12 d-flex flex-row justify-content-between gap-2 mb-2">
                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label">
                      Title
                      <span className="text-shade2">*</span>
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
                      Select Users
                      <span className="text-shade2">*</span>
                    </label>
                    <select
                      disabled={!getauth.userType.includes("ADMIN") || loading}
                      name="userEmail"
                      className="form-control"
                      onChange={(e) => {
                        const selectedUser = e.target.value;
                        if (!selectedUsers || selectedUser == "") return;
                        if (selectedUser === "other") {
                          let x: any = prompt(
                            "Please enter supervisor Email (ie. user@gmail.com):"
                          );
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
                          <option value={item?.data?.email} key={index}>
                            {item?.data?.name}-{item?.data?.email}
                          </option>
                        );
                      })}
                      {getphd?.map((item: any, index: number) => {
                        return (
                          <option
                            value={item?.data?.email?.stringValue}
                            key={index}
                          >
                            {item?.data?.name?.stringValue},
                            {item?.data?.email?.stringValue}, PHD Student
                          </option>
                        );
                      })}
                      {/* <option value="other">Other</option> */}
                    </select>
                    <div className="d-flex flex-wrap mt-2 gap-2 w-100">
                      {selectedUsers?.map((item: string, index: number) => {
                        return (
                          <span className="badge bg-success" key={index}>
                            {item}{" "}
                            <span
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                if (
                                  !getauth?.userType.includes("ADMIN") ||
                                  loading ||
                                  getauth?.email === item
                                ) {
                                  addAlert(
                                    "danger",
                                    "You can not remove yourself."
                                  );
                                  return;
                                }
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
                      Type of Paper
                      <span className="text-shade2">*</span>
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
                      <span className="text-shade2">*</span>
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
                <div className="col-md-12 d-flex flex-row justify-content-between mb-2">
                  <div className="col-md-4 pe-2">
                    <label htmlFor="email" className="form-label">
                      Year
                      <span className="text-shade2">*</span>
                    </label>
                    <select
                      className="form-control mb-3"
                      name="publicationDate"
                      value={publicationYear}
                      onChange={(e) => setPublicationYear(e.target.value)}
                      required
                      disabled={loading}
                    >
                      <option value="">---select year---</option>
                      {[...Array(40)].map((_, index) => (
                        <option key={index} value={2008 + index}>
                          {1990 + index}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4 pe-2">
                    <label htmlFor="email" className="form-label">
                      Month
                      <span className="text-shade2">*</span>
                    </label>
                    <select
                      className="form-control mb-3"
                      name="publicationDate"
                      value={publicationMonth}
                      onChange={(e) => setPublicationMonth(e.target.value)}
                      required
                      disabled={loading}
                    >
                      <option value="">---select year---</option>
                      {months?.map((_, index) => (
                        <option key={index} value={_}>
                          {_}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="email" className="form-label">
                      DOI Link
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
                    Names of the Authors(Comma Separated)
                    <span className="text-shade2">*</span>
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
                <div className="col-md-12 d-flex flex-row justify-content-between gap-2 mb-2">
                  <div className="col-md-6">
                    <label htmlFor="validationDefault02" className="form-label">
                      Pages
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
                      Volume
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
                <div className="col-md-12 mb-2">
                  <label htmlFor="validationDefault02" className="form-label">
                    Abstract
                  </label>
                  <textarea
                    rows={10}
                    onChange={(e) => setAbstract(e.target.value)}
                    value={abstract}
                    className="form-control"
                    placeholder="Research Abstract.."
                    disabled={loading}
                  />
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

      <ImportCSV
        getphd={getphd}
        getauth={getauth}
        getsupervisors={getsupervisors}
        userEmail={getauth?.email}
      />
      <AddByBibText
        getsupervisors={getsupervisors}
        userType={getauth?.userType}
        getauth={getauth}
        getphd={getphd}
      />
    </>
  );
};

export default Publications;

const AddByBibText: React.FC<any> = ({ getsupervisors, getauth, getphd }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedUsers, setselectedUsers] = useState<string[]>([
    getauth?.email,
  ]);
  const [input, setInput] = useState<string>("");
  const extractVariables = async () => {
    if (!selectedUsers) {
      addAlert("danger", "Please select users!");
      return;
    }
    if (!input) {
      addAlert("danger", "Please input BiBtex text!");
      return;
    }
    try {
      setLoading(true);
      // Regular expression to match each variable in the BibTeX entry
      const regex = /(?<variable>\w+)\s*=\s*{(.*?)(?:}|",|\d{4}\s*-\s*\d{4},)/g;
      const matches = input.matchAll(regex);
      const extractedVariables: Partial<BibTexEntry> = {};
      for (const match of matches) {
        if (match.groups) {
          const { variable }: any = match.groups;
          const value: any = match[2]?.trim();
          extractedVariables[variable as keyof BibTexEntry] = value; // Add 'as keyof BibTexEntry' to ensure compatibility
        }
      }
      const regex_ = /@\s*(\w+)\s*{/g;
      const matches_ = input.matchAll(regex_);
      const extractedTypes_: string[] = [];

      for (const match of matches_) {
        const type = match[1].toLowerCase();
        extractedTypes_.push(type);
      }
      if (!extractedTypes_[0]) {
        addAlert("danger", "Invalid BibTeX format!");
        setLoading(false);
        return;
      }
      const publicationQuery = query(
        collection(db, "publications"),
        where("title", "==", extractedVariables.title)
      );
      const res = await getDocs(publicationQuery);
      if (!res.empty) {
        addAlert(
          "warning",
          "A publication with the same title already exists."
        );
        setLoading(false);
        return;
      }
      await addDoc(collection(db, "publications"), {
        type: extractedTypes_[0] || "",
        author: extractedVariables.author || "",
        booktitle: extractedVariables.booktitle || "",
        title: extractedVariables.title || "",
        year: parseInt(extractedVariables.year as any) || 0,
        volume: extractedVariables.volume || "",
        number: extractedVariables.number || "",
        pages: extractedVariables.pages || "",
        abstract: extractedVariables.abstract || "",
        keywords: extractedVariables.keywords || "",
        doi: extractedVariables.doi || "",
        issn: extractedVariables.issn || "",
        month: extractedVariables.month || "",
        journal: extractedVariables.journal || "", // Article
        editor: extractedVariables.editor || "", // Book, Proceedings
        edition: extractedVariables.edition || "", // Book
        series: extractedVariables.series || "", // Book, Proceedings
        address: extractedVariables.address || "", // Book, Proceedings, Techreport
        isbn: extractedVariables.isbn || "", // Book, Proceedings
        institution: extractedVariables.institution || "", // Techreport
        school: extractedVariables.school || "", // Phdthesis, Mastersthesis
        organization: extractedVariables.organization || "", // Inproceedings, Proceedings
        howpublished: extractedVariables.howpublished || "", // Misc
        users: selectedUsers,
      })
        .then(() => {
          addAlert("success", "Research Paper has been saved");
          setLoading(false);
          window.location.reload();
        })
        .catch(() => {
          addAlert(
            "danger",
            "Error adding Research Paper! Please try again later."
          );
          setLoading(false);
        });
    } catch {
      addAlert("danger", "Invalid BibTeX format!");
    }
    setLoading(false);
  };

  return (
    <div
      className="modal fade"
      id="exampleModal_"
      tabIndex={-1}
      aria-labelledby="exampleModalLabel_"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content rounded-0 border-none">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel_">
              Cite by <cite>"BibTeX"</cite>
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <div className="col-md-12 d-flex flex-row justify-content-between gap-2 mb-2">
              <div className="col-md-12 alert alert-primary rounded-0">
                <label htmlFor="useremail" className="form-label">
                  Select Users
                  <span className="text-shade2">*</span>
                </label>
                <select
                  disabled={!getauth.userType.includes("ADMIN") || loading}
                  name="userEmail"
                  className="form-control"
                  onChange={(e) => {
                    const selectedUser = e.target.value;
                    if (!selectedUsers || selectedUser == "") return;
                    if (selectedUser === "other") {
                      let x: any = prompt(
                        "Please enter supervisor Email (ie. user@gmail.com):"
                      );
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
                      <option value={item?.data?.email} key={index}>
                        {item?.data?.name}-{item?.data?.email}
                      </option>
                    );
                  })}
                  {getphd?.map((item: any, index: number) => {
                    return (
                      <option
                        value={item?.data?.email?.stringValue}
                        key={index}
                      >
                        {item?.data?.name?.stringValue},
                        {item?.data?.email?.stringValue}, PHD Student
                      </option>
                    );
                  })}
                  {/* <option value="other">Other</option> */}
                </select>
                <div className="d-flex flex-wrap mt-2 gap-2 w-100">
                  {selectedUsers?.map((item: string, index: number) => {
                    return (
                      <span className="badge bg-success" key={index}>
                        {item}{" "}
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            if (
                              !getauth?.userType.includes("ADMIN") ||
                              loading ||
                              getauth?.email === item
                            ) {
                              addAlert(
                                "danger",
                                "You can not remove yourself."
                              );
                              return;
                            }
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
            <div className="col-md-12 alert alert-warning rounded-0">
              <div className="">
                {" "}
                <h4 className="alert-heading">Instructions:</h4>
                <p>
                  Please follow these steps to cite a publication with{" "}
                  <strong>BibTeX</strong>:
                </p>
                <ol>
                  <li>
                    Copy a <strong>BibTeX</strong> from a source website ie.
                    IEEE.
                  </li>
                  <li>
                    You can paste both with and without{" "}
                    <strong>Citation & Abstract</strong>.
                  </li>
                  <li>Paste your BibTeX into the black colour box below.</li>
                  <li>
                    Click on the "Submit" button, and wait while processing.
                  </li>
                </ol>
                <hr />
              </div>
              <div className="w-100 mt-2 overflow-auto">
                <textarea
                  disabled={loading}
                  onChange={(e) => setInput(e.target.value)}
                  rows={10}
                  className="form-control bg-dark text-warning rounded-1 placeholder-warning"
                  placeholder="Paste here.."
                ></textarea>
              </div>
            </div>
            <button
              className="btn btn-dark p-3 w-100"
              onClick={extractVariables}
              disabled={loading}
            >
              {loading ? "Please Wait..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ImportCSV: React.FC<{
  getsupervisors: any;
  userEmail: string;
  getauth: any;
  getphd: any;
}> = ({ getsupervisors, userEmail, getauth, getphd }) => {
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [selectedUsers, setselectedUsers] = useState<string[]>([userEmail]);
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
      addAlert("danger", "Error! Please select supervisors.");
      return;
    }
    if (!csvData.length) {
      addAlert("danger", "ERROR! Invalid CSV File Selected.");
      return;
    }
    setLoading(true);
    const promises = csvData.map(async (data: any) => {
      const d = Object.values(data);
      const x = await checkTitleExists(d[2]);
      if (!x) {
        return addDoc(collection(db, "publications"), {
          type: d[0] ? d[0] : "",
          author: d[1] ? d[1] : "",
          title: d[2] ? d[2] : "",
          publisher: d[3] ? d[3] : "",
          year: d[4] ? d[4] : "",
          journal: d[5] ? d[5] : "",
          volume: d[6] ? d[6] : "",
          issue: d[7] ? d[7] : "",
          doi: d[8] ? d[8] : "",
          impact: d[9] ? d[9] : "",
          pages: d[10] ? d[10] : "",
          startPage: d[11] ? d[11] : "",
          endPage: d[12] ? d[12] : "",
          url: d[13] ? d[13] : "",
          language: d[14] ? d[14] : "",
          abstract: d[15] ? d[15] : "",
          keywords: d[16] ? d[16] : "",
          isbn: d[17] ? d[17] : "",
          issn: d[18] ? d[18] : "",
          users: selectedUsers,
        });
      }
    });
    await Promise.all(promises);

    addAlert("success", "Publications have been saved!");
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
                Select Users
                <span className="text-shade2">
                  *(these publications will be shown for selected users)
                </span>
              </label>
              <select
                disabled={!getauth.userType.includes("ADMIN") || loading}
                name="userEmail"
                className="form-control"
                onChange={(e) => {
                  const selectedUser = e.target.value;
                  if (!selectedUsers || selectedUser == "") return;
                  if (selectedUser === "other") {
                    let x: any = prompt(
                      "Please enter supervisor Email (ie. user@gmail.com):"
                    );
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
                    <option value={item?.data?.email} key={index}>
                      {item?.data?.name}-{item?.data?.email}
                    </option>
                  );
                })}
                {getphd?.map((item: any, index: number) => {
                  return (
                    <option value={item?.data?.email?.stringValue} key={index}>
                      {item?.data?.name?.stringValue},
                      {item?.data?.email?.stringValue}, PHD Student
                    </option>
                  );
                })}
                {/* <option value="other">Other</option> */}
              </select>
              <div className="d-flex flex-wrap mt-2 gap-2 w-100">
                {selectedUsers?.map((item: string, index: number) => {
                  return (
                    <span className="badge bg-success" key={index}>
                      {item}{" "}
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          if (
                            !getauth?.userType.includes("ADMIN") ||
                            loading ||
                            getauth?.email === item
                          ) {
                            addAlert("danger", "You can not remove yourself.");
                            return;
                          }
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
                <button
                  className="btn btn-link"
                  onClick={() =>
                    exportToCSV(
                      publications_csv_header,
                      publications_csv_data,
                      "sample_publications_csv"
                    )
                  }
                >
                  Download Sample CSV file
                </button>
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
