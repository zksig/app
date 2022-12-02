import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import Drop from "./Drop";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

type AddFieldOptions = {
  x: number;
  y: number;
  page: number;
  identifier: string;
};

const DocumentPreview = ({
  pdf,
  withDrop,
  onAddField,
  docSignatureHeight,
  docSignatureWidth,
}: {
  pdf?: Uint8Array;
  withDrop?: boolean;
  onAddField?: any;
  docSignatureHeight: number;
  docSignatureWidth: number;
}) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [inDropZone, setInDropZone] = useState(false);

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
    <div>
      <section className="col-span-2 my-4 mx-auto text-center">
        <input
          className="w-8 border-none bg-slate-50 p-0"
          type="number"
          value={currentPage}
          onChange={({ target }) => setCurrentPage(parseInt(target.value))}
        />{" "}
        / {totalPages}
      </section>

      <div
        className="col-span-2 w-full"
        style={{
          border: `1px #${inDropZone ? "D946EF" : "98A0B2"} solid`,
          borderRadius: "8px",
          marginLeft: "40px",
        }}
      >
        {withDrop ? (
          <Drop
            pdf={pdf}
            onAddField={onAddField}
            currentPage={currentPage}
            canvas={canvas}
            setInDropZone={setInDropZone}
            docSignatureWidth={docSignatureWidth}
            docSignatureHeight={docSignatureHeight}
          >
            <canvas ref={canvas} className="w-full" id="canvas" />
          </Drop>
        ) : (
          <canvas ref={canvas} className="w-full" />
        )}
      </div>
    </div>
  );
};

export default DocumentPreview;
