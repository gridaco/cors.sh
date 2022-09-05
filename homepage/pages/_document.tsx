import { Head, Html, Main, NextScript } from "next/document";

export default function _Document() {
  return (
    <Html lang="en">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="*" />
      {/* roboto mono */}
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      {/* inter */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      {/* Nanum Pen Script */}
      <link
        href="https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap"
        rel="stylesheet"
      ></link>
      <Head />

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
