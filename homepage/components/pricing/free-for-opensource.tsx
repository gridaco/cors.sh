import React from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import * as k from "../../k";
import CheckFilled from "../icons/check-filled";

const features = [
  "1,000,000 requests / month",
  "5mb per request",
  "Unlimited requests per hour",
  "No down time",
];

export function FreeForOpenSource() {
  const router = useRouter();
  return (
    <FreePricingHeroCardLarge>
      <Frame315>
        <Frame247>
          <Frame246>
            {features.map((feature, i) => (
              <PricelistFeatureItemFeatured key={i}>
                <CheckFilled />
                <FeatureName_0019>{feature}</FeatureName_0019>
              </PricelistFeatureItemFeatured>
            ))}
          </Frame246>
        </Frame247>
        <Frame314>
          <Frame313>
            <TextLayout>
              <Free>Free</Free>
              <ForOpenSource>for Open Source</ForOpenSource>
            </TextLayout>
            <Frame312>
              <Button
                onClick={() => {
                  router.push(k.LINK_APPLY_FOR_OSS_PLAN);
                }}
              >
                <Label>Apply</Label>
              </Button>
              <LimitedToPublicProjectsThatAreOnGithub>
                *Limited to Public Projects that are on Github
              </LimitedToPublicProjectsThatAreOnGithub>
            </Frame312>
          </Frame313>
        </Frame314>
      </Frame315>
    </FreePricingHeroCardLarge>
  );
}

const FreePricingHeroCardLarge = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  box-shadow: 0px 4px 64px 12px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  background-color: white;
  box-sizing: border-box;
`;

const Label = styled.span`
  color: white;
  text-overflow: ellipsis;
  font-size: 18px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 700;
  text-align: left;
`;

const Frame315 = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
`;

const Frame247 = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  gap: 10px;
  border-radius: 8px;
  width: 520px;
  background-color: rgb(252, 252, 252);
  box-sizing: border-box;
  padding: 56px;
`;

const Frame246 = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
`;

const PricelistFeatureItemFeatured = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  align-self: stretch;
  height: 32px;
  box-sizing: border-box;
  flex-shrink: 0;
`;

const Frame245 = styled.img`
  width: 24px;
  height: 24px;
  object-fit: cover;
`;

const FeatureName_0019 = styled.span`
  color: rgb(94, 94, 94);
  text-overflow: ellipsis;
  font-size: 18px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 400;
  text-align: left;
`;

const Frame314 = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: 10px;
  width: 520px;
  background-color: white;
  box-sizing: border-box;
  padding: 31px 72px;
`;

const Frame313 = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  flex: none;
  gap: 24px;
  box-sizing: border-box;
`;

const TextLayout = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: flex-end;
  flex: none;
  gap: 12px;
  box-sizing: border-box;
`;

const Free = styled.span`
  color: black;
  text-overflow: ellipsis;
  font-size: 42px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 700;
  text-align: left;
`;

const ForOpenSource = styled.span`
  color: rgb(99, 99, 99);
  text-overflow: ellipsis;
  font-size: 32px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 400;
  text-align: left;
`;

const Frame312 = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  flex: none;
  gap: 14px;
  box-sizing: border-box;
`;

const Button = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 10px;
  border: solid 1px rgb(28, 28, 28);
  border-radius: 4px;
  width: 337px;
  background-color: black;
  box-sizing: border-box;
  padding: 12px 89px;
`;

const LimitedToPublicProjectsThatAreOnGithub = styled.span`
  color: rgb(154, 154, 154);
  text-overflow: ellipsis;
  font-size: 16px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 400;
  line-height: 135%;
  text-align: left;
`;
