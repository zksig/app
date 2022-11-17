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
} from "../../services/filecoin";
import { Tab } from "@headlessui/react";
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
        const x = monitor.getSourceClientOffset()!.x - rect.left;
        const y =
          rect.height - (monitor.getSourceClientOffset()!.y - rect.top) - 20;

        onAddField({ x, y, page: currentPage, identifier: item.title });
      },
    }),
    [pdf]
  );

  return <div ref={drop}>{children}</div>;
};

const AddSignatures = ({
  pdf,
  signers,
  onAddSigner,
  onUpdateSigner,
  onAddField,
}: {
  pdf?: Uint8Array;
  signers: string[];
  onAddSigner: (identifier?: string) => void;
  onUpdateSigner: (oldIdentifier: string) => (newIdentifier: string) => void;
  onAddField: (options: AddFieldOptions) => void;
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
            onAddField={onAddField}
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
                onSignerChange={onUpdateSigner(signer)}
              />
            ))}
            <Button
              className="m-auto"
              iconName="add"
              text="Add Signer"
              color="bg-fuchsia-500"
              hoverColor="bg-fuchsia-400"
              onClick={() => onAddSigner()}
            />
          </div>
        </div>
      </>
    </DndProvider>
  );
};

const CreateAgreement = () => {
  const router = useRouter();
  const ipfs = useIPFS();
  const [selectedTab, setSelectedTab] = useState(0);
  const [identifier, setIdentifier] = useState("");
  const [pdf, setPdf] = useState<Uint8Array>();
  const [loading, setLoading] = useState<boolean>(false);
  const [pdfDescription, setPdfDescription] = useState<
    { identifier: string; fields: string[] }[]
  >([]);

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

  return (
    <div>
      <h1 className="text-4xl">Create New Agreement</h1>
      <div className="w-full px-2 py-8 sm:px-0">
        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-1 rounded-xl bg-slate-900 p-1">
            <Tab
              className={({ selected }) =>
                `focus:ring-2" w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-slate-900 ring-white ring-opacity-60 ring-offset-2 ring-offset-purple-400 focus:outline-none ${
                  selected
                    ? "bg-purple-500 text-white"
                    : "bg-slate-50 text-slate-900"
                }`
              }
            >
              1. Upload PDF
            </Tab>
            <Tab
              disabled={!pdf}
              className={({ selected }) =>
                `focus:ring-2" w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-purple-400 focus:outline-none ${
                  selected
                    ? "bg-purple-500 text-white"
                    : "bg-slate-50 text-slate-900"
                }`
              }
            >
              {" "}
              2. Add Fields
            </Tab>
            <Tab
              disabled={pdfDescription.length === 0}
              className={({ selected }) =>
                `focus:ring-2" w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-slate-900 ring-white ring-opacity-60 ring-offset-2 ring-offset-purple-400 focus:outline-none ${
                  selected
                    ? "bg-purple-500 text-white"
                    : "bg-slate-50 text-slate-900"
                }`
              }
            >
              3. Complete
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Agreement Identifier
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={identifier}
                  onChange={({ target }) => setIdentifier(target.value)}
                />
              </div>
              <ConfigureAgreement pdf={pdf} onChangePdf={handleFile} />
              <div className="flex justify-end">
                <Button text="Next" onClick={() => setSelectedTab(1)} />
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="flex justify-end">
                <Button text="Next" onClick={() => setSelectedTab(2)} />
              </div>
              <AddSignatures
                pdf={pdf}
                signers={pdfDescription.map((signer) => signer.identifier)}
                onAddSigner={handleAddSigner}
                onUpdateSigner={handleUpdateSigner}
                onAddField={handleNewField}
              />
            </Tab.Panel>
            <Tab.Panel>
              <Button
                className="m-auto"
                color="bg-fuchsia-500"
                hoverColor="bg-fuchsia-400"
                disabled={!!loading}
                icon={
                  loading ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="mr-3 h-5 w-5 animate-spin-slow"
                    >
                      <line x1="12" y1="2" x2="12" y2="6"></line>
                      <line x1="12" y1="18" x2="12" y2="22"></line>
                      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                      <line x1="2" y1="12" x2="6" y2="12"></line>
                      <line x1="18" y1="12" x2="22" y2="12"></line>
                      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                    </svg>
                  ) : (
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
                        d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
                      />
                    </svg>
                  )
                }
                text={loading ? "Processing..." : "Create Agreement"}
                onClick={handleCreateAgreement}
              />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default CreateAgreement;
