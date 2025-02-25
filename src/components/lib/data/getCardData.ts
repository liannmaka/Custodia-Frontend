import { UserGroup, Heart, Minus, UserPlus } from "@/components/icons";
import { useCustomerStore } from "@/store/customers";
import { type CardData } from "@/types/global";


export const getCardData = (): CardData[] => {
  const customerStore = useCustomerStore();

  const cardData = [
    {
      cardHeading: "Total Customers",
      value: customerStore.totalCustomers.toString(),
      metricsPercent: customerStore.newPercentageChange.percentage,
      metricsColor: customerStore.newPercentageChange.color,
      metricsIcon: customerStore.newPercentageChange.icon,
      icon: UserGroup,
      iconStyle: "text-[#5b42db]"
    },
    {
      cardHeading: "Active Customers",
      value: customerStore.activeCustomers.toString(),
      metricsPercent: customerStore.activePercentageChange.percentage,
      metricsColor: customerStore.activePercentageChange.color,
      metricsIcon: customerStore.activePercentageChange.icon,
      icon: Heart
    },
    {
      cardHeading: "Inactive Customers",
      value: customerStore.inactiveCustomers.toString(),
      metricsPercent: customerStore.inactivePercentageChange.percentage,
      metricsColor: customerStore.inactivePercentageChange.color,
      metricsIcon: customerStore.inactivePercentageChange.icon,
      icon: Minus,
      iconStyle: "text-[#5b42db]"
    },
    {
      textColor: "text-black",
      cardHeading: "New Customers",
      value: customerStore.newCustomers.currentCustomer.toString(),
      metricsPercent: customerStore.newPercentageChange.percentage,
      metricsColor: customerStore.newPercentageChange.color,
      metricsIcon: customerStore.newPercentageChange.icon,
      icon: UserPlus,
      iconStyle: "text-[#5b42db]"
    },
  ];

  return cardData;
};
