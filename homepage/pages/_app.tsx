import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* <!-- Google tag (gtag.js) --> */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-XG051N1VS3"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XG051N1VS3');
        `}
      </Script>
      <Head>
        <SeoMeta />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Toaster position="bottom-center" />
      <Component {...pageProps} />
    </>
  );
}

function SeoMeta() {
  return (
    <>
      <meta name="description" content="One CORS Proxy you'll ever need" />
      <meta
        name="keywords"
        content="cors, cors proxy, cors proxy server, free cors proxy, soap, cors playground, cors-anywhere"
      />
      <meta property="og:image" content="/og:image.jpg" />
    </>
  );
}
