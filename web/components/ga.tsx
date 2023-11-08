import Script from "next/script";

const GoogleAnalytics = ({ gaid }: { gaid: string }) => (
  <>
    <Script
      async
      src={`https://www.googletagmanager.com/gtag/js? 
      id=${gaid}`}
    ></Script>
    <Script
      id="google-analytics"
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${gaid}');
        `,
      }}
    ></Script>
  </>
);

export default GoogleAnalytics;