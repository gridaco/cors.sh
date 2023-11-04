import React from "react";
import Axios from "axios";

const client = Axios.create({
  baseURL: "https://accounts.grida.ngrok.io/oauth",
});

export default function OAuthCallbackPage(props: any) {
  return (
    <>
      <h1>Signed in</h1>
      <p>You may now close this page</p>
      <pre>
        <code>{JSON.stringify(props, null, 2)}</code>
      </pre>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const { code, state } = context.query;

  try {
    // TODO:
    const { data } = await client.get("/access_token", {
      params: {
        client_id: "cors.sh",
        client_secret: process.env.GRIDA_OAUTH_CLIENT_SECRET,
        code,
      },
    });
    return {
      props: {
        ...data,
      },
    };
  } catch (e) {
    console.error(e);
  }

  return {
    props: {},
  };
}
