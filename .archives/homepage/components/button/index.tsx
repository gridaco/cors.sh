import React, { forwardRef } from "react";
import styled from "@emotion/styled";

type Props = React.PropsWithRef<
  {
    onClick?: () => void;
  } & React.PropsWithChildren
>;

function _Button({
  children,
  // @ts-ignore
  ref,
  onClick,
}: Props) {
  return (
    <ButtonBase ref={ref} onClick={onClick}>
      {children}
    </ButtonBase>
  );
}

export const Button = forwardRef(_Button);

const ButtonBase = styled.button`
  background-color: black;
  border-radius: 2px;
  padding: 10px;
  color: white;
  font-size: 14px;
  font-family: Inter, sans-serif;
  font-weight: 400;
  border: none;
  outline: none;
  cursor: pointer;

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
