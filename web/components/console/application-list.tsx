'use client'

import styled from "@emotion/styled";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export const ApplicationList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  gap: 8px;
`;

export function ApplicationItem({
  id,
  name,
  allowedOrigins,
}: {
  id: string;
  name: string;
  allowedOrigins?: string[];
}) {
  return (
    <Link href={`/${id}`}>
      <ItemWrap>
        <span>
          {name} ({id})
        </span>
        <ArrowRightIcon />
      </ItemWrap>
    </Link>
  );
}

const ItemWrap = styled.div`
  flex: 1;
  display: flex;
  cursor: pointer;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  flex: none;
  border-radius: 4px;
  border: solid 1px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  padding: 21px;

  &:hover {
    border: solid 1px rgba(0, 0, 0, 0.1);
    background-color: rgba(0, 0, 0, 0.02);
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  }

  transition: all 0.2s ease-in-out;
`;
