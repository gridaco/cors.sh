'use client'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';


import React from 'react';
import { useMove } from '@use-gesture/react'
import styled from "@emotion/styled"
import Image from 'next/image';
import { examples } from "@/k"
import Link from 'next/link';

export function HomeCardExample() {
  return <HomeCardWrapper className='max-w-lg w-auto p-4 border border-white/10 rounded-xl flex flex-col gap-2 bg-black'>
    <div className='flex flex-row gap-2 justify-between select-none pointer-events-none'>
      <Image src='/assets/home-demo-0-illust-0-web.png' width={100} height={90} alt='' />
      <Image src='/assets/home-demo-0-illust-1-cloud.png' width={100} height={90} alt='' />
      <Image src='/assets/home-demo-0-illust-2-server.png' width={100} height={90} alt='' />
    </div>
    <div className='text-[10px] lg:text-xs rounded-lg' style={{
      background: '#08070E',
      border: 'rgba(144, 175, 255, 0.1) 1px solid'
    }}>
      <SyntaxHighlighter
        customStyle={{
          background: 'transparent',
        }}
        language='javascript' style={{
          ...dracula,
        }}>
        {examples.fetch('https://example.com')}
      </SyntaxHighlighter>
    </div>
    <Link className='flex' href='/get-started'>
      <button className='p-3 bg-neutral-50 text-orange-950 rounded-lg flex-1 text-sm font-semibold'>Get Started</button>
    </Link>
  </HomeCardWrapper >
}

const HomeCardWrapper = styled.div`
  box-shadow: 0px 4px 128px 4px rgba(94, 154, 223, 0.16);
`


export function HomeHoverCardV2() {
  const [{ x, y }, set] = React.useState({ x: 0, y: 0 });

  const bind = useMove(({ movement: [mx, my], memo }) => {
    const el = document.getElementById('card');
    const rect = el!.getBoundingClientRect();
    const halfWidth = rect.width / 2;
    const halfHeight = rect.height / 2;

    const rotateX = -1 * (my - halfHeight) / halfHeight * 10; // 10 is rotation strength
    const rotateY = (mx - halfWidth) / halfWidth * 10; // 10 is rotation strength

    set({ x: rotateY, y: rotateX });

    return { x: mx, y: my };
  });

  const style = {
    transform: `perspective(600px) rotateX(${y}deg) rotateY(${x}deg)`
  };

  return (
    <div className='p-40' {...bind()}>
      {/* @ts-ignore */}
      <Card id="card" className="card" style={style}>
        <Image
          className='shadow-lg shadow-white'
          src="/tmp-asset-1.png" width={470} height={540} alt="" />
      </Card>
    </div>
  );
}


const Card = styled.div`
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e1e1e1;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  transition: transform 0.1s;
  will-change: transform;

`