import React from "react";
import { AppbarGroup } from "../grida/AppbarGroup";
import { SectionDisclaimer } from "../grida/SectionDisclaimer";
import { SectionHero } from "../grida/SectionHero";
import { SectionPricing } from "../grida/SectionPricing";
import { SectionUsage } from "../grida/SectionUsage";
import ChatwootWidget from "../components/chatwood";
import { FooterCtaSection } from "../components/cta-footer";
import Head from "next/head";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>CORS.SH - A Fast & Reliable CORS Proxy for your websites</title>
      </Head>
      <AppbarGroup />
      <SectionHero />
      <SectionUsage />
      <SectionPricing />
      {/* <SectionCtaLast /> */}
      <div style={{ height: 120 }} />
      <div
        style={{
          height: 800,
          position: "relative",
          // black background that starts from 60% to 100% of the height
          background:
            "linear-gradient(180deg, white 0%, white 50%, #000000 50%, #000000 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 0,
            right: 0,
            maxWidth: 1040,
            margin: "120px auto",
          }}
        >
          <FooterCtaSection />
        </div>
      </div>
      <div
        style={{
          background: "black",
          padding: "400px 0",
        }}
      >
        <SectionDisclaimer />
      </div>
      <ChatwootWidget />
    </>
  );
}
