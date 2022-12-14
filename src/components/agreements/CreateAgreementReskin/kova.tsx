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
  fields: [any],
  setFields: () => void, 
  pdf: any
}

const getPdfImageCanvas = async (
  pdf: any,
  page: number
): Promise<{
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}> => {
  const doc = await pdfjsLib.getDocument(pdf).promise;
  const pdfPage = await doc.getPage(page);
  const viewport = pdfPage.getViewport({ scale: .9 });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
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

const Kova = ({fields, setFields, pdf}: KonvaProps) => {
  const [pdfCanvas, setPdfCanvas] = React.useState({width: 0, height: 0, canvas: "" as any});
  const {width, height} = pdfCanvas;
  // TODO fix any typing
  const stageRef = React.useRef(null) as any;
  const rectRef = React.useRef() as any;
  const FieldsDisplay = fields.map(f => {
    return( <>
      <Rect
        x={f.x}
        y={f.y}
        width={200}
        height={20}
        stroke={ "black"}
        fill={ "lightblue"}
        ref={rectRef}
      />
      <Text
        key={f.id}
        text={f.text}
        x={f.x}
        fontSize={18}
        y={f.y}
        draggable
        fill={f.isDragging ? "green" : "black"}
        onDragStart={() => {
          //@ts-ignore
          setFields((prev) => {
            //@ts-ignore
            var item = prev.find(x => x.id === f.id);
            const index = prev.indexOf(item);
            prev[index] = { ... item, isDragging: true};
            return [...prev];
          });
        }}
        onDragEnd={(e: any) => {
          //@ts-ignore
          setFields((prev) => {
            //@ts-ignore
            var item = prev.find(x => x.id === f.id);
            const index = prev.indexOf(item);
            prev[index] = { ...item, isDragging: false,
              x: e.target.x(),
              y: e.target.y(), id: item.id};
            return [...prev];
          });
        }}
      />
    </>);
  });
  useEffect(() => {
    (async() => {
      if(!pdf) return;
      const x = await getPdfImageCanvas(pdf, 1) as any;
      setPdfCanvas(x);
    })();
  }, [pdf]);

  return (
    <Box>
      <Box mx={3}>
        {/* @ts-ignore */}
        <Stage width={width} height={height} ref={stageRef}>
          <Layer>
            {pdfCanvas.width > 0 && <PDFShape width={pdfCanvas.width} height={pdfCanvas.height} pdfCanvas={pdfCanvas.canvas}/>}   
            {FieldsDisplay}
          </Layer>
        </Stage>
      </Box>
    </Box >
  );
};

export default Kova;

