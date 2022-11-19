import { ReactNode, RefObject, useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useIPFS } from "../../providers/IPFSProvider";
import Button from "../common/Button";
import { encryptAgreementAndPin } from "../../utils/files";
import {
  createAgreement,
  getAddress,
  signMessage,
} from "../../services/digitalSignatures";
import Stepper from "../common/Stepper";
import iconNames from "../common/icons";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

type AddFieldOptions = {
  x: number;
  y: number;
  page: number;
  identifier: string;
};

const ConfigureAgreement = ({
  pdf,
  onChangePdf,
}: {
  pdf?: Uint8Array;
  onChangePdf: (file: File) => void;
}) => (
  <div>
    <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
      <div className="space-y-1 text-center">
        {pdf ? (
          <>
            {iconNames["check"]}
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
            {iconNames["addPicture"]}
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
  onAddField,
  children,
}: {
  pdf?: Uint8Array;
  currentPage: number;
  canvas: RefObject<HTMLCanvasElement>;
  onAddField: (options: AddFieldOptions) => void;
  children: ReactNode;
}) => {
  const [, drop] = useDrop(
    () => ({
      accept: "signature",
      drop: async (item: { title: string }, monitor) => {
        if (!pdf) return;
        const rect = canvas.current!.getBoundingClientRect();
        console.log(rect, monitor.getSourceClientOffset());
        const x = monitor.getSourceClientOffset()!.x;
        const y =
          rect.height - (monitor.getSourceClientOffset()!.y - rect.top) - 20;

        onAddField({ x, y, page: currentPage, identifier: item.title });
      },
    }),
    [pdf]
  );

  return <div ref={drop}>{children}</div>;
};

const DocumentPreview = ({
  pdf,
  withDrop,
  onAddField,
}: {
  pdf?: Uint8Array;
  withDrop?: boolean;
  onAddField?: any;
}) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

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

      <div className="col-span-2 w-full">
        {withDrop ? (
          <Drop
            pdf={pdf}
            onAddField={onAddField}
            currentPage={currentPage}
            canvas={canvas}
          >
            <canvas ref={canvas} className="w-full" />
          </Drop>
        ) : (
          <canvas ref={canvas} className="w-full" />
        )}
      </div>
    </div>
  );
};

const AddSignatures = ({
  pdf,
  signers,
  onAddSigner,
  onUpdateSigner,
  setCurrentStep,
  onAddField,
}: {
  pdf?: Uint8Array;
  signers: string[];
  onAddSigner: (identifier?: string) => void;
  onUpdateSigner: (oldIdentifier: string) => (newIdentifier: string) => void;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  onAddField: (options: AddFieldOptions) => void;
}) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-5">
        <div className="col-span-3">
          <DocumentPreview pdf={pdf} onAddField={onAddField} withDrop />
        </div>
        <div className="col-span-2">
          <h2 className="text-1xl mb-8 font-semibold text-gray-500">
            Add Signers
          </h2>
          {signers.map((signer, i) => (
            <Signature
              key={i}
              title={signer}
              onSignerChange={onUpdateSigner(signer)}
            />
          ))}
          <Button
            className="mt-8 bg-slate-800"
            iconName="add"
            text="Add Signer"
            onClick={() => onAddSigner()}
          />
          <Button
            className="mt-8 bg-fuchsia-500"
            text="Continue"
            onClick={() => setCurrentStep(2)}
          />
        </div>
      </div>
    </DndProvider>
  );
};

const NewCreateAgreement = () => {
  const router = useRouter();
  const ipfs = useIPFS();
  const [identifier, setIdentifier] = useState("");
  const [pdf, setPdf] = useState<Uint8Array>();
  const [loading, setLoading] = useState<boolean>(false);
  const [pdfDescription, setPdfDescription] = useState<
    { identifier: string; fields: string[] }[]
  >([]);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const handleCreateAgreement = async () => {
    if (!ipfs || !pdf || !signMessage) return;

    try {
      setLoading(true);

      const encryptionPWBytes = await signMessage(
        `Encrypt PDF for ${identifier}`
      );
      const encryptedCid = await encryptAgreementAndPin({
        pdf,
        name: `${await getAddress()}: ${identifier}`,
        encryptionPWBytes,
      });
      const [pdfIPFS, descriptionIPFS] = await Promise.all([
        ipfs.add(pdf, { wrapWithDirectory: false }),
        ipfs.add(JSON.stringify(pdfDescription), { wrapWithDirectory: false }),
      ]);

      const id = await createAgreement({
        identifier,
        cid: pdfIPFS.cid.toV1().toString(),
        encryptedCid,
        descriptionCid: descriptionIPFS.cid.toV1().toString(),
        description: pdfDescription,
      });

      router.push(`/agreements/${id}`);
    } catch (e) {
      console.log(e);
      toast.error("Unable to create agreement");
    } finally {
      setLoading(false);
    }
  };

  const handleNewField = async ({
    x,
    y,
    page,
    identifier,
  }: {
    x: number;
    y: number;
    page: number;
    identifier: string;
  }) => {
    if (!pdf) return;
    const doc = await PDFDocument.load(pdf);

    const fieldName = Date.now().toString();
    const field = doc.getForm().createTextField(Date.now().toString());
    field.setText(`${identifier} signature`);
    field.addToPage(doc.getPage(page - 1), {
      x,
      y,
      width: 100,
      height: 14,
    });

    setPdfDescription((pdfDescription) => {
      const index = pdfDescription.findIndex(
        (signer) => signer.identifier === identifier
      );
      if (index < 0) {
        return [...pdfDescription, { identifier, fields: [fieldName] }];
      }

      return pdfDescription.map((signer) => {
        if (signer.identifier !== identifier) return signer;

        return { ...signer, fields: [...signer.fields, fieldName] };
      });
    });

    setPdf(await doc.save());
  };

  const handleAddSigner = (text?: string) => {
    setPdfDescription((pdfDescription) => [
      ...pdfDescription,
      {
        identifier: text || `New Signer ${pdfDescription.length}`,
        fields: [],
      },
    ]);
  };

  const handleUpdateSigner =
    (oldIdentifier: string) => (newIdentifier: string) => {
      setPdfDescription((pdfDescription) => {
        return pdfDescription.map((signer) => {
          if (signer.identifier !== oldIdentifier) return signer;
          return { ...signer, identifier: newIdentifier };
        });
      });
    };

  const handleFile = async (file: File) => {
    setPdf(new Uint8Array(await file.arrayBuffer()));
  };

  const content = [
    <div className="grid grid-cols-5 gap-20" key={"upload-document"}>
      <div className="xs:col-span-5 md:col-span-2">
        <label
          htmlFor="first-name"
          className="block text-sm font-medium text-gray-700"
        >
          Agreement Identifier
        </label>
        <input
          type="text"
          className="mt-1 mb-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={identifier}
          onChange={({ target }) => setIdentifier(target.value)}
        />
        <ConfigureAgreement pdf={pdf} onChangePdf={handleFile} />
        <Button
          color="bg-fuchsia-500"
          hoverColor="bg-fuchsia-400"
          disabled={!!loading || !pdf}
          text={loading ? "Processing..." : "Continue"}
          onClick={() => setCurrentStep(1)}
        />
      </div>
      {!!pdf && (
        <div className="xs:col-span-5 rounded-md bg-slate-50 p-10 md:col-span-3">
          <DocumentPreview pdf={pdf} />
        </div>
      )}
    </div>,
    <AddSignatures
      key={"add-signatures"}
      pdf={pdf}
      signers={pdfDescription.map((signer) => signer.identifier)}
      onAddSigner={handleAddSigner}
      onUpdateSigner={handleUpdateSigner}
      setCurrentStep={setCurrentStep}
      onAddField={handleNewField}
    />,
    <Button
      key={"review"}
      className="m-auto"
      color="bg-fuchsia-500"
      hoverColor="bg-fuchsia-400"
      text={"Agree and Continue"}
      onClick={handleCreateAgreement}
    />,
  ];

  return (
    <div>
      <h2 className="mb-8 text-2xl font-semibold text-gray-500">
        Create New Agreement
      </h2>
      <div className="m-auto w-9/12">
        <Stepper
          steps={[
            {
              icon: "upload",
              title: "Upload Document",
            },
            {
              icon: "add",
              title: "Add Signers",
            },
            {
              icon: "upload",
              title: "Review",
            },
          ]}
          currentStep={currentStep}
        />
      </div>
      {content[currentStep]}
    </div>
  );
};

export default NewCreateAgreement;
