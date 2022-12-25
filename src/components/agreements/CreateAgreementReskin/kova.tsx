import React, { Fragment, useEffect } from "react";
import { Stage, Layer, Text, Image, Rect, Shape } from "react-konva";
import jsPDF from "jspdf";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

type Props = {
  pdfCanvas: HTMLCanvasElement;
  width: number;
  height: number;
};

type KonvaProps = {
  signers: [any],
  setSigners: () => void, 
  pdf: any,
  page: number,
  setTotalPages: () => void
}

const getPdfImageCanvas = async (
  pdf: any,
  page: number,
  setTotalPages: (p: number) => void
): Promise<{
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}> => {
  const doc = await pdfjsLib.getDocument(pdf).promise;
  const pdfPage = await doc.getPage(page);
  const viewport = pdfPage.getViewport({ scale: 1 });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  setTotalPages(doc?.numPages);
  if (context) {
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const renderContext = {
      canvasContext: context,
      viewport,
    };
    await pdfPage.render(renderContext).promise;
  }
  return {
    canvas,
    width: viewport.width,
    height: viewport.height,
  };
};

function PDFShape({ pdfCanvas, width, height }: Props) {
  return (
    <Shape
      width={width}
      height={height}
      sceneFunc={(context: any) => {
        context.drawImage(pdfCanvas, 10, 10);
      }}
    />
  );
}

const Kova = ({signers, setSigners, pdf, page, setTotalPages}: KonvaProps) => {
  const [pdfCanvas, setPdfCanvas] = React.useState({width: 0, height: 0, canvas: "" as any});
  const {width, height} = pdfCanvas;
  // TODO fix any typing
  const stageRef = React.useRef(null) as any;
  const rectRef = React.useRef() as any;
  const FieldsDisplay = signers.map((signer, signerIndex: number) => {
    return signer.fields.map((f: any) => {
      if(f.page !== page) return;
      return( <>
        <Rect
          x={f.x}
          y={f.y}
          width={200}
          height={18}
          fill={ "lightblue"}
          stroke={"black"}
          strokeWidth={1}
          ref={rectRef}
        />
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", paddingTop: ".5rem"}}>
          <Text
            key={f.id}
            text={"  " + signer.identifier + " - " + "Signature #" + f.id}
            x={f.x}
            fontSize={12}
            y={f.y}
            draggable
            fill={f.isDragging ? "green" : "black"}
            onDragStart={() => {
            //@ts-ignore
              setSigners((prev) => {
              //@ts-ignore
                var item = prev.find(x => x.id === signer.id);
                const index = prev.indexOf(item);
                prev[index] = { ... item, isDragging: true};
                return [...prev];
              });
            }}
            onDragEnd={(e: any) => {
            //@ts-ignore
              setSigners((prev) => {
              //@ts-ignore
                const updateFields = signer.fields.map((field: any) => {
                  if(field.id !== f.id) return field;
                  if(field.id === f.id)  {
                    return {
                      x: e.target.x(),
                      y: e.target.y(),
                      id: f.id,
                      page: f.page
                    }; 
                  }
                });
                prev[signerIndex] = { ...signer, isDragging: false, fields: updateFields};
                return [...prev];
              });
            }}
          />
        </div>
      </>);
    });
  });
  useEffect(() => {
    (async() => {
      if(!pdf) return;
      const x = await getPdfImageCanvas(pdf, page || 1, setTotalPages) as any;
      setPdfCanvas(x);
    })();
  }, [pdf, page]);

  return (
    <Box>
      {/* @ts-ignore */}
      <Stage width={width} height={height} ref={stageRef}>
        <Layer>
          {pdfCanvas.width > 0 && <PDFShape width={pdfCanvas.width} height={pdfCanvas.height} pdfCanvas={pdfCanvas.canvas}/>}   
          {FieldsDisplay.flat()}
        </Layer>
      </Stage>
    </Box>
  );
};

export default Kova;

