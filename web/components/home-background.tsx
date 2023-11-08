'use client'

import React from "react"
import Image from 'next/image'
import { motion } from 'framer-motion';

export function HomeBackground() {
  return (
    <motion.div
      transition={{
        delay: 0.2,
        duration: 2,
        ease: 'easeOut'
      }}
      initial={{
        opacity: 0.1,
        scale: 1.3
      }}
      animate={{
        opacity: 1,
        scale: 1
      }}
      id='background' className='fixed -z-10 inset-0 select-none pointer-events-none'>
      <div

        className='inset-0 flex items-center justify-center'>
        <Image src="/assets/background.svg" layout="fill" objectFit="cover" alt='background graphic' />
      </div>
      <VignettingOverlay w={200} />
    </motion.div>
  )
}

function VignettingOverlay({ w }: { w: number }) {
  return (
    <div className="absolute inset-0">
      {/* Top edge */}
      <div
        style={{ height: w }}
        className="absolute inset-x-0 top-0 bg-gradient-to-b from-black via-transparent to-transparent" />

      {/* Bottom edge */}
      <div
        style={{ height: w }}
        className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      {/* Left edge */}
      <div
        style={{ width: w }}
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-black via-transparent to-transparent" />

      {/* Right edge */}
      <div
        style={{ width: w }}
        className="absolute inset-y-0 right-0 bg-gradient-to-l from-black via-transparent to-transparent" />
    </div>
  )
}