<template>
  <aside
    class="z-[45] absolute lg:relative min-w-64 h-full bg-white overflow-y-auto shadow-sm"
  >
    <nav class="w-full h-full text-[#7d899f]">
      <ul class="w-full h-full flex flex-col space-y-2 px-4 py-4 lg:py-6 xl:py-8">
        <li
          v-for="item in dashBoardMenu"
          :key="item.name"
          :class="{
            'bg-secondary text-primary font-semibold rounded-md':
              item.name === 'Customers',
          }"
          class="flex items-center py-0.5 pl-3"
        >
          <RouterLink
            to="/customers"
            class="w-full h-full flex items-center"
          >
            <span>
              <component :is="item.icon" />
            </span>
            <a :href="item.route" class="block px-4 py-2">{{ item.name }}</a>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import type { Component } from "vue";
import UserIcon from "../icons/UserIcon.vue";

interface DashboardMenu {
  name: string;
  route: string;
  icon: Component;
}

const dashBoardMenu: Array<DashboardMenu> = [
  {
    name: "Customers",
    route: "/",
    icon: UserIcon,
  },
];
</script>
