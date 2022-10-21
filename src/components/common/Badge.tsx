export default function Badge({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <div
      className={`h-6 rounded-full bg-purple-500 px-2 py-1 text-center text-xs text-white ${className} overflow-hidden text-ellipsis whitespace-nowrap`}
    >
      {text}
    </div>
  );
}
