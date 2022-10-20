import {
  ChangeEvent,
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

const CreateAgreement = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [signers, setSigners] = useState<string[]>([]);
  const [pdf, setPdf] = useState<Buffer | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!pdf) return;

    (async () => {
      const doc = await pdfjsLib.getDocument(pdf).promise;
      const page = await doc.getPage(currentPage);
      const viewport = page.getViewport({ scale: 1 });

      const context = ref.current!.getContext("2d");
      ref.current!.height = viewport.height;
      ref.current!.width = viewport.width;

      page.render({
        canvasContext: context!,
        viewport,
      });

      setTotalPages(doc.numPages);
    })();
  }, [pdf, currentPage]);

  const handleAddSigner = () => {
    setSigners((signers) => [...signers, ""]);
  };

  const handleUpdateSigner = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    setSigners((signers) =>
      signers.map((signer, i) => {
        if (i === index) return e.target.value;
        return signer;
      })
    );
  };

  const handleFile: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPdf(Buffer.from(await file.arrayBuffer()));
  };

  const handleCanvasClick: MouseEventHandler<HTMLCanvasElement> = async (e) => {
    if (!pdf) return;

    const rect = ref.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = rect.height - (e.clientY - rect.top) - 6;

    const doc = await PDFDocument.load(pdf);

    doc
      .getForm()
      .createTextField(Date.now().toString())
      .addToPage(doc.getPage(currentPage - 1), {
        x,
        y,
        width: 100,
        height: 14,
      });

    setPdf(Buffer.from(await doc.save()));
  };

  return (
    <>
      <form>
        {signers.map((signer, i) => (
          <div key={i}>
            <input
              type="text"
              value={signer}
              onChange={(e) => handleUpdateSigner(e, i)}
            />
          </div>
        ))}
        <button type="button" onClick={handleAddSigner}>
          Add Signer
        </button>
        <input type="file" onChange={handleFile} />
      </form>
      <section>
        <input
          type="number"
          value={currentPage}
          onChange={({ target }) => setCurrentPage(parseInt(target.value))}
        />{" "}
        / {totalPages}
      </section>
      <canvas ref={ref} onClick={handleCanvasClick} />
    </>
  );
};

export default CreateAgreement;
