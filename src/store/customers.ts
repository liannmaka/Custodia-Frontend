import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { v4 as uuidv4 } from 'uuid';
import type { CustomerDetails } from "../types/global";
  

export const useCustomerStore = defineStore("customer", () => {
  const customers = ref<CustomerDetails[]>([]);
  const searchTerm = ref("");

  // Computed filtered customers based on the search term
  const filteredCustomers = computed(() => {
    if (!searchTerm.value) return customers.value;

    return customers.value.filter((customer) => {
      return (
        customer. first_name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        customer.last_name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        customer.phone_number.includes(searchTerm.value) ||
        (customer.state || "").toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        (customer.status ? "active" : "inactive")
          .toLowerCase()
          .includes(searchTerm.value.toLowerCase())
      );
    });
  });

  // Actions
  const addCustomer = (newCustomer: CustomerDetails) => {
    customers.value.push({
      id: uuidv4(),
      ...newCustomer
    });
  };

  const updateCustomer = (id: string, updatedCustomer: CustomerDetails) => {
    const index = customers.value.findIndex((customer) => customer.id === id);
    if (index !== -1) {
      customers.value[index] = { id, ...updatedCustomer };
    }
  };

  const deleteCustomer = (id: string) => {
    customers.value = customers.value.filter((customer) => customer.id !== id);
  };

  return {
    customers,
    searchTerm,
    filteredCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  };
}, {
  persist: {
    key: 'customer-store',
    storage: localStorage,
  },
});
