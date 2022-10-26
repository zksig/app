export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export const colorByStatus = {
  pending: "bg-yellow-500",
  complete: "bg-indigo-500",
  approved: "bg-teal-500",
  rejected: "bg-rose-500",
};
