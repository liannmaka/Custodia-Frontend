<template>
  <apexchart
    type="radialBar"
    height="350"
    :options="options"
    :series="series"
    class="bg-white rounded-lg shadow-md p-3"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useCustomerStore } from "../../store/customers";

const customerStore = useCustomerStore();

const series = computed(() => {
  return customerStore.totalCustomers > 0
    ? [customerStore.activePercentage, customerStore.inactivePercentage]
    : [];
});

const options = {
  colors: ["#5b42db", "#ef4444"],
  labels: ["Active Customers", "Inactive Customers"],
  chart: {
    toolbar: { show: false },
    fontFamily: "Karla, serif",
    spacing: [2, 2, 2, 2],
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
  plotOptions: {
    radialBar: {
      dataLabels: {
        name: {
          fontSize: "12px",
          color: "#494f51",
        },
        value: {
          fontSize: "12px",
          formatter: (value: number) => `${value}%`,
        },
      },
      track: {
        background: "#f0f0f0",
      },
    },
  },
  legend: {
    show: true,
    position: "top",
    markers: {
      shape: "sparkle",
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        legend: {
          position: "bottom",
        },
      },
    },
    {
      breakpoint: 405,
      options: {
        plotOptions: {
          radialBar: {
            dataLabels: {
              name: {
                fontSize: "10px",
              },
              value: {
                fontSize: "10px",
              },
            },
          },
        },
      },
    },
  ],
};
</script>
