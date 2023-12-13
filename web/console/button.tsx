
export function Button({ variant = 'primary', children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary"
}) {
  return (
    <button
      data-variant={variant}
      className="rounded-md px-3 py-2 text-xs font-medium border bg-neutral-100 data-[variant=primary]:bg-black data-[variant=primary]:text-white data-[variant=primary]:dark:bg-white data-[variant=primary]:dark:text-black"
      {...props}
    >
      {children}
    </button>
  )
}
