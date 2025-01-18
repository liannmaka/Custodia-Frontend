import { defineStore } from "pinia";
import { ref, computed } from "vue";

interface Customer {
    id?: string
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    state: string;
    status: boolean;
  }
  

export const useCustomerStore = defineStore("customer", () => {
  const customers = ref<Customer[]>([]);
  const searchTerm = ref("");

  // Computed filtered customers based on the search term
  const filteredCustomers = computed(() => {
    if (!searchTerm.value) return customers.value;

    return customers.value.filter((customer) => {
      return (
        customer.firstName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        customer.phone.includes(searchTerm.value) ||
        (customer.state || "").toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        (customer.status ? "active" : "inactive")
          .toLowerCase()
          .includes(searchTerm.value.toLowerCase())
      );
    });
  });

  // Actions
  const addCustomer = (newCustomer: Customer) => {
    const id = String(customers.value.length + 1);
    customers.value.push({ id, ...newCustomer });
  };

  const updateCustomer = (id: string, updatedCustomer: Customer) => {
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
});
