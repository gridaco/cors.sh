'use client'
import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { Pencil1Icon } from "@radix-ui/react-icons";
import client, { ApplicationWithApiKey } from "@cors.sh/service-api";
import { FormPageLayout, PageCloseButton } from "@app/ui/layouts";
import { TextFormField } from "@editor-ui/console";
import { Logo } from "@/components/logo";
import { ApiKeyReveal } from "@app/ui/components";
import { Button, Form, FormFooter, FormHeader, FormRow } from "@/console";

export default function ApplicationDetailPage({ params }: {
  params: {
    id: string;
  }
}) {

  const application: ApplicationWithApiKey = {
    id: params.id,
    name: "my-portfolio-website",
    apikey_live: "prod_1223-xasx-xxe2",
    apikey_test: "test_xxasdj-xxd9-x2hx",
    allowedOrigins: []
  }

  return (
    <main className="p-4 container mx-auto">
      <Form>
        <FormHeader>
          {application.name}
        </FormHeader>
        <FormRow>
          <ApiKeyReveal
            keys={{
              test: application.apikey_test,
              prod: application.apikey_live,
            }}
          />
        </FormRow>
        <FormRow>


          <TextFormField
            readonly
            label="Application origin URL"
            placeholder="http://localhost:3000, https://my-site.com"
            helpText="You can add up to 3 urls of your site"
            value={application.allowedOrigins?.join(", ")}
          // onChange={setAllowedOrigins}
          />
        </FormRow>
        <FormRow>
          <TextFormField
            readonly
            label="Restrict Targets (Optional)"
            placeholder="http://localhost:3000, https://my-site.com"
            helpText="You can restrict target urls for extra security"
            value={application.allowedOrigins?.join(", ")}
          // onChange={setAllowedOrigins}
          />
        </FormRow>
        <FormFooter>
          <Button variant="danger">Archive application</Button>
          <Button>Save</Button>
        </FormFooter>
      </Form>
      <div className="form">

      </div>
    </main>
  );
}

function EditableTitle({ initialValue = "" }: { initialValue?: string }) {
  const [editing, setEditing] = React.useState(false);
  const [text, setText] = React.useState(initialValue);
  const ref = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      // select all
      ref.current?.focus();
      ref.current?.setSelectionRange(0, text.length);
    }
  }, [editing, text.length]);

  return (
    <TitleInputWrapper>
      <input
        style={{
          cursor: editing ? "text" : "pointer",
        }}
        onDoubleClick={() => setEditing(true)}
        onBlur={() => setEditing(false)}
        ref={ref}
        readOnly={!editing}
        contentEditable
        onChange={(e) => {
          setText(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setEditing(false);
          }
        }}
        value={text}
      />
      <Button
        className="edit-button"
        style={{
          visibility: editing ? "hidden" : "visible",
        }}
        onClick={() => setEditing(true)}
      >
        <Pencil1Icon />
      </Button>
    </TitleInputWrapper>
  );
}

const TitleInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  input {
    width: 100%;
    box-sizing: border-box;
    font-size: 24px;
    font-weight: bold;
    border: none;
    text-align: center;
    outline: none;
  }

  .edit-button {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    opacity: 0;
    cursor: pointer;
    border: none;
    background: none;
    outline: none;
    transition: opacity 0.2s ease;
  }

  &:hover {
    .edit-button {
      opacity: 1;
    }
  }
`;