import React from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

/**
 * usage code snippet
 */
const examples = {
  fetch: (t: string) => `fetch('https://proxy.cors.sh/${t}', {
    headers: {
      'x-cors-api-key': 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    }
  })

// or...
functon fetchWithProxy(url, params){
  return fetch(\`https://proxy.cors.sh/\${url}\`, 
  { 
    ...params,
    headers: 
    { 
      ...params.headers,
      'x-cors-api-key': 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
    }
  });
}

fetchWithProxy('${t}')
  `,
  axios: (t: string) => `import Axios from "axios";

Axios.get('https://proxy.cors.sh/${t}', {
  headers: {
    'x-cors-api-key': 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  }
})

// or...
const client = Axios.create({
  baseURL: 'https://proxy.cors.sh/' + '${t}',
  headers: {
    'x-cors-api-key': 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  }
})

client.get('/')
`,
} as const;

export function DemoTerminal({
  target = "https://acme.com",
}: {
  target: string;
}) {
  const [example, setExample] = React.useState<"fetch" | "axios">("fetch");
  const router = useRouter();
  return (
    <Wrapper>
      <Content>
        <SyntaxHighlighter language="js">
          {examples[example](target)}
        </SyntaxHighlighter>
      </Content>
      <Tabs>
        {Object.keys(examples).map((key) => {
          return (
            <TabItem
              onClick={() => {
                setExample(key as any);
              }}
              key={key}
              selected={key === example}
            >
              {key}
            </TabItem>
          );
        })}
      </Tabs>
      <ViewAllExamples href="/docs/category/guides">
        View all examples
      </ViewAllExamples>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  background-color: #f5f2f0;
  border: solid 1px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  box-shadow: 0px 4px 32px rgba(0, 0, 0, 0.04);
`;

const Content = styled.span`
  color: rgb(68, 68, 68);
  text-overflow: ellipsis;
  font-size: 16px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 500;
  text-align: left;
  position: absolute;
  left: 40px;
  top: 98px;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: flex-start;
  gap: 17px;
  box-sizing: border-box;
  position: absolute;
  left: 40px;
  top: 40px;
  width: 127px;
  height: 19px;
`;

const TabItem = styled.span<{ selected?: boolean }>`
  cursor: pointer;
  color: rgba(0, 0, 0, ${(p) => (p.selected ? "0.8" : "0.2")});
  text-overflow: ellipsis;
  font-size: 16px;
  font-family: Inter, sans-serif;
  font-weight: 400;
  text-align: left;
`;

const ViewAllExamples = styled.a`
  cursor: pointer;
  color: rgba(0, 0, 0, 0.3);
  text-overflow: ellipsis;
  font-size: 16px;
  font-family: Inter, sans-serif;
  font-weight: 400;
  text-align: left;
  position: absolute;
  right: 40px;
  top: 40px;
`;
