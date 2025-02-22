import { h } from "vue";
import { UpArrow, DownArrow } from "@/components/icons/";
import { type CustomerDetails } from "@/types/global";

interface PercentageChange {
  percentage: string;
  icon: any;
  color: string;
}

type CustomerFn = (customer: CustomerDetails) => void;

export const pastDate = (date: number): Date => {
  const today = new Date();
  today.setDate(today.getDate() - date);
  return today;
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
        currentDate > 0 ? "text-green-500" : "text-gray-500 justify-center ml-2",
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

const getMonday = () => {
  const monday = new Date();
  const dayOfWeek = monday.getDay();

  if (dayOfWeek === 0) {
    monday.setDate(monday.getDate() - 6);
  } else {
    monday.setDate(monday.getDate() - dayOfWeek + 1);
  }

  monday.setHours(0, 0, 0, 0);

  return monday;
};

export const dailyCount = (
  customers: Array<CustomerDetails>,
  filterFn: CustomerFn
) => {
  if (customers.length === 0) return [];
  const counts = Array(7).fill(0);

  customers.forEach((customer) => {
    if (!customer.created_at) return;
    const created = new Date(customer.created_at);
    created.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
      (created.getTime() - getMonday().getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays >= 0 && diffDays < 7 && filterFn(customer)) {
      counts[diffDays]++;
    }
  });

  return counts;
};
