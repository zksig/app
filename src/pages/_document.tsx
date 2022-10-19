import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className="min-h-full bg-slate-100">
      <Head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>
      <body className="h-full bg-slate-100">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
