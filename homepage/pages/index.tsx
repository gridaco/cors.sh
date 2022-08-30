import React from "react";
import { Appbar } from "../components";
import { SectionCtaLast } from "../grida/SectionCtaLast";
import { SectionDisclaimer } from "../grida/SectionDisclaimer";
import { SectionHero } from "../grida/SectionHero";
import { SectionPricing } from "../grida/SectionPricing";

export default function HomePage() {
  return (
    <>
      <Appbar />
      <SectionHero />
      <SectionPricing />
      <SectionCtaLast />
      <SectionDisclaimer />
    </>
  );
}
