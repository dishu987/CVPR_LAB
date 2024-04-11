import { doc, updateDoc } from "firebase/firestore";
import React, { ChangeEvent, useEffect, useState } from "react";
import { db } from "../../../firebase";
import { fetchPublications } from "../../../services/firebase/getpublications";
import { useSelector } from "react-redux";
import { fetchSupervisors } from "../../../services/firebase/getsupervisors";
import { useParams } from "react-router-dom";
import { addAlert } from "../../components/alert/push.alert";
import { BibTexEntry } from "../../../interface/publications.interface";

const PublicationsEdit: React.FC = () => {
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
  const [data, setData] = useState<BibTexEntry>(publication_?.data);
  const selectedUsers = publication_?.data?.users;
  // publication_?.data?.users.map((item_: any) => {
  //   selectedUsers_?.push(item_);
  // });
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    e.preventDefault(); // Corrected spelling
    setData({ ...data, [e.target.name]: e.target.value }); // Corrected syntax
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!data || !selectedUsers) {
      addAlert("danger", "Please fill all required fields!");
      return;
    }

    setLoading(true);
    const docRef = doc(db, "publications", publication_?._id);
    updateDoc(docRef, { ...data })
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
            <div className="">
              {FormInputFields.map(
                (form_input: FormInputField, index: number) => {
                  if (form_input.type === "textarea") {
                    return (
                      <>
                        {" "}
                        <div className="mb-3">
                          <label
                            htmlFor="exampleInputEmail1"
                            className="form-label"
                          >
                            {form_input.text}
                          </label>
                          <textarea
                            className="form-control"
                            key={index}
                            name={form_input.name}
                            rows={10}
                            value={data[form_input.name] as string}
                            onChange={handleChange}
                            disabled={loading || form_input?.disabled}
                          ></textarea>
                        </div>{" "}
                      </>
                    );
                  } else {
                    return (
                      <div className="mb-3">
                        <label
                          htmlFor="exampleInputEmail1"
                          className="form-label"
                        >
                          {form_input.text}
                        </label>
                        <input
                          className="form-control"
                          type={form_input.type}
                          key={index}
                          name={form_input.name}
                          onChange={handleChange}
                          value={data[form_input.name] as string}
                          disabled={loading || form_input?.disabled}
                        />
                      </div>
                    );
                  }
                }
              )}
            </div>
            <div className="mb-3 d-flex gap-1 flex-wrap"></div>
            <button
              className="btn btn-dark p-3 w-100"
              type="submit"
              name="submit"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PublicationsEdit;
interface FormInputField {
  text: string;
  name: keyof BibTexEntry;
  type: string;
  disabled?: boolean;
}
const FormInputFields: FormInputField[] = [
  {
    text: "Title of Paper",
    name: "title",
    type: "text",
    disabled: true,
  },
  {
    text: "Author(s)",
    name: "author",
    type: "text",
  },
  {
    text: "Year",
    name: "year",
    type: "number",
  },
  {
    text: "Journal",
    name: "journal",
    type: "text",
  },
  {
    text: "Volume",
    name: "volume",
    type: "text",
  },
  {
    text: "Number",
    name: "number",
    type: "text",
  },
  {
    text: "Pages",
    name: "pages",
    type: "text",
  },
  {
    text: "Abstract",
    name: "abstract",
    type: "textarea",
  },
  {
    text: "Keywords",
    name: "keywords",
    type: "textarea",
  },
  {
    text: "DOI",
    name: "doi",
    type: "text",
    disabled: true,
  },
  {
    text: "ISSN",
    name: "issn",
    type: "text",
  },
  {
    text: "Month",
    name: "month",
    type: "text",
  },
];
