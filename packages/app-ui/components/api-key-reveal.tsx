import React from "react";
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";
import styled from "@emotion/styled";
import { EyeOpenIcon } from "@radix-ui/react-icons";

export function ApiKeyReveal({
  keys,
}: {
  keys: { test: string; prod: string };
}) {
  const [masked, setMasked] = React.useState(true);

  const onCopy = (text: string) => {
    copy(text);
    toast.success("Copied to clipboard");
  };

  const keydisplay = (key: string, masked: boolean) => {
    if (masked) {
      // leave the first 5 characters as is
      // replace all characters except "-" that with x
      const first5 = key.slice(0, 5);
      const target = key.slice(5);
      // replace all characters except "-" with x
      const masked = target.replace(/[^-]/g, "x");
      return first5 + masked.slice(5);
    } else {
      return key;
    }
  };

  const Item = ({ sign: key }: { sign: string }) => {
    return (
      <span key={key} className="key" onClick={() => onCopy(key)}>
        <u>{keydisplay(key, masked)}</u>
        <br />
      </span>
    );
  };

  return (
    <CodeBlock>
      <div
        className="reveal"
        onClick={() => {
          setMasked(false);
        }}
        style={{
          visibility: masked ? "visible" : "hidden",
        }}
      >
        <EyeOpenIcon />
      </div>
      <pre>
        API Keys
        <br />
        <br />
        # for testing
        <br />
        <Item sign={keys.test} />
        <br />
        <br />
        # for production
        <br />
        <Item sign={keys.prod} />
      </pre>
    </CodeBlock>
  );
}

const CodeBlock = styled.code`
  position: relative;
  display: block;
  width: 100%;
  padding: 21px;
  background: black;
  color: white;
  border-radius: 4px;
  font-size: 12px;
  font-family: monospace;
  font-weight: 400;

  .reveal {
    position: absolute;
    cursor: pointer;
    top: 12px;
    right: 12px;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }

  .key {
    cursor: pointer;
  }

  pre {
    margin: 0;
  }

  &:hover {
    .reveal {
      opacity: 1;
    }
  }
`;
