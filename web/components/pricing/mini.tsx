import { cn } from "@workspace/ui/lib/utils";

export function MiniPlanSelect({
  onChange,
  value,
  options,
}: {
  onChange: (id: string) => void;
  value?: string;
  options: Array<{
    id: string;
    label: React.ReactElement | string;
    content: React.ReactElement | string;
  }>;
}) {
  return (
    <div className="flex flex-row justify-evenly gap-4">
      {options.map(({ id, label, content }, i) => {
        const selected = id === value;
        return (
          <MiniPriceCard
            key={i}
            label={label}
            content={content}
            selected={selected}
            onClick={() => {
              onChange(id);
            }}
          />
        );
      })}
    </div>
  );
}

export function MiniPriceCard({
  label,
  content,
  selected,
  onClick,
}: {
  label: React.ReactElement | string;
  content: React.ReactElement | string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "relative flex flex-col gap-2 items-center justify-center rounded-md border flex-1 p-5",
        "transition-colors duration-200",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "border-border/50",
        selected && "border-primary bg-accent text-accent-foreground"
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          "absolute right-4 top-4 w-2 h-2 rounded-full",
          "bg-primary",
          "transition-opacity duration-200",
          selected ? "opacity-100" : "opacity-0"
        )}
      />
      <h6 className="text-sm font-medium">{label}</h6>
      <p className="text-xs text-muted-foreground flex-1">{content}</p>
    </button>
  );
}
