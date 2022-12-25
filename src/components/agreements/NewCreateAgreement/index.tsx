import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Stepper from "../../common/Stepper";
import ConfigureAgreement from "./ConfigureAgreement";
import DocumentPreview from "./DocumentPreview";
import AddSignatures from "./AddSignatures";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { classes } from "./styles";
import Review from "./Review";
import PDFEditor from "../CreateAgreementReskin/index";
import { encryptAgreementAndPin } from "../../../utils/files";
import {
  createAgreement,
  getAddress,
  signMessage,
} from "../../../services/digitalSignatures";
import { useIPFS } from "../../../providers/IPFSProvider";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

type AddFieldOptions = {
  x: number;
  y: number;
  page: number;
  identifier: string;
};

const NewCreateAgreement = () => {
  const router = useRouter();
  const ipfs = useIPFS();
  const [identifier, setIdentifier] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [sharing, setSharing] = useState<string | null>(null);
  const [pdf, setPdf] = useState<Uint8Array>();
  const [loading, setLoading] = useState<boolean>(false);
  const [pdfDescription, setPdfDescription] = useState<
    { identifier: string; fields: string[] }[]
  >([]);

  const [currentStep, setCurrentStep] = useState<number>(0);

  const handleCreateAgreement = async () => {
    if (!ipfs || !pdf || !signMessage) return;

    try {
      setLoading(true);

      const encryptionPWBytes = await signMessage(
        `Encrypt PDF for ${identifier}`
      );
      const encryptedCid = await encryptAgreementAndPin({
        pdf,
        name: `${await getAddress()}: ${identifier}`,
        encryptionPWBytes,
      });
      const [pdfIPFS, descriptionIPFS] = await Promise.all([
        ipfs.add(pdf, { wrapWithDirectory: false }),
        ipfs.add(JSON.stringify(pdfDescription), { wrapWithDirectory: false }),
      ]);
      const id = await createAgreement({
        identifier,
        cid: pdfIPFS.cid.toV1().toString(),
        encryptedCid,
        descriptionCid: descriptionIPFS.cid.toV1().toString(),
        description: pdfDescription,
        withNFT: true,
      });

      router.push("/agreements");
    } catch (e) {
      console.log(e);
      toast.error("Unable to create agreement");
    } finally {
      setLoading(false);
    }
  };

  const handleFile = async (file: File) => {
    setPdf(new Uint8Array(await file.arrayBuffer()));
  };

  const content = [
    <Grid container spacing={2} key={"upload-document"}>
      <Grid item xs={12}>
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 500,
            color: "#2E3855",
            marginBottom: "8px",
          }}
        >
          First Step:
        </Typography>
        <Typography sx={{ fontSize: "14px", color: "#98A0B2" }}>
          Upload the document you will need to be signed. This document has to
          be of PDF format. Make sure you give your Agreement a name and click
          on “Continue” when you are ready.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Agreement Name"
          onChange={({ target }) => setIdentifier(target.value)}
          size="small"
          value={identifier}
          fullWidth
          sx={classes.textField}
          inputProps={{
            style: {
              boxShadow: "none",
            },
          }}
        />
      </Grid>
      <ConfigureAgreement pdf={pdf} onChangePdf={handleFile} />
      <Grid item xs={12}>
        <Button
          variant="contained"
          disabled={!!loading || !pdf}
          onClick={() => setCurrentStep(1)}
          sx={{ textDecoration: "none", textTransform: "none" }}
        >
          {loading ? "Processing..." : "Continue"}
        </Button>
      </Grid>
    </Grid>,
    <PDFEditor key={"add-signature"} sharing={sharing} setSharing={setSharing} pdf={pdf} setCurrentStep={setCurrentStep} signers={pdfDescription} setSigners={setPdfDescription}/>,

    <Review
      key={"Review"}
      signers={pdfDescription.map((signer) => signer.identifier)}
      handleCreateAgreement={handleCreateAgreement}
      identifier={identifier}
      loading={loading}
    />,
  ];

  return (
    <Grid
      container
      spacing={2}
      sx={{ display: "flex", justifyContent: "center" }}
    >
      <Grid item xs={3} />

      <Grid item xs={6}>
        <Stepper
          steps={[
            {
              icon: "upload",
              title: "Upload Document",
            },
            {
              icon: "add",
              title: "Add Signers",
            },
            {
              icon: "review",
              title: "Review",
            },
          ]}
          currentStep={currentStep}
        />
      </Grid>
      <Grid item xs={3} />

      <Grid item lg={12}>
        <DndProvider backend={HTML5Backend}>
          {content[currentStep]}
        </DndProvider>
      </Grid>
    </Grid>
  );
};

export default NewCreateAgreement;
