import {  useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { Button, Divider, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import PDFEdiot from "./dynamic";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box } from "@mui/system";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export type FieldData = { x: number, y: number, id: number, page: number, isDragging: Boolean}
export type SignerData = { identifier: string; fields: FieldData[] }

const PDFEditor = ({
  pdf,
  setCurrentStep,
  signers, 
  setSigners,
  setSharing,
  sharing
}: {
  pdf?: Uint8Array;
  setCurrentStep: (n: number) => void
  signers: any[],
  setSigners: (x: any) => void
  setSharing: (method: string) => void
  sharing: string | null
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);


  const handleAddSigner = () => {
    setSigners((prev: any) => {
      return [...prev, {id: prev.length, identifier: `New Signer ${prev.length + 1}`, fields: [{x: 10, y: 10, isDragging: false, id: 1, page: currentPage}]}];
    });
  };
  const handleAddField = (identifier: string) => {
    setSigners((prev: any) => {
      var item = prev.find((x: SignerData) => x.identifier === identifier);
      const index = prev.indexOf(item);
      prev[index] = { ...item, fields: [...item.fields, {x: 10, y: 10, id: item.fields.length + 1, page: currentPage}]};
      return [...prev];
    });
  };
  const handleRemoveField = (identifier: string) => {
    setSigners((prev: any) => {
      var item = prev.find((x: SignerData) => x.identifier === identifier);
      const index = prev.indexOf(item);
      item.fields.splice(index, 1);
      prev[index] = { ...item, fields: item.fields.map((f: any, i: number) => ({...f, id: i + 1}))};
      return [...prev];
    });
  };

  return (
    <Grid container   display="flex" justifyContent={"space-evenly"}>
      <Grid item lg={6} style={{minHeight: "100vh"}} mt={4} mb={12}>
        <Paper elevation={9}>
          <section className="py-4 mx-auto text-center">
            <input
              className="w-8 border-none bg-slate-50 p-0"
              type="number"
              value={currentPage}
              onChange={({ target }) => setCurrentPage(parseInt(target.value))}
            />{" "}
          / {totalPages}
          </section>
          <PDFEdiot signers={signers} setSigners={setSigners} pdf={pdf} page={currentPage} setTotalPages={setTotalPages}/>
        </Paper>
      </Grid>
      <Grid item lg={5} m={2} mt={4} mb={12} style={{minHeight: "100vh"}}>
        <Paper elevation={9} style={{padding: "1rem"}}>
          <Typography variant="h5" fontWeight={600} padding={1} textAlign="center">Configuration</Typography>
          <Grid container spacing={2} justifyContent="space-evenly" display={"flex"}>
            <FormControl fullWidth style={{margin: ".5rem"}}>
              <InputLabel id="demo-simple-select-label">Sharing Options</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={sharing || ""}
                label="Sharing Options"
                size="small"
                onChange={({ target }) => setSharing(target.value)}
              >
                <MenuItem value="address">Share via Address</MenuItem>
                <MenuItem value="url">Share via URL (coming soon)</MenuItem>
              </Select>
            </FormControl>
            <Grid item lg={6}  justifyContent="space-evenly" display={"flex"}>
              <Button variant="contained" onClick={handleAddSigner}>
                <Typography style={{ display: "inline"}}>
                    Add a Signer 
                </Typography>
              </Button>
            </Grid>
          </Grid>
          <Divider style={{marginTop: "2rem", marginBottom: "2rem"}}></Divider>
          {/* @ts-ignore */}
          {signers.map(signer => {
            return (

              <Accordion key={signer.id}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Grid item lg={10}>
                    <TextField
                      name="identifier"
                      required
                      size="small"
                      id="identifier"
                      fullWidth
                      label='Identifier/Signers Title'
                      autoFocus
                      value={signer.identifier}
                      onChange={(e) => {
                        // @ts-ignore
                        setSigners((prev) => {
                          // @ts-ignore
                          var item = prev.find(x => x.id === signer.id);
                          const index = prev.indexOf(item);
                          prev[index] = { ...item, [e.target.name]: e.target.value};
                          return [...prev];
                        });
                      }}
                    />            
                  </Grid> 
                </AccordionSummary>
                <AccordionDetails>
                  <Box p={2} mb={2}>
                    <Grid container spacing={2} my={2}>
                      <Grid item lg={12} justifyContent="center" display={"flex"}>
                        <Button variant="contained" onClick={() => handleAddField(signer.identifier)}> Add Signature </Button>
                      </Grid>
                      <Divider style={{marginTop: "1rem", marginBottom: "1rem"}}></Divider>
                      <Grid item lg={12}>
                        {signer.fields.map((f: any)=> {
                          return (
                            <Grid key={f.id} display="flex" justifyContent={"space-between"} my={2} p={1} component={Paper}>
                              <span> Signature #{f.id} </span>
                              <Button variant="outlined" onClick={() => handleRemoveField(signer.identifier)}> Delete field</Button>
                            </Grid>
                          );
                        })}
                      </Grid> 
                    </Grid> 
                  </Box>
                </AccordionDetails>
              </Accordion>
     
            );
          })}
          <Divider style={{marginTop: "2rem", marginBottom: "2rem"}}></Divider>

          <Button disabled={signers.length <= 0} onClick={() => setCurrentStep(2)}  fullWidth variant="contained" color="primary"> Next</Button>
        </Paper>
      </Grid>
    </Grid>
  );
};


export default PDFEditor;
