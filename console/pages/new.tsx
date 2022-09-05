import React from "react";
import { Button, TextFormField } from "@editor-ui/console";
export default function NewApplicationPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        margin: "auto",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "400px",
        height: "100vh",
      }}
    >
      <h1>Create new application</h1>
      <div
        style={{
          marginTop: 60,
          display: "flex",
          flexDirection: "column",
          gap: 21,
          width: "100%",
        }}
      >
        <TextFormField
          label="Project Name"
          placeholder="my-portfolio-website"
        />
        <TextFormField
          label="You site"
          placeholder="localhost:3000, www.my-site.com"
          helpText="You can add up to 3 urls of your site"
        />
        <div style={{ height: 16 }} />
        <Button height={"32px"}>Create Project</Button>
      </div>
    </div>
  );
}
