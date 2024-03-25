
export function Button({ variant = 'primary', children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger"
}) {
  return (
    <button
      data-variant={variant}
      className="
      rounded-md border
      shadow-sm text-xs px-2.5 py-1.5
      bg-neutral-100 
      data-[variant=primary]:bg-black data-[variant=primary]:text-white data-[variant=primary]:dark:bg-white data-[variant=primary]:dark:text-black 
      data-[variant=danger]:bg-red-50 data-[variant=danger]:text-red-500 data-[variant=danger]:dark:bg-red-500 data-[variant=danger]:dark:text-white data-[variant=danger]:dark:hover:bg-red-600 data-[variant=danger]:dark:hover:text-white 
      data-[variant=secondary]:bg-white data-[variant=secondary]:text-black data-[variant=secondary]:dark:bg-neutral-900 data-[variant=secondary]:dark:text-white data-[variant=secondary]:dark:hover:bg-neutral-800 data-[variant=secondary]:dark:hover:text-white data-[variant=secondary]:border-neutral-200 data-[variant=secondary]:dark:border-neutral-800 data-[variant=secondary]:dark:hover:border-neutra"
      {...props}
    >
      {children}
    </button>
  )
}
