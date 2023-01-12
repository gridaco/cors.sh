import React from "react";
import styled from "@emotion/styled";

export function UnderlineButton({ children }: React.PropsWithChildren<{}>) {
  return <_Button>{children}</_Button>;
}

const _Button = styled.button`
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  text-decoration: underline;
  color: rgba(0, 0, 0, 0.5);
`;
