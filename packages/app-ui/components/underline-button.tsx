import React from "react";
import styled from "@emotion/styled";

export const UnderlineButton = React.forwardRef(function UnderlineButton({ children }: React.PropsWithChildren<{}>, forwaredRef: React.Ref<HTMLButtonElement>) {
  return <_Button ref={forwaredRef}>{children}</_Button>;
})

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
