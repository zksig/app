import { createTheme } from "@mui/material/styles";
import { green, purple } from "@mui/material/colors";
import { PaletteColor, PaletteColorOptions } from "@mui/material";
import React from "react";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#D946EF",
    },
    secondary: {
      main: "#0f172a",
    },
    lightBlue: "#DEE5F5",
  },
});
declare module "@mui/material/styles" {
  interface Palette {
    lightBlue?: PaletteColor;
  }

  interface PaletteOptions {
    lightBlue?: string;
  }
}
