import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { v4 as uuidv4 } from "uuid";
import type { CustomerDetails } from "../types/global";

export const useCustomerStore = defineStore(
  "customer",
  () => {
    const customers = ref<CustomerDetails[]>([]);
    const searchTerm = ref("");

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
