import React, { useState } from "react";
import styled from "@emotion/styled";
import * as Collapsible from "@radix-ui/react-collapsible";
import { CaretDownIcon, CaretUpIcon } from "@radix-ui/react-icons";

export function CollapsibleInfoCard({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) {
  const [open, setOpen] = useState(false);

  return (
    <Container open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger className="trigger">
        <h2>{title}</h2>
        <div className="icon">{open ? <CaretUpIcon /> : <CaretDownIcon />}</div>
      </Collapsible.Trigger>
      <Collapsible.Content className="content">{children}</Collapsible.Content>
    </Container>
  );
}

const Container = styled(Collapsible.Root)`
  display: flex;
  flex-direction: column;
  .trigger {
    display: flex;
    align-items: center;
    flex: 1;
    gap: 8px;
    justify-content: space-between;
    cursor: pointer;
    padding: 12px 16px;
    border-radius: 4px;
    background: #f5f5f5;
    border: 1px solid #e5e5e5;
    margin-bottom: 8px;
    h2 {
      font-size: 16px;
      font-weight: 500;
      margin: 0;
    }
    .icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;

      svg {
        width: 100%;
        height: 100%;
      }
    }
  }

  .content {
    padding: 16px;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.02);
    border: 1px solid #e5e5e5;
    margin-bottom: 16px;

    font-size: 14px;

    /* no default padding for ul */
    ul {
      margin: 0;
      padding: 16px;
    }

    li {
      padding: 0;
    }
  }

  /* motion */
  .content[data-state="open"] {
    animation: slideDown 0.2s ease-out;
  }
  .content[data-state="closed"] {
    animation: slideUp 0.2s ease-out;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      height: 0;
    }
    to {
      opacity: 1;
      height: var(--radix-collapsible-content-height);
    }
  }

  @keyframes slideUp {
    from {
      opacity: 1;
      height: var(--radix-collapsible-content-height);
    }
    to {
      opacity: 0;
      height: 0;
    }
  }
`;
