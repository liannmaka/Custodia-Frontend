<template>
  <table class="w-full border-separate border-spacing-y-4">
    <thead>
      <tr>
        <th
          v-for="column in columns"
          :key="column.key"
          class="bg-secondary text-black/50 text-xs font-medium text-center py-3.5 px-4 uppercase tracking-[-0.03em] mx-2"
        >
          {{ column.label }}
        </th>
      </tr>
    </thead>
    <tbody class="w-full relative">
      <tr v-if="loadingData">
        <td class="w-full text-center p-8" :colspan="columns.length">
          {{ loadingDataText }}
        </td>
      </tr>
      <template v-else-if="data && data.length > 0">
        <tr v-for="(row, idx) in data" :key="row.id || idx">
          <td
            v-for="column in columns"
            :key="column.key"
            class="text-center py-5 px-4 border-b-[0.45px] border-black/10"
          >
            {{ renderCellContent(idx, column.key, row) }}
          </td>
        </tr>
      </template>
      <tr v-else>
        <td class="w-full text-center p-8" :colspan="columns.length">
          <slot name="emptyText">No data available</slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import type { JsxElement } from "typescript";

interface Column {
  label: string;
  key: string;
}

// Identifiable interface for data rows
interface Identifiable {
  id?: string;
  [key: string]: any;
}

const { renderCell } = defineProps<{
  columns: Column[];
  data: Identifiable[];
  renderCell?: (
    rowIndex: number,
    columnKey: string,
    rowData: Identifiable
  ) => string | number | null | JsxElement;
  loadingData?: boolean;
  loadingDataText?: string | null;
  emptyText?: string;
}>();

// Render cell content function
const renderCellContent = (
  rowIndex: number,
  columnKey: string,
  rowData: Identifiable
) => {
  if (typeof renderCell === "function") {
    return renderCell(rowIndex, columnKey, rowData) ?? "-";
  }
  return rowData[columnKey] ?? "-";
};
</script>

<style scoped>
table thead tr th:first-child {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}

table thead tr th:last-child {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

table tbody tr td {
  max-width: 15rem;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
