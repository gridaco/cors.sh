'use client'
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark as scheme } from 'react-syntax-highlighter/dist/esm/styles/prism';


export function Prism({ children, style, language = 'typescript' }: React.PropsWithChildren<{
  style?: React.CSSProperties
  language?: string
}>) {
  {/* @ts-ignore */ }
  return <SyntaxHighlighter
    customStyle={style}
    language={language}
    style={scheme}>
    {children}
  </SyntaxHighlighter>
}