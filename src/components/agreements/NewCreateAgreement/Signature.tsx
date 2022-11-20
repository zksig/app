import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { useDrag } from "react-dnd";
import { Box, Grid, IconButton, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import OpenWithRoundedIcon from "@mui/icons-material/OpenWithRounded";
import { classes } from "./styles";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

type AddFieldOptions = {
  x: number;
  y: number;
  page: number;
  identifier: string;
};

const Signature = ({
  title,
  onSignerChange,
}: {
  title: string;
  onSignerChange: (text: string) => void;
}) => {
  const [editing, setEditing] = useState(false);
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "signature",
      item: () => ({ title }),
      collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
    }),
    [title]
  );

  return (
    <Grid container spacing={2}>
      {editing ? (
        <Grid item xs={12} ref={drag}>
          <Grid container spacing={0} sx={classes.signatureContainer}>
            <Grid item xs={10}>
              <TextField
                label="Signer Address"
                onChange={({ target }) => onSignerChange(target.value)}
                size="small"
                value={title}
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
              <IconButton color="primary" aria-label="add signer">
                <CheckIcon onClick={() => setEditing(false)} />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid item xs={12} ref={drag}>
          <Box sx={classes.signerBox}>
            <Grid container spacing={0} sx={classes.signatureContainer}>
              <Grid item xs={10} sx={{ display: "flex", alignItems: "center" }}>
                {title}
              </Grid>
              <Grid item xs={2} sx={{ display: "flex" }}>
                <IconButton color="secondary" aria-label="add signer">
                  <EditIcon onClick={() => setEditing(true)} />
                </IconButton>
                <IconButton color="secondary" aria-label="drop signature">
                  <OpenWithRoundedIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default Signature;
