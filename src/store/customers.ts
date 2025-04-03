import router from "@/router";
import supabase from "@/config/supabaseClient";
import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import type { CustomerDetails } from "@/types/global";
import { percentageChange, getPastDate } from "@/components/lib/utils/date";
import { useToast } from "vue-toastification";
import usePagination from "@/composables/usePagination";
import useDebounce from "@/composables/useDebounce";

export const useCustomerStore = defineStore("customer", () => {
  const toast = useToast();

  const customers = ref<CustomerDetails[]>([]);
  const searchTerm = ref<string>("");
  const totalCustomers = ref<number>(0);
  const activeCustomers = ref<number>(0);
  const inactiveCustomers = ref<number>(0);

  const oneWeekAgo = getPastDate(7);
  const twoWeeksAgo = getPastDate(14);

  const activeLastWeekCustomers = ref<number>(0);
  const activeTwoWeeksAgoCustomers = ref<number>(0);
  const inactiveLastWeekCustomers = ref<number>(0);
  const inactiveTwoWeeksAgoCustomers = ref<number>(0);
  const totalCustomersLastWeek = ref<number>(0);
  const totalCustomersTwoWeeksAgo = ref<number>(0);
  const customerData = ref<
    { date: string; active: number; inactive: number }[]
  >([]);


  // Only active customers
  const dailyActiveCustomers = computed(() =>
    customerData.value.map((item) => item.active)
  );


  // Only inactive customers
  const dailyInactiveCustomers = computed(() =>
    customerData.value.map((item) => item.inactive)
  );

  const activePercentageChange = computed(() => {
    return percentageChange(
      activeLastWeekCustomers.value,
      activeTwoWeeksAgoCustomers.value
    );
  });

  const inactivePercentageChange = computed(() => {
    return percentageChange(
      inactiveLastWeekCustomers.value,
      inactiveTwoWeeksAgoCustomers.value
    );
  });

  // in the last 7 days
  const newPercentageChange = computed(() => {
    return percentageChange(
      totalCustomersLastWeek.value,
      totalCustomersTwoWeeksAgo.value
    );
  });

  const activePercentage = computed(() =>
    totalCustomers.value > 0
      ? ((activeCustomers.value / totalCustomers.value) * 100).toFixed(0)
      : []
  );

  const inactivePercentage = computed(() =>
    totalCustomers.value > 0
      ? ((inactiveCustomers.value / totalCustomers.value) * 100).toFixed(0)
      : []
  );

  const setSearchTerm = (term: string) => {
    searchTerm.value = term;
    goToPage(1);

    delayGetCustomers();
  };

  // Integrate pagination using the filtered customers count.
  const {
    currentPage,
    rowsPerPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    updateRowsPerPage,
  } = usePagination(computed(() => totalCustomers.value));

  const formattedPaginatedCustomers = computed(() => {
    return customers.value.map((customer) => ({
      ...customer,
      status: customer.status ? "Active" : "Inactive",
    }));
  });

  watch([currentPage, rowsPerPage], () => {
    getCustomers();
  });

  // Actions
  const getCustomers = async () => {
    const start = (currentPage.value - 1) * rowsPerPage.value;
    const end = start + (rowsPerPage.value - 1);

    // Query for paginated customers
    let customerQuery = supabase
      .from("customers")
      .select("*", { count: "exact" })
      .range(start, end)
      .order("created_at", { ascending: false });

    // Search filtering
    const search = searchTerm.value.trim();
    if (search) {
      const filters = [
        `first_name.ilike.%${search}%`,
        `last_name.ilike.%${search}%`,
        `email.ilike.%${search}%`,
        `phone_number.ilike.%${search}%`,
        `state.ilike.%${search}%`,
      ];

      if (search.length >= 2) {
        const lowerSearch = search.toLowerCase();
        if ("active".startsWith(lowerSearch)) {
          filters.push("status.eq.true");
        } else if ("inactive".startsWith(lowerSearch)) {
          filters.push("status.eq.false");
        }
      }

      customerQuery = customerQuery.or(filters.join(","));
    }

    const {
      data: customersData,
      error: customersError,
      count: totalCount,
    } = await customerQuery;

    // Error handling
    if (customersError) {
      toast.error(customersError?.message || { timeout: 3000 });
      return;
    }

    // Assign values
    if (customersData) {
      customers.value = customersData;
      totalCustomers.value = totalCount ?? customersData.length;

      subscribedChanges();
    }
  };

  const fetchCarddata = async () => {
    // Fetch all data in parallel using Promise.all
    const [
      { count: totalCount },
      { count: activeCount, error: activeError },
      { count: inactiveCount, error: inactiveError },
      { count: activeLastWeekCount, error: activeLastWeekError },
      { count: activeTwoWeeksAgoCount, error: activeTwoWeeksAgoError },
      { count: inactiveLastWeekCount, error: inactiveLastWeekError },
      { count: inactiveTwoWeeksAgoCount, error: inactiveTwoWeeksAgoError },
      { count: newCustomersLastWeekCount, error: newCustomersLastWeekError },
      {
        count: newCustomersTwoWeeksAgoCount,
        error: newCustomersTwoWeeksAgoError,
      },
    ] = await Promise.all([
      supabase.from("customers").select("*", { count: "exact", head: true }),
      supabase
        .from("customers")
        .select("*", { count: "exact", head: true })
        .eq("status", true), // Active customers count
      supabase
        .from("customers")
        .select("*", { count: "exact", head: true })
        .eq("status", false), // Inactive customers count
      supabase
        .from("customers")
        .select("*", { count: "exact", head: true })
        .eq("status", true)
        .gte("created_at", oneWeekAgo.toISOString()),
      supabase
        .from("customers")
        .select("*", { count: "exact", head: true })
        .eq("status", true)
        .gte("created_at", twoWeeksAgo.toISOString())
        .lt("created_at", oneWeekAgo.toISOString()),
      supabase
        .from("customers")
        .select("*", { count: "exact", head: true })
        .eq("status", false)
        .gte("created_at", oneWeekAgo.toISOString()),
      supabase
        .from("customers")
        .select("*", { count: "exact", head: true })
        .eq("status", false)
        .gte("created_at", twoWeeksAgo.toISOString())
        .lt("created_at", oneWeekAgo.toISOString()),
      supabase
        .from("customers")
        .select("*", { count: "exact", head: true })
        .gte("created_at", oneWeekAgo.toISOString()),
      supabase
        .from("customers")
        .select("*", { count: "exact", head: true })
        .gte("created_at", twoWeeksAgo.toISOString())
        .lt("created_at", oneWeekAgo.toISOString()),
    ]);

    // Error handling
    if (
      activeError ||
      inactiveError ||
      activeLastWeekError ||
      activeTwoWeeksAgoError ||
      inactiveLastWeekError ||
      inactiveTwoWeeksAgoError ||
      newCustomersLastWeekError ||
      newCustomersTwoWeeksAgoError
    ) {
      // fix all these error message later
      toast.error(
        activeError ||
          inactiveError ||
          activeLastWeekError ||
          activeTwoWeeksAgoError ||
          inactiveLastWeekError ||
          inactiveTwoWeeksAgoError ||
          newCustomersLastWeekError ||
          newCustomersTwoWeeksAgoError,
        { timeout: 3000 }
      );
      return;
    }

    if (totalCount) {
      activeCustomers.value = activeCount ?? 0;
      inactiveCustomers.value = inactiveCount ?? 0;
      activeLastWeekCustomers.value = activeLastWeekCount ?? 0;
      activeTwoWeeksAgoCustomers.value = activeTwoWeeksAgoCount ?? 0;
      inactiveLastWeekCustomers.value = inactiveLastWeekCount ?? 0;
      inactiveTwoWeeksAgoCustomers.value = inactiveTwoWeeksAgoCount ?? 0;
      totalCustomersLastWeek.value = newCustomersLastWeekCount ?? 0;
      totalCustomersTwoWeeksAgo.value = newCustomersTwoWeeksAgoCount ?? 0;
    }
  };

  const fetchCustomerCounts = async () => {
    const { data, error } = await supabase
      .from("customers")
      .select("status, created_at");

    if (error) {
      console.error("Error fetching customer data:", error);
      return [];
    }

    // Process data to get daily counts
    const counts: Record<string, { active: number; inactive: number }> = {};
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
      counts[dateString] = { active: 0, inactive: 0 };
    }

    data.forEach((customer) => {
      const createdDate = new Date(customer.created_at)
        .toISOString()
        .split("T")[0];
      if (counts[createdDate]) {
        if (customer.status === true) counts[createdDate].active++;
        else if (customer.status === false) counts[createdDate].inactive++;
      }
    });

    customerData.value = Object.entries(counts).map(
      ([date, { active, inactive }]) => ({
        date,
        active,
        inactive,
      })
    );
  };

  const addCustomer = async (newCustomer: CustomerDetails) => {
    const { data, error } = await supabase
      .from("customers")
      .insert(newCustomer)
      .select();

    if (error) {
      toast.error("Couldn't create customer", {
        timeout: 3000,
      });

      return;
    }

    if (data) {
      toast.success("Customer created successfully", {
        timeout: 2000,
      });

      router.push("/customers");
    }
  };

  const updateCustomer = async (
    id: string,
    updatedCustomer: CustomerDetails
  ) => {
    const { data, error } = await supabase
      .from("customers")
      .update(updatedCustomer)
      .eq("id", id)
      .select();

    if (error) {
      toast.error("Couldn't update customer", {
        timeout: 3000,
      });

      return;
    }

    if (data) {
      toast.success("Customer updated successfully", {
        timeout: 2000,
      });

      router.push("/customers");
    }
  };

  const deleteCustomer = async (id: string) => {
    const { error } = await supabase.from("customers").delete().eq("id", id);

    if (error) {
      toast.error(error.message, {
        timeout: 3000,
      });

      return;
    }

    if (!error) {
      toast.success("Customer deleted successfully", {
        timeout: 2000,
      });
      getCustomers();
    }
  };

  const subscribedChanges = () => {
    supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "customers" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            customers.value.unshift(payload.new as CustomerDetails);
          }
          if (payload.eventType === "UPDATE") {
            const index = findCustomerIndex(customers.value, payload.old.id);

            if (index !== -1) {
              customers.value[index] = payload.new as CustomerDetails;
            }
          }
          if (payload.eventType === "DELETE") {
            const index = findCustomerIndex(customers.value, payload.old.id);

            if (index !== -1) {
              customers.value.splice(index, 1);
            }
          }
        }
      )
      .subscribe();
  };

  const getCustomerById = (id: string): CustomerDetails | undefined => {
    return customers.value.find((customer) => customer.id === id);
  };

  const findCustomerIndex = (
    customers: CustomerDetails[],
    id: string
  ): number => {
    return customers.findIndex((customer) => customer.id === id);
  };

  const delayGetCustomers = useDebounce(getCustomers, 500);

  return {
    customerData,
    formattedPaginatedCustomers,
    currentPage,
    rowsPerPage,
    totalPages,
    customers,
    totalCustomers,
    activeCustomers,
    inactiveCustomers,
    totalCustomersLastWeek,
    activePercentage,
    inactivePercentage,
    activePercentageChange,
    inactivePercentageChange,
    newPercentageChange,
    dailyActiveCustomers,
    dailyInactiveCustomers,
    fetchCustomerCounts,
    fetchCarddata,
    getCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    setSearchTerm,
    getCustomerById,
    nextPage,
    prevPage,
    goToPage,
    updateRowsPerPage,
  };
});
