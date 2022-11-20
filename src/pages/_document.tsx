import { Html, Head, Main, NextScript } from "next/document";
import { getInitColorSchemeScript } from "@mui/material/styles";

export default function Document() {
  return (
    <Html className="min-h-full bg-slate-100">
      <Head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>
      <body className="h-full bg-slate-100">
        {getInitColorSchemeScript()}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
