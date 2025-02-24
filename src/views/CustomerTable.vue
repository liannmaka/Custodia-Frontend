<template>
  <main class="bg-secondary w-full h-full">
    <div class="flex flex-col mb-6 sm:flex-row sm:justify-between lg:mb-8">
      <h1 class="text-2xl font-bold sm:self-center">Customers</h1>
      <RouterLink
        to="/customers/add-customer"
        class="w-36 flex text-sm items-center gap-1 bg-primary py-3 px-4 rounded-md text-white cursor-pointer mt-3 sm:mt-0 sm:w-auto lg:text-base"
      >
        <span class="self-center">
          <AddIcon />
        </span>
        <span> Add Customer </span>
      </RouterLink>
    </div>
    <div class="bg-white pt-8 px-4 md:px-6 lg:px-8">
      <div class="w-56 mb-2 sm:w-80">
        <Input
          placeholder="Search"
          :icon="SearchIcon"
          placement="start"
          variant="search"
          @input="(event: any) => handleSearchTerm('searchTerm', event.target.value)"
        />
      </div>
      <div class="overflow-x-auto scroller">
        <Table
          :columns="customerHeaders"
          :data="formattedCustomers"
          @edit="handleEdit"
          @delete="handleDelete"
        >
          <template #emptyText>
            <div class="flex flex-col justify-center items-center">
              <NoDataSvg class="w-36 h-auto text-primary"/>
              <span class="my-3 text-base text-[#263238]">No data available</span>
            </div>
          </template>
        </Table>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import NoDataSvg from "@/components/svg/NoDataSvg.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Table, Input } from "@/components/global";
import { SearchIcon, AddIcon } from "@/components/icons";
import { useCustomerStore } from "@/store/customers";
import { type Identifiable } from "@/components/global/Table.vue";
import { customerHeaders, formattedCustomers } from "@/components/lib/data/getTableData";
import { useToast } from "vue-toastification";


const router = useRouter();
const toast = useToast();
const customerStore = useCustomerStore();

const searchTerm = ref("");

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
    toast.success("Customer deleted successfully");
  }
};
</script>
