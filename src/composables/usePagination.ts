import { ref, computed, type ComputedRef } from "vue";

const usePagination = (totalItems: ComputedRef<number>, initialRowsPerPage: number = 10) => {
  const currentPage = ref(1);
  const rowsPerPage = ref(initialRowsPerPage);

  // Total pages are calculated based on total items and the current rowsPerPage.
  const totalPages = computed(() => Math.ceil(totalItems.value / rowsPerPage.value));

  // Go to the next page if available.
  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };

  // Go to the previous page if available.
  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };

  // Set the current page directly.
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  // Update the number of rows per page and reset the current page.
  const updateRowsPerPage = (value: number) => {
    rowsPerPage.value = value;
    currentPage.value = 1;
  };

  return {
    currentPage,
    rowsPerPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    updateRowsPerPage,
  };
};

export default usePagination;