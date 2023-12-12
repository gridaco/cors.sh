'use client'

import React, { useState } from "react"
import Link from "next/link"
import { useUser } from "@/hooks/useUser"

export default function HeaderUserActions() {

  const user = useUser()

  return <>
    {
      user ? (
        <Link href='/console'>
          Console
        </Link>
      ) : (
        <Link href='/signin'>
          Sign in
        </Link>
      )
    }
    {
      !user && (
        <Link href='/get-started'>
          <button className="bg-none md:bg-neutral-50 text-inherit md:text-neutral-950 p-3 rounded-md">
            Get Started
          </button>
        </Link>
      )
    }
  </>
}