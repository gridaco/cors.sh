import Link from "next/link"
import React from "react"

export default function ContactPage() {
  return <main className="max-w-screen-xl overflow-x-visible m-auto flex min-h-screen flex-col items-center md:items-stretch justify-center p-10 text-center md:text-start">
    <h1 className="text-5xl font-bold">Contact</h1>
    <div style={{ height: 40 }} />
    <Link href="https://grida.co/join-slack">
      <button className="underline">Join our Slack channel for Inqueries</button>
    </Link>
  </main>
}