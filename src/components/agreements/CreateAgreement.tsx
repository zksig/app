import { ReactNode, RefObject, useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

const ConfigureAgreement = ({
  pdf,
  onChangePdf,
}: {
  pdf: Buffer | null;
  onChangePdf: (file: File) => void;
}) => (
  <div>
    <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
      <div className="space-y-1 text-center">
        {pdf ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="mx-auto h-12 w-12 text-gray-400 text-green-500"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-medium text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2 hover:text-green-400"
              >
                <span>Change PDF Agreement</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={({ target }) => {
                    if (!target.files) return;
                    onChangePdf(target.files[0]);
                  }}
                />
              </label>
            </div>
          </>
        ) : (
          <>
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-medium text-purple-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2 hover:text-purple-500"
              >
                <span>Upload a PDF Agreement</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={({ target }) => {
                    if (!target.files) return;
                    onChangePdf(target.files[0]);
                  }}
                />
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
);

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

const Drop = ({
  pdf,
  currentPage,
  canvas,
  onUpdatePdf,
  children,
}: {
  pdf: Buffer | null;
  currentPage: number;
  canvas: RefObject<HTMLCanvasElement>;
  children: ReactNode;
  onUpdatePdf: (pdf: Buffer) => void;
}) => {
  const [, drop] = useDrop(
    () => ({
      accept: "signature",
      drop: async (item: { title: string }, monitor) => {
        if (!pdf) return;

        const rect = canvas.current!.getBoundingClientRect();
        const x = monitor.getSourceClientOffset()!.x - rect.left;
        const y =
          rect.height - (monitor.getSourceClientOffset()!.y - rect.top) - 20;

        const doc = await PDFDocument.load(pdf);

        const field = doc.getForm().createTextField(Date.now().toString());
        field.setText(`${item.title} signature`);
        field.addToPage(doc.getPage(currentPage - 1), {
          x,
          y,
          width: 100,
          height: 14,
        });

        onUpdatePdf(Buffer.from(await doc.save()));
      },
    }),
    [pdf]
  );

  return <div ref={drop}>{children}</div>;
};

const AddSignatures = ({
  pdf,
  onUpdatePdf,
}: {
  pdf: Buffer | null;
  onUpdatePdf: (pdf: Buffer) => void;
}) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [signers, setSigners] = useState<string[]>([]);

  const handleAddSigner = (text: string) => {
    setSigners((signers) => [...signers, text]);
  };

  const handleUpdateSigner = (index: number) => (text: string) => {
    setSigners((signers) =>
      signers.map((signer, i) => {
        if (i === index) return text;
        return signer;
      })
    );
  };

  useEffect(() => {
    if (!pdf) return;

    (async () => {
      const doc = await pdfjsLib.getDocument(pdf).promise;
      const page = await doc.getPage(currentPage);
      const viewport = page.getViewport({ scale: 1 });

      const context = canvas.current!.getContext("2d");
      canvas.current!.height = viewport.height;
      canvas.current!.width = viewport.width;

      setTotalPages(doc.numPages);

      await page.render({
        canvasContext: context!,
        viewport,
      });
    })();
  }, [canvas, pdf, currentPage]);

  return (
    <DndProvider backend={HTML5Backend}>
      <>
        <section className="my-4 mx-auto text-center">
          <input
            className="w-8 border-none bg-slate-50 p-0"
            type="number"
            value={currentPage}
            onChange={({ target }) => setCurrentPage(parseInt(target.value))}
          />{" "}
          / {totalPages}
        </section>

        <div className="grid grid-cols-2">
          <Drop
            pdf={pdf}
            onUpdatePdf={onUpdatePdf}
            currentPage={currentPage}
            canvas={canvas}
          >
            <canvas ref={canvas} />
          </Drop>

          <div>
            {signers.map((signer, i) => (
              <Signature
                key={i}
                title={signer}
                onSignerChange={handleUpdateSigner(i)}
              />
            ))}
            <button
              className="m-auto my-4 flex w-48 justify-center gap-2 rounded bg-fuchsia-500 p-2 text-center text-white"
              type="button"
              onClick={() => handleAddSigner("New Signer")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <span>Add Signer</span>
            </button>
          </div>
        </div>
      </>
    </DndProvider>
  );
};

const CreateAgreement = () => {
  const [pdf, setPdf] = useState<Buffer | null>(null);

  const handleFile = async (file: File) => {
    setPdf(Buffer.from(await file.arrayBuffer()));
  };

  return (
    <div>
      <h1 className="mb-8 text-4xl">Create New Agreement</h1>
      <ConfigureAgreement pdf={pdf} onChangePdf={handleFile} />
      <AddSignatures pdf={pdf} onUpdatePdf={setPdf} />
    </div>
  );
};

export default CreateAgreement;
