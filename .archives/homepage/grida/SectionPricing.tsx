import React from "react";
import styled from "@emotion/styled";
import { PricingCardsList } from "../layouts/pricing-card-list";
import { useRouter } from "next/router";
import { FreeForOpenSource } from "../components/pricing/free-for-opensource";
import { PRICE_PERSONAL_PRO_MONTHLY } from "../k";
/**
 * `<SectionPricing>` ('section-pricing')
 * - [Open in Figma](https://figma.com/file/aPfdtNb1aGFIN9p05cmmVY?node-id=15:1613)
 * - [Open in Grida](https://code.grida.co/files/aPfdtNb1aGFIN9p05cmmVY?node=15:1613)
 *
 *
 * ---
 * @example
 * ```tsx
 * import React from "react";
 *
 * export default function () {
 *   return (
 *     <>
 *       👇 instanciate widget like below. 👇
 *       <SectionPricing/>
 *     </>
 *   )
 * }
 * ```
 * ---
 * @params {any} props - this widget does not requires props. you can pass custom dynamic props to the widget as you want (on typescript, it will raise type check issues).
 * ---
 * @preview
 * ![](https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/3b4fded0-7047-4710-8959-6fbef3fccb2b)
 * ---
 * @remarks
 * @see {@link https://grida.co/docs} for more information.
 * ---
 * Code generated by grida.co | engine 0.0.1 (Apache-2.0) | Generated code under CC0 (public domain) *This code is free to use, modify, and redistribute. (aknowledgment is not required)*
 *
 *
 * ![Made with Grida](https://bridged-service-static.s3.us-west-1.amazonaws.com/branding/logo/32.png)
 * <!-- Info: Please do not remove this comment unless intended. removing this section will break grida integrations. -->
 * <!-- grida.meta.widget_declaration | engine : 0.0.1 | source : figma://aPfdtNb1aGFIN9p05cmmVY/15:1613 -->
 */
export function SectionPricing() {
  const router = useRouter();
  return (
    <RootWrapperSectionPricing id="pricing">
      <Pricing>Pricing</Pricing>
      <div
        style={{
          display: "flex",
          top: 300,
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <PricingCardsList
          initialSelection={PRICE_PERSONAL_PRO_MONTHLY}
          disableSelection
          enableIndividualActions
          onGetStartedClick={(price) => {
            router.push({ pathname: "/get-started", query: { price } });
          }}
        />
      </div>
      <FreeForOpensourcePosition>
        <FreeForOpenSource />
      </FreeForOpensourcePosition>
      <Line />
    </RootWrapperSectionPricing>
  );
}

const RootWrapperSectionPricing = styled.div`
  height: 1632px;
  background-color: white;
  position: relative;
`;

const Pricing = styled.span`
  color: black;
  text-overflow: ellipsis;
  font-size: 64px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 700;
  line-height: 98%;
  text-align: center;
  position: absolute;
  left: calc((calc((50% + 1px)) - 108px));
  top: 88px;
`;

const FreeForOpensourcePosition = styled.div`
  position: absolute;
  left: calc((calc((50% + 1px)) - 520px));
  top: 1184px;
  width: 1040px;
  height: 312px;
`;

const Line = styled.div`
  width: 1039px;
  height: 0px;
  border-top: solid 1px rgba(0, 0, 0, 0.1);
  position: absolute;
  left: calc((calc((50% + 1px)) - 520px));
  top: 1108px;
`;

const Frame587 = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
  box-sizing: border-box;
  position: absolute;
  left: calc((calc((50% + 0px)) - 52px));
  top: 229px;
  width: 104px;
  height: 14px;
`;

const Monthly = styled.span`
  color: black;
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 700;
  line-height: 98%;
  text-align: left;
`;

const Yearly = styled.span`
  color: black;
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 400;
  line-height: 98%;
  text-align: left;
`;
