import React from "react";
import styled from "@emotion/styled";
import { OnboardingCta } from "../components";
import CheckFilled from "../components/icons/check-filled";
import { Close } from "@mui/icons-material";

export function TryPlayground() {
  return (
    <RootWrapperTryPlayground>
      Try it out on playground for requests with body 👉{" "}
      <a className="underline" href="/playground">
        cors.sh/playground
      </a>
    </RootWrapperTryPlayground>
  );
}

const RootWrapperTryPlayground = styled.span`
  color: rgba(0, 0, 0, 0.6);
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: Inter, sans-serif;
  font-weight: 500;
  line-height: 160%;
  text-align: left;
  width: 356px;

  .underline {
    text-decoration: underline;
  }
`;

/**
 * `<SectionHero>` ('section-hero')
 * - [Open in Figma](https://figma.com/file/aPfdtNb1aGFIN9p05cmmVY?node-id=15:1784)
 * - [Open in Grida](https://code.grida.co/files/aPfdtNb1aGFIN9p05cmmVY?node=15:1784)
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
 *       <SectionHero/>
 *     </>
 *   )
 * }
 * ```
 * ---
 * @params {any} props - this widget does not requires props. you can pass custom dynamic props to the widget as you want (on typescript, it will raise type check issues).
 * ---
 * @preview
 * ![](https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/9ad3b248-98c3-46dc-9668-e4bee71c948d)
 * ---
 * @remarks
 * @see {@link https://grida.co/docs} for more information.
 * ---
 * Code generated by grida.co | engine 0.0.1 (Apache-2.0) | Generated code under CC0 (public domain) *This code is free to use, modify, and redistribute. (aknowledgment is not required)*
 *
 *
 * ![Made with Grida](https://bridged-service-static.s3.us-west-1.amazonaws.com/branding/logo/32.png)
 * <!-- Info: Please do not remove this comment unless intended. removing this section will break grida integrations. -->
 * <!-- grida.meta.widget_declaration | engine : 0.0.1 | source : figma://aPfdtNb1aGFIN9p05cmmVY/15:1784 -->
 */
export function SectionHero() {
  return (
    <RootWrapperSectionHero>
      <Headings>
        <HeadingAsH1>
          Sick of
          <br />
          cors errors?
        </HeadingAsH1>
        <Description>
          A Fast & Reliable CORS Proxy for your websites
        </Description>
      </Headings>
      <Cta>
        <OnboardingCta />
        <div style={{ height: 20 }} />
        <TryPlayground />
      </Cta>
      <FeatuersList>
        <Item>
          <CheckFilled />
          <ItemText>Secure</ItemText>
        </Item>
        <Item>
          <CheckFilled />
          <ItemText>Reliable</ItemText>
        </Item>
        <Item>
          <CheckFilled />
          <ItemText>Fast</ItemText>
        </Item>
        <Item>
          <CheckFilled />
          <ItemText>A cors-anywhere mirror</ItemText>
        </Item>
      </FeatuersList>
      <Example>
        <X>
          <Close sx={{ fontSize: 12 }} />
        </X>
        <Text>
          Access to XMLHttpRequest at 'https://target.domain' from origin
          'https://my.site' has been blocked by CORS policy: No
          'Access-Control-Allow-Origin' header is present on the requested
          resource.
        </Text>
      </Example>
      <FixThisInMinutes>Fix this in minutes</FixThisInMinutes>
      <PointerArtwork
        src="/assets/scribble-pointer.png"
        alt="image of PointerArtwork"
      />
    </RootWrapperSectionHero>
  );
}

const RootWrapperSectionHero = styled.div`
  min-height: 100vh;
  background-color: white;
  position: relative;
`;

const Headings = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  box-sizing: border-box;
  position: absolute;
  left: calc((calc((50% + -245px)) - 276px));
  top: 171px;
  width: 551px;
  height: 256px;
`;

const HeadingAsH1 = styled.h1`
  color: black;
  text-overflow: ellipsis;
  font-size: 80px;
  font-family: Inter, sans-serif;
  font-weight: 700;
  letter-spacing: -2px;
  line-height: 98%;
  text-align: left;
`;

const Description = styled.h2`
  color: rgba(0, 0, 0, 0.6);
  text-overflow: ellipsis;
  font-size: 21px;
  font-family: Inter, sans-serif;
  font-weight: 500;
  line-height: 160%;
  text-align: left;
`;

const Cta = styled.div`
  position: absolute;
  left: calc((calc((50% + -184px)) - 337px));
  top: 517px;
  height: 66px;
`;

const FeatuersList = styled.ul`
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: flex-start;
  gap: 138px;
  box-sizing: border-box;
  position: absolute;
  left: calc((calc((50% + -42px)) - 478px));
  top: 703px;
  height: 24px;
  margin: 0;
  padding: 0;
`;

const Item = styled.li`
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 15px;
  box-sizing: border-box;
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
  object-fit: cover;
`;

const ItemText = styled.span`
  color: black;
  text-overflow: ellipsis;
  font-size: 16px;
  font-family: Monaco, sans-serif;
  font-weight: 400;
  text-align: left;
`;

const Example = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: flex-start;
  gap: 10px;
  box-shadow: 0px 4px 32px rgba(255, 0, 0, 0.08);
  border: solid 1px rgb(255, 46, 46);
  border-radius: 4px;
  background-color: rgb(252, 240, 240);
  box-sizing: border-box;
  padding: 10px;
  position: absolute;
  left: calc((calc((50% + 375px)) - 269px));
  top: 247px;
  width: 537px;
  word-break: break-all;
`;

const X = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  flex: none;
  background-color: rgb(233, 22, 6);
  border-radius: 50%;
  width: 16px;
  height: 16px;
  gap: 10px;
  color: white;
  box-sizing: border-box;
  margin: 4px 0px 0px;
`;

const Text = styled.span`
  color: rgb(233, 22, 6);
  text-overflow: ellipsis;
  font-size: 18px;
  font-family: "Roboto Mono", sans-serif;
  font-weight: 400;
  letter-spacing: -1px;
  line-height: 119%;
  text-align: left;
  width: 492px;
  flex: 1;
`;

const FixThisInMinutes = styled.span`
  color: rgb(164, 164, 164);
  text-overflow: ellipsis;
  font-size: 24px;
  font-family: "Nanum Pen Script", sans-serif;
  font-weight: 400;
  line-height: 98%;
  text-align: left;
  position: absolute;
  left: calc((calc((50% + 102px)) - 84px));
  top: 123px;
  transform: rotate(-7deg);
  transform-origin: top left;
`;

const PointerArtwork = styled.img`
  width: 53px;
  height: 69px;
  object-fit: cover;
  position: absolute;
  left: calc((calc((50% + 148px)) - 26px));
  top: 143px;
  transform: rotate(-9deg);
  transform-origin: top left;
`;
