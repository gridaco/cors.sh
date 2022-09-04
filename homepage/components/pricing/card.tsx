import React from "react";
import styled from "@emotion/styled";
import Check from "@mui/icons-material/Check";
/**
 * `<PricingCard>` ('pricing-card')
 * - [Open in Figma](https://figma.com/file/aPfdtNb1aGFIN9p05cmmVY?node-id=44:1495)
 * - [Open in Grida](https://code.grida.co/files/aPfdtNb1aGFIN9p05cmmVY?node=44:1495)
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
 *       <PricingCard/>
 *     </>
 *   )
 * }
 * ```
 * ---
 * @params {any} props - this widget does not requires props. you can pass custom dynamic props to the widget as you want (on typescript, it will raise type check issues).
 * ---
 * @preview
 * ![](https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/96e79c0e-a4b8-44cd-969a-41b7793ccdbb)
 * ---
 * @remarks
 * @see {@link https://grida.co/docs} for more information.
 * ---
 * Code generated by grida.co | engine 0.0.1 (Apache-2.0) | Generated code under CC0 (public domain) *This code is free to use, modify, and redistribute. (aknowledgment is not required)*
 *
 *
 * ![Made with Grida](https://bridged-service-static.s3.us-west-1.amazonaws.com/branding/logo/32.png)
 * <!-- Info: Please do not remove this comment unless intended. removing this section will break grida integrations. -->
 * <!-- grida.meta.widget_declaration | engine : 0.0.1 | source : figma://aPfdtNb1aGFIN9p05cmmVY/44:1495 -->
 */
export function PricingCard({
  onStartClick,
  startLabel = "Get Started",
  features,
  price,
  description,
  name,
  unit,
  selected,
  enableAction = true,
  onClick,
}: {
  enableAction?: boolean;
  onClick?: () => void;
  selected?: boolean;
  unit?: string;
  description?: string;
  name: string;
  price: string;
  onStartClick: () => void;
  startLabel?: string;
  features: string[];
}) {
  return (
    <RootWrapperPricingCard
      onClick={onClick}
      border={selected ? "black" : "transparent"}
    >
      <Content>
        <ReadingArea>
          <PriceArea>
            <Name>{name}</Name>
            <PriceContainer direction={description ? "column" : "row"}>
              <Price>{price}</Price>
              {unit && <Sub>/ {unit}</Sub>}
              {description && <Sub>{description}</Sub>}
            </PriceContainer>
          </PriceArea>
          <FeaturesArea>
            {features.map((feature) => (
              <PricelistFeatureItem key={feature}>
                <Check
                  sx={{
                    color: "#A9A9A9",
                  }}
                />
                <FeatureName>{feature}</FeatureName>
              </PricelistFeatureItem>
            ))}
          </FeaturesArea>
        </ReadingArea>
        {enableAction && (
          <ButtonAsButton onClick={onStartClick}>{startLabel}</ButtonAsButton>
        )}
      </Content>
    </RootWrapperPricingCard>
  );
}

const RootWrapperPricingCard = styled.div<{ border: string }>`
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: flex-start;
  gap: 10px;
  box-shadow: 0px 4px 128px 32px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  background-color: white;
  box-sizing: border-box;
  border: 4px solid ${(p) => p.border};
  padding: 40px;
`;

const Content = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  gap: 142px;
  width: 300px;
  box-sizing: border-box;
`;

const ReadingArea = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 72px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
`;

const PriceArea = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 36px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
`;

const Name = styled.span`
  color: black;
  text-overflow: ellipsis;
  font-size: 18px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 400;
  line-height: 135%;
  text-align: left;
  align-self: stretch;
  flex-shrink: 0;
`;

const PriceContainer = styled.div<{ direction: "column" | "row" }>`
  display: flex;
  justify-content: flex-start;
  flex-direction: ${(p) => p.direction};
  align-items: flex-start;
  align-items: ${(p) => (p.direction === "column" ? "flex-start" : "center")};
  gap: 16px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
`;

const Price = styled.span`
  color: black;
  text-overflow: ellipsis;
  font-size: 36px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 500;
  line-height: 135%;
  text-align: left;
`;

const Sub = styled.span`
  color: rgba(109, 109, 109, 0.83);
  text-overflow: ellipsis;
  font-size: 21px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 400;
  text-align: left;
`;

const FeaturesArea = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
`;

const PricelistFeatureItem = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
`;

const IconsMdiCheck = styled.img`
  width: 24px;
  height: 24px;
  object-fit: cover;
`;

const FeatureName = styled.span`
  color: rgb(83, 83, 83);
  text-overflow: ellipsis;
  font-size: 16px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 400;
  text-align: left;
  width: 268px;
  flex: 1;
`;

const FeatureName_0001 = styled.span`
  color: rgb(83, 83, 83);
  text-overflow: ellipsis;
  font-size: 16px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 400;
  text-align: left;
  width: 270px;
  flex: 1;
`;

const ButtonAsButton = styled.button`
  background-color: black;
  border: solid 1px rgb(28, 28, 28);
  border-radius: 4px;
  padding: 12px 89px;
  color: white;
  font-size: 18px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 700;
  outline: none;
  cursor: pointer;
  align-self: stretch;
  flex-shrink: 0;

  :hover {
    opacity: 0.8;
  }

  :disabled {
    opacity: 0.5;
  }

  :active {
    opacity: 1;
  }

  :focus {
  }
`;
