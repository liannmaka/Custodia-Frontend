<template>
  <div class="flex flex-col gap-6">
    <header class="mb-4">
      <h1 class="text-2xl font-bold sm:self-center">Dashboard</h1>
    </header>

    <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      <template v-if="loadingTableData">
        <SkeletonCard v-for="n in 4" :key="n" />
      </template>
      <template v-else>
        <Card v-for="(card, index) in cardData" :key="index" :cardData="card" />
      </template>
    </section>

    <section class="grid grid-cols-1 lg:grid-cols-8 gap-6">
      <template v-if="loadingTableData">
        <SkeletonChart class="lg:col-start-1 lg:col-end-6" />
        <SkeletonBar class="lg:col-start-6 lg:col-span-3" />
      </template>
      <template v-else>
        <AreaChart class="lg:col-start-1 lg:col-end-6" />
        <RadialBar class="lg:col-start-6 lg:col-span-3" />
      </template>
    </section>
    <section class="px-8 py-4 mb-8 bg-white rounded-lg shadow-md">
      <div
        class="text-[#263238] font-bold mb-5 md:flex md:justify-between border-b-[1px] pb-2"
      >
        <h2 class="text-2xl font-bold mb-[7px] md:mb-0">Customers</h2>
        <RouterLink
          to="/customers"
          class="text-sm self-center flex hover:-translate-x-0.5 transition-all ease-in-out duration-100"
        >
          See more<ChevronIcon class="w-4 h-4 self-center ml-[0.8px]" />
        </RouterLink>
      </div>
      <div>
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
            :data="customerStore.formattedPaginatedCustomers.slice(0, 3)"
            :loadingData="loadingTableData"
            :rowCount="3"
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
    </section>
    <ConfirmDialog
      :isOpen="showModal"
      @closeModal="showModal = false"
      @confirm="handleDeleteCustomer"
      :loading="deleteCustomerLoader"
      :customerId="customerId"
      title="Delete Customer?"
      message="Are you sure you want to delete this customer? This action cannot be undone."
    />
  </div>
</template>

<script setup lang="ts">
import Card from "@/components/global/Card.vue";
import NoDataSvg from "@/components/svg/NoDataSvg.vue";
import RadialBar from "@/components/global/RadialBar.vue";
import AreaChart from "@/components/global/AreaChart.vue";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getCardData } from "@/components/lib/data/getCardData";
import { type Identifiable } from "@/components/global/Table.vue";
import { useCustomerStore } from "@/store/customers";
import { Table, Input, SkeletonCard, SkeletonChart, SkeletonBar, ConfirmDialog } from "@/components/global";
import { SearchIcon, ChevronIcon } from "@/components/icons";
import { customerHeaders } from "@/components/lib/data/getTableData";

const searchTerm = ref("");
const customerId = ref<string>("");
const loadingTableData = ref<boolean>(true);
  const deleteCustomerLoader = ref<boolean>(false);
  const showModal = ref<boolean>(false);

const cardData = computed(() => getCardData());

const router = useRouter();
const customerStore = useCustomerStore();

onMounted(async () => {
  loadingTableData.value = true;
  try {
    await customerStore.fetchCustomerCounts();
    await customerStore.fetchCarddata();
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
    customerStore.fetchCustomerCounts()
    customerStore.fetchCarddata()
  }
};
</script>
