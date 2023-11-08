import styled from "@emotion/styled";
import React from "react";
import { OnboardingCta } from "../cta-onboarding";

export function FooterCtaSection({}: {}) {
  return (
    <Wrapper>
      <HeadingAsH3>Say bye to cors errors</HeadingAsH3>
      <ScribbleGuide>
        <WeLlSendYouAApiKeyToGetStarted>
          We’ll send you an Api key to get started
        </WeLlSendYouAApiKeyToGetStarted>
        <PointerArtwork
          src="/assets/scribble-pointer.png"
          alt="image of PointerArtwork"
        />
      </ScribbleGuide>
      <CtaContainer>
        <OnboardingCta />
      </CtaContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 51px;
  box-shadow: 0px 4px 48px 24px rgba(0, 0, 0, 0.04);
  border: solid 1px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  min-height: 60vh;
  background-color: white;
  box-sizing: border-box;
`;

const HeadingAsH3 = styled.h3`
  color: black;
  text-overflow: ellipsis;
  font-size: 64px;
  font-family: "Inter", sans-serif;
  font-weight: 700;
  letter-spacing: -1px;
  text-align: center;
  align-self: stretch;
  flex-shrink: 0;
  padding-left: 16px;
  padding-right: 16px;
`;

const CtaContainer = styled.div`
  display: flex;
  z-index: 1;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 16px;
  border-radius: 0;
  margin-top: 100px;
  box-sizing: border-box;
`;

const ScribbleGuide = styled.div`
  z-index: 0;
  width: 217px;
  height: 112px;
  position: absolute;
  left: -10px;
  top: 280px;
`;

const WeLlSendYouAApiKeyToGetStarted = styled.span`
  color: rgba(180, 180, 180, 0.7);
  text-overflow: ellipsis;
  font-size: 24px;
  font-family: "Nanum Pen Script", sans-serif;
  font-weight: 400;
  line-height: 98%;
  text-align: left;
  position: absolute;
  top: 25px;
  transform: translateX(-50px) translateY(40px) rotate(-20deg);
  transform-origin: top left;
`;

const PointerArtwork = styled.img`
  width: 53px;
  height: 69px;
  object-fit: cover;
  position: absolute;
  left: calc((calc((50% + 59px)) - 26px));
  top: 49px;
  transform: rotate(-23deg);
  transform-origin: top left;
`;
