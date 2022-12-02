import * as pdfjsLib from "pdfjs-dist";
import { DragPreviewImage } from "react-dnd";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

type AddFieldOptions = {
  x: number;
  y: number;
  page: number;
  identifier: string;
};

const SignaturePreview = ({ preview }: { preview: any }) => {
  return (
    <div style={{ opacity: 0.5 }}>
      <DragPreviewImage connect={preview} src={"/draggableBox.png"} />
    </div>
  );
};

export default SignaturePreview;
