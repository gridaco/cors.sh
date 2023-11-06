import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { Pencil1Icon } from "@radix-ui/react-icons";
import client, { ApplicationWithApiKey } from "@cors.sh/service-api";
import { FormPageLayout, PageCloseButton } from "@app/ui/layouts";
import { Button, TextFormField } from "@editor-ui/console";
import { Logo } from "@/components/logo";
import { UnderlineButton } from "@app/ui/components";
import { ApiKeyReveal } from "@app/ui/components";

export default function ApplicationDetailPage({
  application,
}: {
  application: ApplicationWithApiKey;
}) {
  return (
    <FormPageLayout>
      <PageCloseButton />
      <Logo />
      <div style={{ height: 80 }} />
      <EditableTitle initialValue={application.name} />
      <div className="form">
        <ApiKeyReveal
          keys={{
            test: application.apikey_test,
            prod: application.apikey_live,
          }}
        />

        <TextFormField
          readonly
          label="Application origin URL"
          placeholder="http://localhost:3000, https://my-site.com"
          helpText="You can add up to 3 urls of your site"
          value={application.allowedOrigins?.join(", ")}
        // onChange={setAllowedOrigins}
        />
        <TextFormField
          readonly
          label="Restrict Targets (Optional)"
          placeholder="http://localhost:3000, https://my-site.com"
          helpText="You can restrict target urls for extra security"
          value={application.allowedOrigins?.join(", ")}
        // onChange={setAllowedOrigins}
        />

        <Button height={36}>Save</Button>
        <UnderlineButton>Archive application</UnderlineButton>
      </div>
    </FormPageLayout>
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
  }, [editing]);

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
      <button
        className="edit-button"
        style={{
          visibility: editing ? "hidden" : "visible",
        }}
        onClick={() => setEditing(true)}
      >
        <Pencil1Icon />
      </button>
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

export async function getServerSideProps(context: any) {
  const { id } = context.query;
  // const application = await client.getApplication(id);
  // return {
  //   props: {
  //     application,
  //   },
  // };

  return {
    props: {
      application: {
        id,
        name: "my-portfolio-website",
        apikey_live: "prod_1223-xasx-xxe2",
        apikey_test: "test_xxasdj-xxd9-x2hx",
      },
    },
  };
}
