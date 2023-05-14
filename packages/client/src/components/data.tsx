import {
  ArrowDownToLine,
  ArrowRightToLine,
  ArrowUpToLine,
  CheckCircle,
  XCircle,
} from "lucide-react";

export const labels = [
  {
    value: true,
    label: "Yes",
  },
  {
    value: false,
    label: "No",
  },
];

export const statuses = [
  {
    value: true,
    label: "Yes",
    icon: CheckCircle,
  },
  {
    value: false,
    label: "No",
    icon: XCircle,
  },
];

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDownToLine,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRightToLine,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUpToLine,
  },
];
