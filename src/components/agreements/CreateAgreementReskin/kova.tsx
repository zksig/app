import React, { useEffect } from "react";
import { Stage, Layer, Text, Image, Rect, Shape } from "react-konva";
import useImage from "use-image";
import { Box } from "@mui/system";
import * as pdfjsLib from "pdfjs-dist";
import { FieldData } from ".";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

type PDFShapeProps = {
  pdfCanvas: HTMLCanvasElement;
  width: number;
  height: number;
};

type KonvaProps = {
  signers: [any],
  setSigners: (x: any) => void, 
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

function PDFShape({ pdfCanvas, width, height }: PDFShapeProps) {
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

const ZKSigLogo = ({x, y}: {x: number, y: number}) => {
  const [image] = useImage("/logo_v3.png");
  return <Image image={image}  alt="company logo" width={20} height={16} x={x} y={y + 1}/>;
};

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
        <ZKSigLogo x={f.x} y={f.y}/>
        <Text
          key={f.id}
          text={"  " + signer.identifier + " - " + "Signature #" + f.id}
          x={f.x + 16}
          fontSize={12}
          y={f.y + 4}
          draggable
          fill={f.isDragging ? "green" : "black"}
          onDragStart={() => {
            setSigners((prev: any) => {
              var item = prev.find((x: FieldData)=> x.id === signer.id);
              const index = prev.indexOf(item);
              prev[index] = { ... item, isDragging: true};
              return [...prev];
            });
          }}
          onDragEnd={(e: any) => {
            setSigners((prev: any[]) => {
              const updateFields = signer.fields.map((field: FieldData) => {
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

