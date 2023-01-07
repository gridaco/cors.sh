import React from "react";
import styled from "@emotion/styled";
import Link from "next/link";
import { Logo } from "logo";
import { FormPageLayout } from "@app/ui/layouts";
import Head from "next/head";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { UnderlineButton } from "components";

export default function ConsoleIndex({
  applications,
}: {
  applications: any[];
}) {
  return (
    <>
      <Head>
        <title>CORS.SH - Console</title>
      </Head>
      <FormPageLayout>
        <Logo />
        <div style={{ height: 80 }} />
        <ApplicationList>
          {applications.map((application) => (
            <ApplicationItem key={application.id} {...application} />
          ))}
        </ApplicationList>
        <div style={{ height: 80 }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <UnderlineButton>
            <Link href="/new">Create new application</Link>
          </UnderlineButton>
          <UnderlineButton>
            <Link href="/subscriptions">Manage subscription</Link>
          </UnderlineButton>
        </div>
      </FormPageLayout>
    </>
  );
}

const ApplicationList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  gap: 8px;
`;

function ApplicationItem({
  id,
  name,
  allowedOrigins,
}: {
  id: string;
  name: string;
  allowedOrigins: string[];
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

export async function getServerSideProps(context: any) {
  // fetch all my applications
  return {
    props: {
      applications: [
        {
          id: "1",
          name: "My app",
        },
        {
          id: "2",
          name: "My app 2",
        },
      ],
    },
  };
}
