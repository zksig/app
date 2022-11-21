import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useIPFS } from "../../../providers/IPFSProvider";
import { encryptAgreementAndPin } from "../../../utils/files";
import {
  createAgreement,
  getAddress,
  signMessage,
} from "../../../services/digitalSignatures";
import Stepper from "../../common/Stepper";
import ConfigureAgreement from "./ConfigureAgreement";
import DocumentPreview from "./DocumentPreview";
import AddSignatures from "./AddSignatures";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { classes } from "./styles";
import Review from "./Review";
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
    const field = doc.getForm().createTextField(Date.now().toString());
    field.setText(`${identifier} signature`);
    const currentPage = doc.getPage(page - 1);
    const viewportDocument = document.getElementById("canvas");
    //find out how much bigger the actual document is than the preview shown in the page so we can adjust the coordinates with the same proportion
    const adjustedHeight =
      currentPage.getHeight() / (viewportDocument?.offsetHeight || 1);
    const adjustedWidth =
      currentPage.getWidth() / (viewportDocument?.offsetWidth || 1);
    field.addToPage(doc.getPage(page - 1), {
      x: x * adjustedWidth,
      y: y * adjustedHeight,
      width: 100,
      height: 14,
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

    setPdf(await doc.save());
  };

  const handleAddSigner = (text?: string) => {
    setPdfDescription((pdfDescription) => [
      ...pdfDescription,
      {
        identifier: text || `New Signer ${pdfDescription.length}`,
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
    <AddSignatures
      key={"add-signatures"}
      signers={pdfDescription.map((signer) => signer.identifier)}
      onAddSigner={handleAddSigner}
      onUpdateSigner={handleUpdateSigner}
      setCurrentStep={setCurrentStep}
    />,

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
      <Grid item xs={12}>
        <DndProvider backend={HTML5Backend}>
          <Grid container spacing={2} sx={{ marginTop: "16px" }}>
            <Grid item xs={2} />
            <Grid item xs={4}>
              {content[currentStep]}
            </Grid>
            {!!pdf ? (
              <>
                <Grid item xs={4}>
                  <DocumentPreview
                    pdf={pdf}
                    withDrop={currentStep === 1}
                    onAddField={handleNewField}
                  />
                </Grid>
                <Grid item xs={2} />
              </>
            ) : (
              <Grid item xs={6} />
            )}
          </Grid>
        </DndProvider>
      </Grid>
    </Grid>
  );
};

export default NewCreateAgreement;
