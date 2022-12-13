import type { AppProps } from "next/app";
import React, { FC } from "react";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@mui/material/styles";
import { IPFSProvider } from "../providers/IPFSProvider";
import SidebarLayout from "../components/layouts/SidebarLayout";
import { theme } from "../utils/theme";
import "react-toastify/dist/ReactToastify.css";
import "./styles/globals.css";
import { WalletProvider } from "../providers/WalletProvider";

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <IPFSProvider>
        <WalletProvider>
          <SidebarLayout>
            <Component {...pageProps} />
          </SidebarLayout>
        </WalletProvider>
      </IPFSProvider>
      <ToastContainer />
    </ThemeProvider>
  );
};

export default App;
