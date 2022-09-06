import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* <!-- Google tag (gtag.js) --> */}
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-XG051N1VS3"
      />
      <Script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-XG051N1VS3');`,
        }}
      />
      <Head>
        <title>CORS.SH</title>
        <meta name="description" content="One CORS Proxy you'll ever need" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="One CORS Proxy you'll ever need" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:image" content="/og:image.jpg" />
      </Head>

      <ToastContainer />
      <Component {...pageProps} />
    </>
  );
}
