import React from "react"

export function PreferenceFormCard({ label }: {
  label: string;
}) {
  return <div>
    <header>
      <h2>
        {label}
      </h2>
    </header>
  </div>
}