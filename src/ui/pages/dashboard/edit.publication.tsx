import { doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { fetchPublications } from "../../../services/firebase/getpublications";
import { useSelector } from "react-redux";
import { fetchSupervisors } from "../../../services/firebase/getsupervisors";
import { useParams } from "react-router-dom";
import { addAlert } from "../../components/alert/push.alert";

const PublicationsEdit: React.FC<{}> = () => {
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fn = async () => {
      setLoading(true);
      await fetchPublications();
      await fetchSupervisors();
      setLoading(false);
    };
    fn();
  }, []);
  const { id } = useParams();
  const getpublications = useSelector(
    (state: any) => state.getpublications.data
  );
  const publication_ = getpublications.filter(
    (item_: any) => item_._id == id
  )[0];
  const getsupervisors = useSelector((state: any) => state.getsupervisors.data);
  const [paperTitle, setPaperTitle] = useState<string>(
    publication_?.data?.paperTitle?.stringValue
  );
  const [paperType, setPaperType] = useState<string>(
    publication_?.data?.paperType?.stringValue
  );
  const [publisher, setPublisher] = useState<string>(
    publication_?.data?.publisher?.stringValue
  );
  const [publicationDate, setPublicationDate] = useState<string>(
    publication_?.data?.publicationDate?.stringValue
  );
  const [link, setLink] = useState<string>(
    publication_?.data?.link?.stringValue
  );
  const [author, setAuthor] = useState<string>(
    publication_?.data?.author?.stringValue
  );
  const [journalName, setJournalName] = useState<string>(
    publication_?.data?.journalName?.stringValue
  );
  const [pages, setPages] = useState<string>(
    publication_?.data?.pages?.stringValue
  );
  const [volume, setVolume] = useState<string>(
    publication_?.data?.volume?.stringValue
  );
  const [impact, setImpact] = useState<string>(
    publication_?.data?.impact?.stringValue
  );
  const [isbn, setIsbn] = useState<string>(
    publication_?.data?.isbn?.stringValue
  );
  const selectedUsers_: string[] = [];
  publication_?.data?.users?.arrayValue?.values?.map((item_: any) => {
    selectedUsers_?.push(item_.stringValue);
  });
  const [selectedUsers, setselectedUsers] = useState<string[]>(selectedUsers_);

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
      addAlert("danger", "Please fill all required fields!");
      return;
    }

    setLoading(true);
    const docRef = doc(db, "publications", publication_?._id);
    updateDoc(docRef, {
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
        addAlert("success", "Publication has been updated!");
        setLoading(false);
        window.location.href =
          import.meta.env.VITE_APP_redirect_rules + "#/dashboard/publications";
      })
      .catch(() => {
        addAlert("danger", "Error updating publication, Try again.");
        setLoading(false);
      });
  };
  if (!publication_) {
    window.history.back();
    return;
  }
  return (
    <>
      <div className="col-sm-12 col-md-10 col-lg-10 col-xl-10 px-5">
        <div className="w-100 d-flex justify-content-between">
          <h3>Edit Publication</h3>
          <button
            className="btn btn-danger btn-sm rounded-0"
            onClick={() =>
              (window.location.href =
                import.meta.env.VITE_APP_redirect_rules +
                "#/dashboard/publications")
            }
          >
            Back to Publications
          </button>
        </div>
        <hr />
        <div className="card p-3">
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
                  disabled={loading}
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
                      <option value={item?.data?.name?.stringValue} key={index}>
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
                value={author}
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
    </>
  );
};

export default PublicationsEdit;
