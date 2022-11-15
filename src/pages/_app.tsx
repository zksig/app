import type { AppProps } from "next/app";
import React, { FC } from "react";
import { ToastContainer } from "react-toastify";
import { IPFSProvider } from "../providers/IPFSProvider";
import "react-toastify/dist/ReactToastify.css";
import "./styles/globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import SidebarLayout from "../components/layouts/SidebarLayout";
import { FilecoinProvider } from "../providers/FilecoinProvider";

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <IPFSProvider>
        <FilecoinProvider>
          <SidebarLayout>
            <Component {...pageProps} />
          </SidebarLayout>
        </FilecoinProvider>
      </IPFSProvider>
      <ToastContainer />
    </>
  );
};

export default App;
