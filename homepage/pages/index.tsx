import React from "react";
import { AppbarGroup } from "../grida/AppbarGroup";
import { SectionCtaLast } from "../grida/SectionCtaLast";
import { SectionDisclaimer } from "../grida/SectionDisclaimer";
import { SectionHero } from "../grida/SectionHero";
import { SectionPricing } from "../grida/SectionPricing";
import { SectionUsage } from "../grida/SectionUsage";
import ChatwootWidget from "../components/chatwood";

export default function HomePage() {
  return (
    <>
      <AppbarGroup />
      <SectionHero />
      <SectionUsage />
      <SectionPricing />
      <SectionCtaLast />
      <SectionDisclaimer />
      <ChatwootWidget />
    </>
  );
}
