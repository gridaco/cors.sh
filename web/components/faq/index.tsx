import React from "react";
import styled from "@emotion/styled";

export function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <FaqItemWrapper>
      <details>
        <summary className="question">{q}</summary>
        <p className="answer">{a}</p>
      </details>
    </FaqItemWrapper>
  );
}

const FaqItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: solid 2px rgba(var(--card-border-rgb), 0.1);
  border-radius: 8px;
  position: relative;

  .question {
    font-size: 14px;
    font-weight: 500;
  }

  .answer {
    margin-top: 16px;
    font-size: 13px;
    font-weight: 500;
    text-align: left;
    opacity: 0.5;
  }
`;
