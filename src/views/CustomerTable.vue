<template>
  <main class="bg-secondary pb-8">
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
      <div class="max-w-56 mb-2 sm:max-w-80">
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
          :data="customerStore.formattedPaginatedCustomers"
          :loadingData="loadingTableData"
          :rowCount="customerStore.formattedPaginatedCustomers.length || 10"
          @edit="handleEdit"
          @delete="handleDelete"
        >
          <template #emptyText>
            <div class="flex flex-col justify-center items-center">
              <NoDataSvg class="w-36 h-auto text-primary" />
              <span class="my-3 text-base text-[#263238]"
                >No data available</span
              >
            </div>
          </template>
        </Table>
      </div>
    </div>
    <div v-if="customerStore.formattedPaginatedCustomers?.length > 0">
      <Pagination
        class="mt-6"
        :currentPage="customerStore.currentPage"
        :rowsPerPage="customerStore.rowsPerPage"
        :totalPages="customerStore.totalPages"
        @prevPage="customerStore.prevPage"
        @nextPage="customerStore.nextPage"
        @pageChange="customerStore.goToPage"
        @update:rowsPerPage="customerStore.updateRowsPerPage"
      />
    </div>
    <ConfirmDialog
      :isOpen="showModal"
      @closeModal="showModal = false"
      @confirm="handleDeleteCustomer"
      :loading="deleteCustomerLoader"
      :customerId="customerId"
      title="Delete Customer?"
      message="Are you sure you want to delete this customer? This action cannot be undone."
    />
  </main>
</template>

<script setup lang="ts">
import NoDataSvg from "@/components/svg/NoDataSvg.vue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Table, Input, Pagination, ConfirmDialog } from "@/components/global";
import { SearchIcon, AddIcon } from "@/components/icons";
import { useCustomerStore } from "@/store/customers";
import { type Identifiable } from "@/components/global/Table.vue";
import { customerHeaders } from "@/components/lib/data/getTableData";

const router = useRouter();
const customerStore = useCustomerStore();

const searchTerm = ref<string>("");
const customerId = ref<string>("");
const showModal = ref<boolean>(false);
const deleteCustomerLoader = ref<boolean>(false);
const loadingTableData = ref<boolean>(true);

onMounted(async () => {
  loadingTableData.value = true;
  try {
    await customerStore.getCustomers();
  } finally {
    loadingTableData.value = false;
  }
});

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
  showModal.value = true;
  customerId.value = rowData.id ?? "";
};

const handleDeleteCustomer = async () => {
  if (!customerId.value) return;

  try {
    deleteCustomerLoader.value = true;
    await customerStore.deleteCustomer(customerId.value);
  } finally {
    deleteCustomerLoader.value = false;
    showModal.value = false;
  }
};
</script>
