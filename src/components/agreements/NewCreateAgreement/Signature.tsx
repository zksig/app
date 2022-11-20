import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { useDrag } from "react-dnd";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

type AddFieldOptions = {
  x: number;
  y: number;
  page: number;
  identifier: string;
};

const Signature = ({
  title,
  onSignerChange,
}: {
  title: string;
  onSignerChange: (text: string) => void;
}) => {
  const [editing, setEditing] = useState(true);
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "signature",
      item: () => ({ title }),
      collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
    }),
    [title]
  );

  return (
    <div className="mt-2 flex items-center gap-2">
      {editing ? (
        <>
          <input
            style={{ fontSize: "14px", width: "100px" }}
            value={title}
            onChange={({ target }) => onSignerChange(target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
            onClick={() => setEditing(false)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </>
      ) : (
        <>
          <div
            ref={drag}
            className="rounded bg-purple-500 px-2 text-center"
            style={{
              fontSize: "14px",
              width: "100px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
            onClick={() => setEditing(true)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
        </>
      )}
    </div>
  );
};

export default Signature;
