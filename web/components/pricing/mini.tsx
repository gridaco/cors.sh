
export function MiniPlanSelect({
  onChange,
  value,
  options,
}: {
  onChange: (id: string) => void;
  value?: string;
  options: Array<{ id: string, label: React.ReactElement | string, content: React.ReactElement | string }>;
}) {
  return <div className="flex flex-row justify-evenly gap-4">
    {options.map(({ id, label, content }, i) => {
      const selected = id === value;
      return (
        <MiniPriceCard key={i}
          label={label}
          content={content}
          selected={selected}
          onClick={() => {
            onChange(id);
          }} />
      )
    })}
  </div>
}


export function MiniPriceCard({
  label,
  content,
  selected,
  onClick
}: {
  label: React.ReactElement | string;
  content: React.ReactElement | string;
  selected: boolean;
  onClick: () => void;
}) {
  return <button className="relative flex flex-col gap-2 items-center justify-center border rounded-sm border-neutral-50 border-opacity-10 flex-1 p-5 data-[selected=true]:border-opacity-80"
    data-selected={selected}
    onClick={onClick}
  >
    <div
      className="absolute right-4 top-4 w-2 h-2 rounded-full bg-neutral-50"
      style={{
        visibility: selected ? "visible" : "hidden",
      }} />
    <h6 className="text-sm">
      {label}
    </h6>
    <p className="text-xs opacity-80 flex-1">
      {content}
    </p>
  </button>
}