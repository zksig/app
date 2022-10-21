import "./styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "@auth0/nextjs-auth0";
import { IPFSProvider } from "../providers/IPFSProvider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <IPFSProvider>
        <Component {...pageProps} />
      </IPFSProvider>
    </UserProvider>
  );
}

export default MyApp;
