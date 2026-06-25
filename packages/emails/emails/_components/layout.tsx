import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

const main: React.CSSProperties = {
  backgroundColor: "#f6f6f7",
  fontFamily:
    "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
  margin: 0,
  padding: "24px 0",
};

const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid #ececec",
  borderRadius: "12px",
  margin: "0 auto",
  maxWidth: "480px",
  padding: "32px",
};

const wordmark: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: 700,
  letterSpacing: "-0.02em",
  color: "#111111",
  margin: "0 0 24px",
};

const hr: React.CSSProperties = { borderColor: "#ececec", margin: "28px 0 16px" };

const footer: React.CSSProperties = {
  color: "#8a8a8a",
  fontSize: "12px",
  lineHeight: "18px",
  margin: 0,
};

const footerLink: React.CSSProperties = { color: "#8a8a8a", textDecoration: "underline" };

/** Shared brand shell for every transactional email. `preview` is the inbox snippet. */
export function EmailLayout({
  preview,
  children,
}: {
  preview: string;
  children: React.ReactNode;
}) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Text style={wordmark}>
              cors<span style={{ color: "#9a9a9a" }}>.sh</span>
            </Text>
          </Section>
          {children}
          <Hr style={hr} />
          <Text style={footer}>
            cors.sh — the CORS proxy for frontend developers.{" "}
            <Link href="https://cors.sh" style={footerLink}>
              cors.sh
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Shared text styles reused by templates.
export const styles = {
  heading: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#111111",
    margin: "0 0 12px",
  } as React.CSSProperties,
  text: {
    fontSize: "14px",
    lineHeight: "22px",
    color: "#333333",
    margin: "0 0 12px",
  } as React.CSSProperties,
  muted: {
    fontSize: "12px",
    lineHeight: "18px",
    color: "#8a8a8a",
    margin: "0 0 8px",
  } as React.CSSProperties,
  button: {
    backgroundColor: "#111111",
    borderRadius: "8px",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 600,
    textDecoration: "none",
    padding: "11px 20px",
    display: "inline-block",
  } as React.CSSProperties,
  urlBox: {
    fontSize: "12px",
    lineHeight: "18px",
    color: "#555555",
    wordBreak: "break-all",
    backgroundColor: "#f6f6f7",
    borderRadius: "6px",
    padding: "10px 12px",
    margin: "0 0 12px",
  } as React.CSSProperties,
};
