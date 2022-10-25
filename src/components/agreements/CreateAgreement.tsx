import { ReactNode, RefObject, useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import * as anchor from "@project-serum/anchor";
import { HTML5Backend } from "react-dnd-html5-backend";
import Button from "../common/Button";
import { useIPFS } from "../../providers/IPFSProvider";
import { getProgram, getProvider } from "./utils";
import { PublicKey } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";
import {
  web3
} from "@project-serum/anchor";
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
  onAddField,
  children,
}: {
  pdf: Buffer | null;
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
  pdf: Buffer | null;
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
              onClick={() => onAddSigner()}
            />
          </div>
        </div>
      </>
    </DndProvider>
  );
};

const CreateAgreement = () => {
  const ipfs = useIPFS();
  const {connection} = useConnection();
  const [pdf, setPdf] = useState<Buffer | null>(null);
  const [pdfDescription, setPdfDescription] = useState<
    Record<string, string[]>
  >({});

  const handleCreateAgreement = async () => {
    if (!ipfs || !pdf) return;

    const [pdfIPFS, descriptionIPFS] = await Promise.all([
      ipfs.add(pdf),
      ipfs.add(JSON.stringify(pdfDescription)),
    ]);

    const res = await fetch("/api/agreements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cid: pdfIPFS.cid.toV1().toString(),
        description_cid: descriptionIPFS.cid.toV1().toString(),
        description: pdfDescription,
      }),
      credentials: "include",
    });

    if (!res.ok) {
      // TODO handle error with toast?
    }
    const provider = getProvider(connection);
    const program = await getProgram(connection);
    const tx = new web3.Transaction();


    const agreement = await res.json();
    const [agreementFromKey] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("a"),
        anchor.utils.bytes.utf8.encode(agreement.id),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId
    );

    tx.add(
      await program.methods
        .createAgreement(
          agreement.id,
          pdfIPFS.cid.toV1().toString(),
          descriptionIPFS.cid.toV1().toString(),
          Object.keys(pdfDescription).length
        )
        .accounts({
          agreement: agreementFromKey,
          originator: provider.wallet.publicKey,
        })
        .transaction()
    );

    const signers = (await Promise.all(
      Object.keys(pdfDescription).map(async (key) => {
        const [packet] = await PublicKey.findProgramAddress(
          [
            anchor.utils.bytes.utf8.encode("p"),
            agreementFromKey.toBuffer(),
            anchor.utils.bytes.utf8.encode(key),
          ],
          program.programId
        );

        return program.methods
          .createSignaturePacket(key, null)
          .accounts({
            agreement: agreementFromKey,
            packet,
            originator: provider.wallet.publicKey,
          })
          .transaction();
      })
  
    ));

    for (let signer of signers) {
      tx.add(signer);
    }

    // const providerRes = await provider.sendAndConfirm(tx);
    // console.log("providerRes", providerRes);
    // const updateRes = await fetch("/api/agreements/patch", {
    //   method: "PATCH",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     transactionHash: "x",
    //     id: agreement.id
    //   }),
    //   credentials: "include",
    // });
    // console.log(await updateRes.json());

    // if (!res.ok) {
    //   // TODO handle error with toast?
    // }



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
      const copy = { ...pdfDescription };

      let fields = copy[identifier];
      if (!fields) fields = [];

      copy[identifier] = [...fields, fieldName];

      return copy;
    });

    setPdf(Buffer.from(await doc.save()));
  };

  const handleAddSigner = (text?: string) => {
    setPdfDescription((pdfDescription) => ({
      ...pdfDescription,
      [text || `New Signer ${Object.keys(pdfDescription).length}`]: [],
    }));
  };

  const handleUpdateSigner =
    (oldIdentifier: string) => (newIdentifier: string) => {
      setPdfDescription((pdfDescription) => {
        return Object.fromEntries(
          Object.entries(pdfDescription).map(([identifier, fields]) => {
            if (identifier === oldIdentifier) return [newIdentifier, fields];
            else return [identifier, fields];
          })
        );
      });
    };

  const handleFile = async (file: File) => {
    setPdf(Buffer.from(await file.arrayBuffer()));
  };

  return (
    <div>
      <h1 className="mb-8 text-4xl">Create New Agreement</h1>
      <ConfigureAgreement pdf={pdf} onChangePdf={handleFile} />
      <Button
        className="m-auto bg-fuchsia-500 hover:bg-fuchsia-400"
        icon={
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
        }
        text="Create Agreement"
        onClick={handleCreateAgreement}
      />
      <AddSignatures
        pdf={pdf}
        signers={Object.keys(pdfDescription)}
        onAddSigner={handleAddSigner}
        onUpdateSigner={handleUpdateSigner}
        onAddField={handleNewField}
      />
    </div>
  );
};

export default CreateAgreement;
