import { MouseEventHandler, ReactNode } from "react";
import iconNames from "./icons";

export default function Button({
  text,
  color = "bg-purple-500",
  hoverColor = "bg-purple-400",
  iconName,
  icon,
  className,
  onClick,
  disabled,
}: {
  text: string;
  color?: string;
  hoverColor?: string;
  iconName?: string;
  icon?: ReactNode;
  className?: string;
  onClick?: MouseEventHandler;
  disabled?: boolean;
}) {
  return (
    <button
      style={{ cursor: "pointer" }}
      className={`my-4 flex w-48 items-center justify-center gap-2 rounded p-2 text-white transition duration-200 ${className} ${color} hover:${hoverColor}`}
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      {icon ? icon : iconNames[iconName || ""]}
      <span className="block truncate">{text}</span>
    </button>
  );
}
