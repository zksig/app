import * as pdfjsLib from "pdfjs-dist";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Button from "../../common/Button";
import DocumentPreview from "./DocumentPreview";
import Signature from "./Signature";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

type AddFieldOptions = {
  x: number;
  y: number;
  page: number;
  identifier: string;
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

export default AddSignatures;
