<template>
  <apexchart
    type="area"
    height="350"
    :options="chartOptions"
    :series="series"
    class="bg-white rounded-lg shadow-md p-3"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useCustomerStore } from "@/store/customers";

const customerStore = useCustomerStore();

// Ensure labels are always Mon-Sun
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const series = computed(() => {
  const activeData = Array(7).fill(0);
  const inactiveData = Array(7).fill(0);

  customerStore.customerData.forEach((item) => {
    const date = new Date(item.date);

    const weekday = date.toLocaleDateString("en-US", { weekday: "short" });

    const index = weekDays.indexOf(weekday);
    if (index !== -1) {
      activeData[index] = item.active;
      inactiveData[index] = item.inactive;
    }
  });

  return [
    { name: "Active", data: activeData },
    { name: "Inactive", data: inactiveData },
  ];
});

const chartOptions = {
  colors: ["#5b42db", "#ef4444"],
  labels: weekDays,
  chart: {
    fontFamily: "Karla, serif",
    toolbar: { show: false },
    zoom: {
      enabled: false,
    },
  },
  plotOptions: {
    area: {
      fillTo: "end",
    },
  },
  noData: {
    text: "No data available",
    align: "center",
    verticalAlign: "middle",
    style: {
      color: "#263238",
      fontSize: "16px",
    },
  },
  title: {
    text: "Analysis",
    align: "left",
    margin: 5,
    offsetX: 11,
    style: {
      fontSize: "20px",
      fontWeight: "bold",
      color: "#263238",
    },
  },
  fill: {
    colors: ["#5b42db", "#ef4444"],
  },
  theme: {
    mode: "light",
  },
  tooltip: {
    theme: "light",
    marker: {
      show: true,
    },
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: true,
    position: "bottom",
    horizontalAlign: "center",
    offsetY: 40, 
    formatter: (seriesName: string) => {
      return `${seriesName} Customers`;
    },
    markers: {
      shape: "sparkle",
      fillColors: ["#5b42db", "#ef4444"],
    },
    itemMargin: {
      horizontal: 5,
    },
  },
  markers: {
    hover: {
      size: 4.3,
    },
  },
  stroke: {
    curve: "smooth",
    width: 2,
  },
  responsive: [
    {
      breakpoint: 1240,
      options: {
        legend: {
          offsetY: 10,
        }
      }
    }
  ]
};
</script>
