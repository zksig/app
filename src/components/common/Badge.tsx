export default function Badge({
  text,
  color = "bg-purple-500",
  className,
}: {
  text: string;
  color?: string;
  className?: string;
}) {
  return (
    <div
      className={`h-6 rounded-full px-2 py-1 text-center text-xs text-white ${className} overflow-hidden text-ellipsis whitespace-nowrap ${color}`}
    >
      {text}
    </div>
  );
}
