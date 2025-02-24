import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { v4 as uuidv4 } from "uuid";
import type { CustomerDetails } from "@/types/global";
import {
  pastDate,
  percentageChange,
  dailyCount,
} from "@/components/lib/utils/date";

export const useCustomerStore = defineStore(
  "customer",
  () => {
    const customers = ref<CustomerDetails[]>([]);
    const searchTerm = ref("");

    const totalCustomers = computed(() => customers.value.length);

    const activeCustomers = computed(
      () =>
        customers.value.filter((customer) => customer.status === true).length
    );

    const inactiveCustomers = computed(
      () =>
        customers.value.filter((customer) => customer.status === false).length
    );

    const newActiveCustomers = computed(() => {
      const oneWeekAgo = pastDate(7);

      return customers.value.filter(
        (customer) =>
          customer.status === true &&
          customer.created_at &&
          new Date(customer.created_at) >= oneWeekAgo
      ).length;
    });

    const previousActiveCustomers = computed(() => {
      const oneWeekAgo = pastDate(7);
      const twoWeeksAgo = pastDate(14);

      return customers.value.filter(
        (customer) =>
          customer.status === true &&
          customer.created_at &&
          new Date(customer.created_at) >= twoWeeksAgo &&
          new Date(customer.created_at) < oneWeekAgo
      ).length;
    });

    const activePercentageChange = computed(() => {
      return percentageChange(
        newActiveCustomers.value,
        previousActiveCustomers.value
      );
    });

    const newInactiveCustomers = computed(() => {
      const oneWeekAgo = pastDate(7);

      return customers.value.filter(
        (customer) =>
          customer.status === false &&
          customer.created_at &&
          new Date(customer.created_at) >= oneWeekAgo
      ).length;
    });

    const previousInactiveCustomers = computed(() => {
      const oneWeekAgo = pastDate(7);
      const twoWeeksAgo = pastDate(14);

      return customers.value.filter(
        (customer) =>
          customer.status === false &&
          customer.created_at &&
          new Date(customer.created_at) >= twoWeeksAgo &&
          new Date(customer.created_at) < oneWeekAgo
      ).length;
    });

    const inactivePercentageChange = computed(() => {
      return percentageChange(
        newInactiveCustomers.value,
        previousInactiveCustomers.value
      );
    });

    // in the last 7 days
    const newCustomers = computed(() => {
      const oneWeekAgo = pastDate(7);

      return customers.value.filter((customer) => {
        if (!customer.created_at) return false;
        const createdDate = new Date(customer.created_at);
        return createdDate >= oneWeekAgo;
      }).length;
    });

    const previousNewCustomers = computed(() => {
      const oneWeekAgo = pastDate(7);
      const twoWeeksAgo = pastDate(14);

      return customers.value.filter(
        (customer) =>
          customer.created_at &&
          new Date(customer.created_at) >= twoWeeksAgo &&
          new Date(customer.created_at) < oneWeekAgo
      ).length;
    });

    const newPercentageChange = computed(() => {
      return percentageChange(newCustomers.value, previousNewCustomers.value);
    });

    const activePercentage = computed(() =>
      totalCustomers.value > 0
        ? ((activeCustomers.value / totalCustomers.value) * 100).toFixed(0)
        : []
    );

    const inactivePercentage = computed(() =>
      totalCustomers.value > 0
        ? ((inactiveCustomers.value / totalCustomers.value) * 100).toFixed(0)
        : []
    );

    // Area Chart
    const dailyActiveCustomers = computed(() => {
      const dailyActiveCount = dailyCount(
        customers.value,
        (customer) => customer.status === true
      );
      return dailyActiveCount;
    });

    const dailyInactiveCustomers = computed(() => {
      const dailyInactiveCount = dailyCount(
        customers.value,
        (customer) => customer.status === false
      );
      return dailyInactiveCount;
    });

    const setSearchTerm = (term: string) => {
      searchTerm.value = term;
    };

    const matchSearch = (customer: CustomerDetails, term: string) => {
      const normalizedTerm = term.trim().toLowerCase().replace(/\s+/g, "");
      const toMatch = (field: string) =>
        field.toLowerCase().replace(/\s+/g, "");

      return (
        toMatch(customer.first_name).includes(normalizedTerm) ||
        toMatch(customer.last_name).includes(normalizedTerm) ||
        toMatch(customer.email).includes(normalizedTerm) ||
        customer.phone_number.replace(/\s+/g, "").includes(normalizedTerm) ||
        toMatch(customer.state || "").includes(normalizedTerm) ||
        toMatch(customer.status ? "active" : "inactive").startsWith(
          normalizedTerm
        )
      );
    };

    const filteredCustomers = computed(() => {
      if (!searchTerm.value.trim()) return customers.value;
      return customers.value.filter((customer) =>
        matchSearch(customer, searchTerm.value)
      );
    });

    // Actions
    const addCustomer = (newCustomer: CustomerDetails) => {
      customers.value.push({
        id: uuidv4(),
        ...newCustomer,
      });
    };

    const updateCustomer = (id: string, updatedCustomer: CustomerDetails) => {
      const index = customers.value.findIndex((customer) => customer.id === id);
      if (index !== -1) {
        customers.value[index] = { id, ...updatedCustomer };
      }
    };

    const deleteCustomer = (id: string) => {
      customers.value = customers.value.filter(
        (customer) => customer.id !== id
      );
    };

    const getCustomerById = (id: string): CustomerDetails | undefined => {
      return customers.value.find((customer) => customer.id === id);
    };

    return {
      customers,
      filteredCustomers,
      totalCustomers,
      activeCustomers,
      inactiveCustomers,
      newCustomers,
      activePercentage,
      inactivePercentage,
      activePercentageChange,
      inactivePercentageChange,
      newPercentageChange,
      dailyActiveCustomers,
      dailyInactiveCustomers,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      setSearchTerm,
      getCustomerById,
    };
  },
  {
    persist: {
      key: "customer-store",
      storage: localStorage,
    },
  }
);
