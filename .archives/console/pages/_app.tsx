import React from "react";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";
import type { AppProps } from "next/app";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Toaster position="bottom-center" />
      <Component {...pageProps} />
    </>
  );
}
export default App;
