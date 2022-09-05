import React from "react";
import styled from "@emotion/styled";

export default function ConsoleIndex({
  applications,
}: {
  applications: any[];
}) {
  return (
    <>
      <h1>Applications</h1>
      <div>
        {applications.map((application) => (
          <ApplicationItem key={application.id} {...application} />
        ))}
      </div>
    </>
  );
}

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
    <ItemWrap href={`/console/${id}`}>
      <div>
        appid: {id}
        <span>{name}</span>
      </div>
    </ItemWrap>
  );
}

const ItemWrap = styled.a`
  cursor: pointer;
  border-radius: 4px;
  padding: 21px;
`;

export async function getServerSideProps(context: any) {
  // fetch all my applications
  return {
    props: {
      applications: [
        {
          id: "123",
          name: "My app",
        },
      ],
    },
  };
}
