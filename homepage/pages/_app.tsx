import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* <!-- Google tag (gtag.js) --> */}
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-XG051N1VS3"
      />
      <Script
        src={`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-XG051N1VS3');`}
      />
      <Head>
        <title>CORS.SH</title>
        <meta name="description" content="One CORS Proxy you'll ever need" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="*"
        />
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
      </Head>
      <Component {...pageProps} />
    </>
  );
}
