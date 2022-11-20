import { ReactNode, RefObject } from "react";
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
        const x = monitor.getSourceClientOffset()!.x - rect.left;
        const documentBottom = rect.top + rect.height;

        // getSourceClientOffset.y = distance from top of viewport to top of dropped item preview before dropping
        // getSourceClientOffset.x = distance from left of viewport to left side of dropped item preview before dropping

        const y =
          rect.height - (monitor.getSourceClientOffset()!.y - rect.top) - 20;

        onAddField({ x, y, page: currentPage, identifier: item.title });
      },
    }),
    [pdf]
  );

  return (
    <div
      ref={drop}
      style={{
        border: "1px #98A0B2 solid",
        borderRadius: "8px",
        marginLeft: "40px",
      }}
    >
      {children}
    </div>
  );
};

export default Drop;
