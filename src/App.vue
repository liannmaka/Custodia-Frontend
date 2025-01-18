<template>
  <div className="w-screen h-screen relative overflow-hidden">
    <div className="w-full h-full flex flex-col">
      <Header />
      <div class="w-full h-full flex mt-20 overflow-hidden">
        <SideBar />
        <div class="w-full h-full overflow-auto">
          <CustomerTable />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from "./components/dashboard-layout/Header.vue";
import SideBar from "./components/dashboard-layout/SideBar.vue";
import CustomerTable from "./components/dashboard-layout/CustomerTable.vue";
</script>
