import * as pdfjsLib from "pdfjs-dist";
import { DragPreviewImage } from "react-dnd";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

type AddFieldOptions = {
  x: number;
  y: number;
  page: number;
  identifier: string;
};

const SignaturePreview = ({
  preview,
  previewImg,
}: {
  preview: any;
  previewImg: string;
}) => {
  return (
    <div style={{ opacity: 0.5 }}>
      <DragPreviewImage connect={preview} src={previewImg} />
    </div>
  );
};

export default SignaturePreview;
