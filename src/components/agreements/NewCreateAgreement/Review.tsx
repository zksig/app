import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { Button, Grid, Typography } from "@mui/material";
import { classes } from "./styles";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

type AddFieldOptions = {
  x: number;
  y: number;
  page: number;
  identifier: string;
};

const Review = ({
  signers,
  handleCreateAgreement,
  identifier,
}: {
  signers: any;
  handleCreateAgreement: any;
  identifier: string;
}) => {
  return (
    <Grid container spacing={2}>
      <Grid xs={12} item sx={{ marginBottom: "16px" }}>
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 500,
            color: "#2E3855",
            marginBottom: "8px",
          }}
        >
          Final Step:
        </Typography>
        <Typography sx={classes.text} style={{ marginBottom: "8px" }}>
          Review all of the signers addresses below
        </Typography>
        <Typography sx={classes.text} style={{ marginBottom: "8px" }}>
          Review the placements of the signatures in the document
        </Typography>
        <Typography sx={classes.text}>
          Click on “Agree and Continue” when you are ready.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 500,
            color: "#2E3855",
            marginBottom: "8px",
          }}
        >
          Signers Addresses for {identifier}:
        </Typography>
      </Grid>
      {signers.map((signer: string, index: number) => (
        <Grid item xs={12} key={`signer-${index}`}>
          -{" "}
          <Typography component="span" sx={{ color: "#98A0B2" }}>
            {signer}
          </Typography>
        </Grid>
      ))}
      <Grid item xs={12}>
        <Button
          variant="contained"
          key={"review"}
          onClick={handleCreateAgreement}
          sx={{ textDecoration: "none", textTransform: "none" }}
        >
          Agree and Continue
        </Button>
      </Grid>
    </Grid>
  );
};

export default Review;
