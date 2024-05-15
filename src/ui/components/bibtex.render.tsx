import React from "react";

const BibTexEntryRenderer: React.FC<{ entry: any; id: string }> = ({
  entry,
  id,
}) => {
  return (
    <div>
      <p>
        {entry?.author}, <strong>"{entry?.title},"</strong> in{" "}
        {entry?.booktitle}
        {entry?.journal && `, ${entry?.journal}`}
        {entry?.volume && `, vol. ${entry?.volume}`}
        {entry?.number && `, no. ${entry?.number}`}
        {entry?.pages && `, pp. ${entry?.pages}`}
        {entry?.year && `, ${entry?.year}`}
        {entry.doi && (
          <>
            ,{" "}
            <a
              href={`https://doi.org/${entry.doi}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              doi: {entry.doi}
            </a>
          </>
        )}
      </p>
      <p>
        Keywords: {"{ " + entry?.keywords + " }"}, Abstract:{" "}
        <a
          className="text-shade2 my-0 py-0"
          data-bs-toggle="collapse"
          href={"#collapseExample" + id}
          role="button"
          aria-expanded="false"
          aria-controls={"collapseExample" + id}
        >
          Click
        </a>
      </p>
      <p className="collapse collapsed my-0" id={"collapseExample" + id}>
        {entry?.abstract}
      </p>
    </div>
  );
};

export default BibTexEntryRenderer;
