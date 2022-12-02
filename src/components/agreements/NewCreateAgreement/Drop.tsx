import { ReactNode, RefObject, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { useDrop } from "react-dnd";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

type AddFieldOptions = {
  x: number;
  y: number;
  page: number;
  identifier: string;
};

const Drop = ({
  pdf,
  currentPage,
  canvas,
  onAddField,
  children,
  setInDropZone,
  docSignatureWidth,
  docSignatureHeight,
}: {
  pdf?: Uint8Array;
  currentPage: number;
  canvas: RefObject<HTMLCanvasElement>;
  onAddField: (options: AddFieldOptions) => void;
  children: ReactNode;
  setInDropZone?: React.Dispatch<React.SetStateAction<boolean>>;
  docSignatureWidth: number;
  docSignatureHeight: number;
}) => {
  const [{ isActive }, drop] = useDrop(
    () => ({
      accept: "signature",
      drop: async (item: { title: string }, monitor) => {
        if (!pdf) return;
        const rect = canvas.current!.getBoundingClientRect();
        const [elementWidth = 0, elementHeight = 0] = [
          document.getElementById("draggable-signature")?.offsetWidth,
          document.getElementById("draggable-signature")?.offsetHeight,
        ];

        // getSourceClientOffset.y = distance from top of viewport to top of dropped item preview before dropping
        // getSourceClientOffset.x = distance from left of viewport to left side of dropped item preview before dropping
        const docTopToSigTop = monitor.getSourceClientOffset()!.y - rect.top;
        const elementToDocHeightDifference = elementHeight - docSignatureHeight;

        const x =
          monitor.getSourceClientOffset()!.x +
          (elementWidth ? elementWidth - docSignatureWidth : 0) -
          rect.left;
        const y = rect.height - docTopToSigTop - elementToDocHeightDifference;
        onAddField({ x, y, page: currentPage, identifier: item.title });
      },
      collect: (monitor) => ({
        isActive: monitor.canDrop() && monitor.isOver(),
      }),
    }),
    [pdf]
  );

  useEffect(() => {
    if (setInDropZone) {
      setInDropZone(isActive);
    }
  }, [isActive]);

  return <div ref={drop}>{children}</div>;
};

export default Drop;
