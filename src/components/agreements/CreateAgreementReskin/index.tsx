import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";
import { useRouter } from "next/router";
import { Button, Divider, Grid, Paper, TextField, Typography } from "@mui/material";
import PDFEdiot from "./dynamic";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box } from "@mui/system";
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
  pdf?: Uint8Array;
  onChangePdf: (file: File) => void;
}) => (
  <Grid item my={3}>
    <Button
      variant="contained"
      component="label"
      size="large"
      style={{backgroundColor: "black" , color: "white"}}
    >
      {pdf ? "Upload a different PDF" : "Upload a PDF"}
      <input
        type="file"
        hidden
        onChange={({ target }) => {
          if (!target.files) return;
          onChangePdf(target.files[0]);
        }}
      />
    </Button>
  </Grid>
);


const AddSignatures = ({
  pdf,
  signers,
  onAddSigner,
  onUpdateSigner,
  onAddField,
  handleFile,
  handleCreateAgreement
}: {
  pdf?: Uint8Array;
  signers: string[];
  onAddSigner: (identifier?: string) => void;
  onUpdateSigner: (oldIdentifier: string) => (newIdentifier: string) => void;
  onAddField: (options: AddFieldOptions) => void;
  handleFile: (options: any) => void;
  handleCreateAgreement: () => void
}) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [data, setData] = useState("") as any;

  const [fields, setFields] = useState([] as any);


  const handleAdd = () => {
    // @ts-ignore
    setFields((prev) => {
      return [...prev, {x: 10, y: 10, isDragging: false, id: prev.length, text: "Some Filler Text",}];
    });
  };

  return (
    <Grid container   display="flex" justifyContent={"space-evenly"}>
      <Grid item lg={6} style={{minHeight: "100vh"}} mt={4} mb={12}>
        <Paper elevation={9}>
          <PDFEdiot fields={fields} setFields={setFields} pdf={pdf}/>
        </Paper>
      </Grid>
      <Grid item lg={5} m={2} mt={4} mb={12} style={{minHeight: "100vh"}}>
        <Paper elevation={9} style={{padding: "1rem"}}>
          <Typography variant="h5" fontWeight={600} padding={1} textAlign="center">Configuration</Typography>
          <Grid container spacing={2} justifyContent="space-evenly" display={"flex"}>
            <Grid item lg={6}  justifyContent="space-evenly" display={"flex"}>
              <Button variant="contained" onClick={handleAdd}>
                <Typography style={{color: "black", display: "inline"}}>
            Add a Signature 
                </Typography>
              </Button>
            </Grid>
            <Grid item lg={6}  justifyContent="space-evenly" display={"flex"}>
              <Button variant="contained" onClick={handleAdd}>
                <Typography style={{color: "black", display: "inline"}}>
            Add a Field 
                </Typography>
              </Button>
            </Grid>
          </Grid>
          <Divider style={{marginTop: "2rems"}}><Typography variant="subtitle1" fontWeight={600} padding={1} textAlign="start">Fields</Typography></Divider>
          {/* @ts-ignore */}
          {fields.map(f => {
            return (

              <Accordion key={f.id}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>Field #{f.id + 1}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box p={2} mb={2}>
                    <Grid container spacing={2} my={2}>
                      <Grid item lg={5}>
                        <TextField
                          name="text"
                          required
                          size="small"
                          id="text"
                          fullWidth
                          label='Text'
                          autoFocus
                          value={f.text}
                          onChange={(e) => {
                          // @ts-ignore
                            setFields((prev) => {
                            // @ts-ignore
                              var item = prev.find(x => x.id === f.id);
                              const index = prev.indexOf(item);
                              prev[index] = { ...item, [e.target.name]: e.target.value};
                              return [...prev];
                            });
                          }}
                        />            
                      </Grid> 
                      <Grid item lg={5}>
                        <TextField
                          name="field_key"
                          required
                          fullWidth
                          size="small"
                          id="field_key"
                          label='Field Key'
                          autoFocus
                          value={f.field_key}
                          onChange={(e) => {     
                          // @ts-ignore
                            setFields((prev) => {
                            // @ts-ignore
                              var item = prev.find(x => x.id === f.id);
                              const index = prev.indexOf(item);
                              prev[index] = { ...item, [e.target.name]: e.target.value};
                              return [...prev];
                            });
                          }}
                        />            
                      </Grid> 
                    </Grid> 
                    <Grid container spacing={2}>
                      <Grid item lg={5}>
                        <TextField
                          name="x"
                          required
                          type="number"
                          size="small"
                          id="x"
                          fullWidth
                          label={"x"}
                          autoFocus
                          value={f.x}
                          onChange={(e) => {
                          // @ts-ignore
                            setFields((prev) => {
                            // @ts-ignore
                              var item = prev.find(x => x.id === f.id);
                              const index = prev.indexOf(item);
                              prev[index] = { ...item, [e.target.name]: e.target.value};
                              return [...prev];
                            });
                          }}
                        />            
                      </Grid> 
                      <Grid item lg={5}>
                        <TextField
                          name="y"
                          required
                          fullWidth
                          type="number"
                          size="small"
                          id="y"
                          label='y'
                          autoFocus
                          value={f.y}
                          onChange={(e) => {
                          // @ts-ignore

                            setFields((prev) => {
                            // @ts-ignore

                              var item = prev.find(x => x.id === f.id);
                              const index = prev.indexOf(item);
                              prev[index] = { ...item, [e.target.name]: e.target.value};
                              return [...prev];
                            });
                          }}
                        />            
                      </Grid> 
                    </Grid> 
                  </Box>
                </AccordionDetails>
              </Accordion>
     
            );
          })}
          <Button disabled={fields.length <= 0} onClick={handleCreateAgreement}  fullWidth variant="contained" color="primary"> Next</Button>
        </Paper>
      </Grid>
    </Grid>
  );
};


type Props = {
    user?: {
      id: string
      email: string
    }
  }

const PDFEditor = ({pdf, handleCreateAgreement }: {pdf: any, handleCreateAgreement: () => void}) => {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [pdfDescription, setPdfDescription] = useState<
    { identifier: string; fields: string[] }[]
  >([{identifier: "Signature Field", fields: []}, {identifier: "Date", fields: []}]);


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
    const button = doc
      .getForm()
      .createButton(`button-${Date.now().toString()}`);
    button.addToPage("", doc.getPage(page - 1), {
      x,
      y,
      width: 20,
      height: 14,
      borderWidth: 0,
    });

    const field = doc.getForm().createTextField(Date.now().toString());
    field.setText(`${identifier} signature`);
    field.addToPage(doc.getPage(page - 1), {
      x: x + 20,
      y,
      width: 80,
      height: 14,
      borderWidth: 0,
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
  };

  const handleAddSigner = (text?: string) => {
    setPdfDescription((pdfDescription) => [
      ...pdfDescription,
      {
        identifier: text || `Signature ${pdfDescription.length + 1 }`,
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


  return (
    <AddSignatures
      pdf={pdf}
      signers={pdfDescription.map((signer) => signer.identifier)}
      onAddSigner={handleAddSigner}
      onUpdateSigner={handleUpdateSigner}
      onAddField={handleNewField}
      handleFile={() => {}}
      handleCreateAgreement={handleCreateAgreement}
    />
  );
};

export default PDFEditor;
