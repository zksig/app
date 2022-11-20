import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useIPFS } from "../../../providers/IPFSProvider";
import Button from "../../common/Button";
import { encryptAgreementAndPin } from "../../../utils/files";
import {
  createAgreement,
  getAddress,
  signMessage,
} from "../../../services/filecoin";
import Stepper from "../../common/Stepper";
import ConfigureAgreement from "./ConfigureAgreement";
import DocumentPreview from "./DocumentPreview";
import AddSignatures from "./AddSignatures";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

type AddFieldOptions = {
  x: number;
  y: number;
  page: number;
  identifier: string;
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
