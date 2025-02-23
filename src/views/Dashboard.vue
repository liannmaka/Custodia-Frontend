<template>
  <div class="flex flex-col gap-6">
    <header class="mb-4">
      <h1 class="text-2xl font-bold sm:self-center">Dashboard</h1>
    </header>

    <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      <Card v-for="(card, index) in cardData" :key="index" :cardData="card" />
    </section>

    <section class="grid grid-cols-1 lg:grid-cols-8 gap-6">
      <AreaChart class="lg:col-start-1 lg:col-end-6" />
      <RadialBar class="lg:col-start-6 lg:col-span-3" />
    </section>
    <section class="px-8 py-4 bg-white rounded-lg shadow-md">
      <div class="text-[#263238] font-bold mb-5 md:flex md:justify-between border-b-[1px] pb-2">
        <h2 class="text-2xl font-bold mb-[6px] md:mb-0">Customers</h2>
        <RouterLink to="/customers" class="text-sm self-center flex">
          See more<ChevronIcon class="w-4 h-4 self-center ml-[0.8px]" />
        </RouterLink>
      </div>
      <div>
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
  </div>
</template>

<script setup lang="ts">
import Card from "@/components/global/Card.vue";
import NoDataSvg from "@/components/svg/NoDataSvg.vue";
import RadialBar from "@/components/global/RadialBar.vue";
import AreaChart from "@/components/global/AreaChart.vue";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { getCardData } from "@/components/lib/data/getCardData";
import { type Identifiable } from "@/components/global/Table.vue";
import { useCustomerStore } from "@/store/customers";
import { Table, Input } from "@/components/global";
import { SearchIcon, ChevronIcon } from "@/components/icons";
import { customerHeaders } from "@/components/lib/data/getTableData";
import { useToast } from "vue-toastification";

const searchTerm = ref("");

const cardData = computed(() => getCardData())

const router = useRouter();
const toast = useToast();
const customerStore = useCustomerStore();

const formattedCustomers = computed(() =>
  customerStore.filteredCustomers
    .map((customer) => ({
      ...customer,
      status: customer.status ? "Active" : "Inactive",
    }))
    .slice(0, 3)
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
    toast.success("Customer deleted successfully");
  }
};
</script>

<style scoped>
.table-wrapper {
  overflow: hidden;
}
.chart {
  border: 2px dashed white;
}
</style>
