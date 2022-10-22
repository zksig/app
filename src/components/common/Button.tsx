import { MouseEventHandler, ReactNode } from "react";

const iconNames: Record<string, ReactNode> = {
  add: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  ),
};

export default function Button({
  text,
  iconName,
  icon,
  className,
  onClick,
}: {
  text: string;
  iconName?: string;
  icon?: ReactNode;
  className?: string;
  onClick?: MouseEventHandler;
}) {
  return (
    <button
      className={`my-4 flex w-48 justify-center gap-2 rounded bg-purple-500 p-2 text-white transition duration-200 hover:bg-purple-400 ${className}`}
      type="button"
      onClick={onClick}
    >
      {icon ? icon : iconNames[iconName || ""]}
      <span>{text}</span>
    </button>
  );
}