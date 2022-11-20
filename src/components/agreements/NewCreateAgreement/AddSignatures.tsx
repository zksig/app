import {
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import * as pdfjsLib from "pdfjs-dist";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { DndProvider } from "react-dnd";
import DocumentPreview from "./DocumentPreview";
import Signature from "./Signature";
import { classes } from "./styles";
import { Box } from "@mui/system";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

type AddFieldOptions = {
  x: number;
  y: number;
  page: number;
  identifier: string;
};

const AddSignatures = ({
  signers,
  onAddSigner,
  onUpdateSigner,
  setCurrentStep,
}: {
  signers: string[];
  onAddSigner: (identifier?: string) => void;
  onUpdateSigner: (oldIdentifier: string) => (newIdentifier: string) => void;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [sharing, setSharing] = useState<string | null>(null);
  const [signerAddress, setSignerAddress] = useState<string | undefined>(
    undefined
  );

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
          Second Step:
        </Typography>
        <Typography sx={classes.text} style={{ marginBottom: "8px" }}>
          Select an option from the “Share Options” dropdown.
        </Typography>
        <Typography sx={classes.text} style={{ marginBottom: "8px" }}>
          Once you added all the signers for the document, select the page where
          each signature will go and drag the signers name to that place in the
          document.
        </Typography>
        <Typography sx={classes.text}>
          Click on “Continue” when you are ready.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth sx={{ marginBottom: "16px" }}>
          <InputLabel id="demo-simple-select-label">Sharing Options</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={sharing}
            label="Sharing Options"
            size="small"
            onChange={({ target }) => setSharing(target.value)}
          >
            <MenuItem value="address">Share via Address</MenuItem>
            <MenuItem value="url">Share via URL</MenuItem>
          </Select>
        </FormControl>
        {signers.map((signer, i) => (
          <Signature
            key={i}
            title={signer}
            onSignerChange={onUpdateSigner(signer)}
          />
        ))}
        {sharing === "address" && (
          <Grid
            container
            spacing={2}
            sx={{ marginTop: "8px", marginBottom: "20px" }}
          >
            <Grid item xs={10}>
              <TextField
                label="Signer Address"
                onChange={({ target }) => setSignerAddress(target.value)}
                size="small"
                value={signerAddress}
                fullWidth
                sx={classes.textField}
                inputProps={{
                  style: {
                    boxShadow: "none",
                  },
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton
                color="primary"
                aria-label="add signer"
                disabled={!signerAddress}
              >
                <Box
                  sx={{
                    width: "28px",
                    height: "28px",
                    border: `solid 2px ${
                      signerAddress ? "#D946EF" : "#98A0B2"
                    }`,
                    borderRadius: "6px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AddIcon
                    onClick={() => {
                      setSignerAddress("");
                      onAddSigner(signerAddress);
                    }}
                  />
                </Box>
              </IconButton>
            </Grid>
          </Grid>
        )}

        <Button
          variant="contained"
          disabled={!signers?.length}
          onClick={() => setCurrentStep(2)}
          sx={{ textDecoration: "none", textTransform: "none" }}
        >
          Continue
        </Button>
      </Grid>
    </Grid>
  );
};

export default AddSignatures;
