import styled from "@emotion/styled";
import React from "react";

type Props = {
  title: string;
  description: string;
  nextPromptLabel: string;
  disableEnterForNext?: boolean;
  onNextClick: () => void;
} & React.PropsWithChildren;

export function StepLayout({
  title,
  description,
  nextPromptLabel,
  onNextClick,
  children,
  disableEnterForNext,
}: Props) {
  return (
    <div
      style={{
        padding: 80,
      }}
    >
      <HeadingContaienr>
        <h1>{title}</h1>
        <p>{description}</p>
      </HeadingContaienr>
      <div style={{ height: 40 }} />
      {children}
      <div style={{ height: 40 }} />
      <div>
        {!disableEnterForNext && <span>Press enter to continue</span>}
        <button onClick={onNextClick}>{nextPromptLabel}</button>
      </div>
    </div>
  );
}

const HeadingContaienr = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;
