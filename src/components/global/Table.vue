<template>
  <table class="w-full border-separate border-spacing-y-4">
    <thead>
      <tr>
        <th
          v-for="column in columns"
          :key="column.key"
          class="text-black/50 text-xs font-medium text-left py-3.5 px-4 uppercase tracking-[-0.03em] mx-2"
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
            class="bg-secondary text-black/50 text-xs font-medium text-left py-3.5 px-4 tracking-[-0.03em]"
          >
            <template v-if="column.key === 'actions'">
              <div class="flex gap-2">
                <button
                  class="text-primary"
                  @click="handleEdit(row)"
                  aria-label="Edit customer"
                >
                  <EditIcon class="w-full h-full" />
                </button>
                <button
                  class="text-red-500"
                  @click="handleDelete(row)"
                  aria-label="Delete customer"
                >
                  <DeleteIcon class="w-full h-full" />
                </button>
              </div>
            </template>
            <template v-else>
              {{ renderCellContent(idx, column.key, row) }}
            </template>
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
import { EditIcon, DeleteIcon } from "../icons";

interface Column {
  label: string;
  key: string;
}

// Identifiable interface for data rows
export interface Identifiable {
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
  ) => string | number | null;
  loadingData?: boolean;
  loadingDataText?: string | null;
  emptyText?: string;
}>();

const emit = defineEmits<{
  (e: "edit", rowData: Identifiable): void;
  (e: "delete", rowData: Identifiable): void;
}>();

const handleEdit = (rowData: Identifiable) => {
  emit("edit", rowData);
};

const handleDelete = (rowData: Identifiable) => {
  emit("delete", rowData);
};

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

table tbody tr td button {
  @apply w-4 h-4 hover:opacity-90 hover:-translate-y-0.5 transition-all ease-in-out duration-100;
}
</style>
