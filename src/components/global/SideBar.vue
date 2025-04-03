<template>
  <aside
    :class="[
      'z-[45] absolute lg:relative h-full bg-white overflow-y-auto shadow-sm transition-all ease-in-out duration-200',
      active && 'min-w-64 lg:w-auto lg:min-w-64',
      !active && 'min-w-0 w-0 lg:w-auto lg:min-w-64',
    ]"
  >
    <nav class="relative w-full h-[87.5%] text-[#7d899f] font-semibold">
      <ul
        class="w-full h-full flex flex-col space-y-2 px-4 py-4 lg:py-6 xl:py-8"
      >
        <li v-for="(link, index) in dashBoardMenu" :key="index">
          <RouterLink
            :to="link.route"
            :class="[
              'w-full h-full flex items-center pl-3 py-0.5 hover:bg-secondary text-primary hover:rounded-md',
              route.path === link.route ? 'bg-secondary rounded-md' : '',
            ]"
          >
            <component :is="link.icon" />
            <span class="block px-2 py-2">{{ link.name }}</span>
          </RouterLink>
        </li>
      </ul>
      <button
        class="lg:hidden absolute bottom-0 right-4 py-0.5 px-1 text-primary bg-primary/10 rounded-sm backdrop-blur-sm hover:opacity-90 hover:-translate-y-0.5"
        @click="$emit('close-sidebar')"
      >
        <BackArrow class="w-5 h-5" />
      </button>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { BackArrow, UserIcon, HomeIcon} from "@/components/icons";
import { type DashboardMenu } from "@/types/global";
import { useRoute } from "vue-router";

defineProps<{
  active: boolean;
}>();

const route = useRoute();

const dashBoardMenu: DashboardMenu[] = [
  {
    name: "Dashboard",
    route: "/",
    icon: HomeIcon,
  },
  {
    name: "Customers",
    route: "/customers",
    icon: UserIcon,
  }
];
</script>
