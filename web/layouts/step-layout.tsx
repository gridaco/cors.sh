'use client';

import styled from "@emotion/styled";
import Head from "next/head";
import React, { useEffect } from "react";
import { Button } from "@editor-ui/console";
import { Logo } from "@/components/logo";

type Props = {
  title: string;
  description: string | React.ReactNode;
  nextPromptLabel: string;
  disableEnterForNext?: boolean;
  onNextClick: (e?: any) => void;
} & React.PropsWithChildren;

export function StepLayout({
  title,
  description,
  nextPromptLabel,
  onNextClick,
  children,
  disableEnterForNext,
}: Props) {
  const nextbtnref = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !disableEnterForNext) {
        onNextClick();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);

  return (
    <Layout id="layout">
      <Head>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Head>
      <HeadingContaienr>
        <Logo />
        <div style={{ height: 8 }} />
        <Heading>{title}</Heading>
        <Description>{description}</Description>
      </HeadingContaienr>
      <div style={{ height: 40 }} />
      {children}
      <div style={{ height: 40 }} />
      <FooterSticky>
        {!disableEnterForNext && (
          <PressEnterToContinue>Press enter to continue</PressEnterToContinue>
        )}
        <Button ref={nextbtnref} onClick={onNextClick}>
          {nextPromptLabel}
        </Button>
      </FooterSticky>
    </Layout>
  );
}

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 80px;
  outline: none;
  border: none;
`;

const Heading = styled.h1`
  max-width: 370px;
`;

const Description = styled.p`
  color: rgba(0, 0, 0, 0.7);
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 400;
  text-align: left;
  max-width: 600px;
`;

const HeadingContaienr = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;

const PressEnterToContinue = styled.span`
  color: rgba(0, 0, 0, 0.8);
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 400;
  text-align: left;
`;

const FooterSticky = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 24px;
  flex-direction: row;
`;
