import { h } from "vue";
import { UpArrow, DownArrow } from "@/components/icons/";

interface PercentageChange {
  percentage: string;
  icon: any;
  color: string;
}

export const getPastDate = (daysAgo: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
};

export const percentageChange = (
  currentDate: number,
  previousDate: number
): PercentageChange => {
  if (previousDate === 0) {
    return {
      percentage: currentDate > 0 ? "100%" : "0%",
      icon: currentDate > 0 ? h(UpArrow) : null,
      color:
        currentDate > 0
          ? "text-green-500"
          : "text-gray-500",
    };
  }

  const change = ((currentDate - previousDate) / previousDate) * 100;
  return {
    percentage: `${Math.abs(change).toFixed(0)}%`,
    icon: change > 0 ? h(UpArrow) : change < 0 ? h(DownArrow) : null,
    color:
      change > 0
        ? "text-green-500"
        : change < 0
        ? "text-red-500"
        : "text-gray-500",
  };
};
