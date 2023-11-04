import React from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
/**
 *
 */
function useSeoNotImportant() {
  const [load, setLoad] = React.useState(false);

  React.useEffect(() => {
    // load after 5 seconds
    setTimeout(() => {
      setLoad(true);
    }, 5000);
  }, []);

  return load;
}

/**
 * `<SectionDisclaimer>` ('section-disclaimer')
 * - [Open in Figma](https://figma.com/file/aPfdtNb1aGFIN9p05cmmVY?node-id=20:1965)
 * - [Open in Grida](https://code.grida.co/files/aPfdtNb1aGFIN9p05cmmVY?node=20:1965)
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
 *       <SectionDisclaimer/>
 *     </>
 *   )
 * }
 * ```
 * ---
 * @params {any} props - this widget does not requires props. you can pass custom dynamic props to the widget as you want (on typescript, it will raise type check issues).
 * ---
 * @preview
 * ![](https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/60bed68c-21d3-462e-a55a-003e642798e3)
 * ---
 * @remarks
 * @see {@link https://grida.co/docs} for more information.
 * ---
 * Code generated by grida.co | engine 0.0.1 (Apache-2.0) | Generated code under CC0 (public domain) *This code is free to use, modify, and redistribute. (aknowledgment is not required)*
 *
 *
 * ![Made with Grida](https://bridged-service-static.s3.us-west-1.amazonaws.com/branding/logo/32.png)
 * <!-- Info: Please do not remove this comment unless intended. removing this section will break grida integrations. -->
 * <!-- grida.meta.widget_declaration | engine : 0.0.1 | source : figma://aPfdtNb1aGFIN9p05cmmVY/20:1965 -->
 */
export function SectionDisclaimer() {
  const load = useSeoNotImportant();

  if (!load) {
    return <></>;
  }

  return (
    <RootWrapperSectionDisclaimer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Disclaimer>DISCLAIMER</Disclaimer>
      <Text>
        1. This project's intend is to serve developers a reliable cors proxy
        service with fast response for their development. Using a cors proxy
        service to connect to your own server is not a best practice. We'll
        consistently optimize our service infra to keep the paid version
        affordable as possible.
        <br />
        <br />
        2. The original code behind cors proxy is by Rob wu's cors-anywhere and
        the playground is forked from hoppscotch. both licensed under MIT, and
        our project cors.sh is licensed under Apache 2.0.
      </Text>
    </RootWrapperSectionDisclaimer>
  );
}

const RootWrapperSectionDisclaimer = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
`;

const Disclaimer = styled.span`
  color: white;
  opacity: 0.5;
  text-overflow: ellipsis;
  font-size: 18px;
  font-family: "Roboto Mono", sans-serif;
  font-weight: 500;
  text-align: center;
`;

const Text = styled.span`
  color: white;
  opacity: 0.35;
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: "Roboto Mono", sans-serif;
  text-transform: uppercase;
  font-weight: 400;
  text-align: left;
  width: 400px;
`;