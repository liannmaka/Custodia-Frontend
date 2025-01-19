<template>
  <main class="bg-secondary h-full overflow-auto px-7">
    <div v-if="!addCustomer">
      <div class="flex justify-between py-6">
        <h1 class="text-2xl font-bold">Customers</h1>
        <div
          @click="openAddCustomer"
          class="flex text-sm lg:text-base items-center gap-1 bg-primary py-3 px-4 rounded-md text-white cursor-pointer"
        >
          <span class="self-center">
            <AddIcon />
          </span>
          <span> Add Customer </span>
        </div>
      </div>
      <div class="bg-white pt-8 px-4 md:px-6 lg:px-8">
        <div class="w-[300px] mb-2">
          <Input
            placeholder="Search"
            :icon="SearchIcon"
            placement="start"
            variant="search"
            @input="(event: any) => handleSearchTerm('searchTerm', event.target.value)"
          />
        </div>
        <div class="overflow-x-auto">
          <Table
            :columns="productTitles"
            :data="customerStore.filteredCustomers"
            @delete="handleDelete"
           
          />
        </div>
      </div>
    </div>
    <div class="pt-6 rounded-lg" v-if="addCustomer">
      <AddCustomer @close-customer="closeCustomer" @customer-saved="closeCustomer"/>
    </div>
    <footer class="py-3">
      <span class="text-sm">Inspiration From: </span>
      <a
        class="text-primary text-sm"
        href="https://www.behance.net/gallery/211291667/user-management-%28-UI-design-%29#"
        >Behance</a
      >
    </footer>
  </main>
</template>

<script setup lang="ts">
import { ref, watch} from "vue";
import { Table, Input } from "../global";
import { SearchIcon, AddIcon } from "../icons";
import AddCustomer from "../AddCustomer.vue";
import { useCustomerStore } from "../../store/customers";
import type { Identifiable } from "../global/Table.vue";

const customerStore = useCustomerStore();



const searchTerm = ref("");

    const handleSearchTerm = (key: string, value: string) => {
      if (key === "searchTerm") {
        searchTerm.value = value;
      }
      customerStore.setSearchTerm(value)
    };

console.log(searchTerm.value)

const addCustomer = ref(false);

const openAddCustomer = () => {
  addCustomer.value = true;
};

const closeCustomer = () => {
  addCustomer.value = false;
};

const handleDelete = (rowData: Identifiable) => {
  const customerId = rowData.id;
  if (customerId) {
    customerStore.deleteCustomer(customerId);
  }
};

const productTitles = [
  {
    key: "first_name",
    label: "first name",
  },
  {
    key: "last_name",
    label: "last name",
  },
  {
    key: "email",
    label: "email",
  },
  {
    key: "phone_number",
    label: "phone number",
  },
  {
    key: "state",
    label: "state",
  },
  {
    key: "status",
    label: "status",
  },
  {
    key: "actions",
    label: "ACTIONS",
  },
];
</script>

<style scoped></style>
