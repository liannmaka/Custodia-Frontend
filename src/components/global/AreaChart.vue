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
import { useCustomerStore } from "../../store/customers";

const customerStore = useCustomerStore();

const series = computed(() => {
  return [
  {
    name: "Active",
    data: customerStore.dailyActiveCustomers,
  },
  {
    name: "Inactive",
    data: customerStore.dailyInactiveCustomers,
  },
  ]
})

const chartOptions = {
  colors: ["#5b42db", "#ef4444"],
  labels: ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"],
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
    formatter: (seriesName: string) => {
      return `${seriesName} Customers`;
    },
    markers: {
      shape: "sparkle",
      fillColors: ["#5b42db", "#ef4444"],
    },
    itemMargin: {
      horizontal: 5
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
};
</script>
