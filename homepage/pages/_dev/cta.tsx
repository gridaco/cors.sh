import React from "react";
import client from "@cors.sh/service-api";

export default function CtaPage() {
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.target as HTMLFormElement).email.value;
    const res = await client.onboardingWithEmail({
      email,
    });
    console.log(res);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        padding: 80,
      }}
    >
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
        onSubmit={onSubmit}
      >
        <input id="email" type="email" placeholder="user@example.com" />
        <button type="submit">Send me an api key</button>
      </form>
    </div>
  );
}
