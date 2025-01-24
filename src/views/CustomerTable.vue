<template>
  <main class="bg-secondary w-full h-full">
    <div class="flex justify-between mb-6 lg:mb-8">
      <h1 class="text-2xl font-bold">Customers</h1>
      <RouterLink
        to="/customers/add-customer"
        class="flex text-sm lg:text-base items-center gap-1 bg-primary py-3 px-4 rounded-md text-white cursor-pointer"
      >
        <span class="self-center">
          <AddIcon />
        </span>
        <span> Add Customer </span>
      </RouterLink>
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
          :data="formattedCustomers"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { Table, Input } from "../components/global";
import { SearchIcon, AddIcon } from "../components/icons";
import { useCustomerStore } from "../store/customers";
import { type Identifiable } from "../components/global/Table.vue";

const router = useRouter();
const customerStore = useCustomerStore();

const searchTerm = ref("");


const formattedCustomers = computed(() =>
  customerStore.filteredCustomers.map((customer) => ({
    ...customer,
    status: customer.status ? "Active" : "Inactive",
  }))
);

const handleSearchTerm = (key: string, value: string) => {
  if (key === "searchTerm") {
    searchTerm.value = value;
  }
  customerStore.setSearchTerm(value);
};

const handleEdit = (rowData: Identifiable) => {
  router.push({
    name: "EditCustomer",
    params: { id: rowData.id },
  });
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
