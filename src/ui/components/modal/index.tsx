import React from "react";

interface T {
  loading?: boolean;
  title?: string;
  datetime?: string;
  setDateTime?: any;
  setTitle?: any;
  setDescription?: any;
  submitHandler: any;
  _id: string;
}

const Modal: React.FC<T> = ({
  loading,
  title,
  datetime,
  setDateTime,
  setDescription,
  setTitle,
  submitHandler,
  _id,
}) => {
  return (
    <div
      className="modal fade"
      id={_id}
      tabIndex={-1}
      aria-labelledby={`${_id}Label`}
      aria-hidden="true"
    >
      <div className="modal-dialog ">
        <div className="modal-content rounded-0 border-none">
          <div className="modal-header">
            <h5 className="modal-title" id={`${_id}Label`}>
              Add News
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <>
              <div className="mb-2">
                <label htmlFor="title" className="form-label">
                  News Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  aria-describedby="title"
                  placeholder="Type Here.."
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={loading}
                  value={title}
                />
              </div>
              <div className="mb-2">
                <label htmlFor="date" className="form-label">
                  Date and Time (if any)
                </label>
                <input
                  type="datetime-local"
                  className="form-control"
                  id="exampleInputPassword1"
                  value={datetime}
                  onChange={(e) => setDateTime(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="mb-2">
                <label htmlFor="date" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="type here.."
                  disabled={loading}
                />
              </div>
            </>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-danger"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={submitHandler}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-1"
                    role="status"
                    aria-hidden="true"
                  />
                  Please Wait..
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
