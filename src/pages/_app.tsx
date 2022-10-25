import type { AppProps } from "next/app";
import React, { useMemo, FC } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { UserProvider } from "@auth0/nextjs-auth0";
import { ToastContainer } from "react-toastify";
import { IPFSProvider } from "../providers/IPFSProvider";
import { SolanaProvider } from "../providers/SolanaProvider";
import "react-toastify/dist/ReactToastify.css";
import "./styles/globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <UserProvider>
      <IPFSProvider>
        <ConnectionProvider
          endpoint={
            process.env.NEXT_PUBLIC_SOLANA_RPC ||
            "https://api.devnet.solana.com"
          }
        >
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <SolanaProvider>
                <Component {...pageProps} />
              </SolanaProvider>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </IPFSProvider>
      <ToastContainer />
    </UserProvider>
  );
};

export default App;
