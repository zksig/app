export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export const statusTitle = [
  "New",
  "Pending",
  "Complete",
  "Approved",
  "Rejected",
];

export const colorByStatus = [
  "bg-gray-500",
  "bg-yellow-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-rose-500",
];
