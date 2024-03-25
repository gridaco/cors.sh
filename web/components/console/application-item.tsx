import { ArrowRightIcon, GlobeIcon, LayersIcon } from "@radix-ui/react-icons";


export function ApplicationItem({
  id,
  name,
  allowedOrigins,
}: {
  id: string;
  name: string;
  allowedOrigins?: string[];
}) {
  return (
    <div
      className="flex flex-col items-start justify-between cursor-pointer rounded-md px-5 py-3 hover:bg-gray-500/10 transition-colors duration-200 ease-in-out"
    >
      <div className="flex flex-row gap-2 items-center justify-between">
        <GlobeIcon />
        <span className="text-md font-semibold">
          {name} ({id})
        </span>
        <ArrowRightIcon />
      </div>
      <span className="text-gray-400 text-sm">
        {allowedOrigins?.map((u) => (
          <span key={u}>{u}</span>
        ))}
      </span>
    </div>
  );
}