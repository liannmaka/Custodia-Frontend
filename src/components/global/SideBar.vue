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
        <li
          v-for="link in dashBoardMenu"
          :key="link.name"
        >
          <RouterLink to="/customers" class="w-full h-full flex items-center pl-3 py-0.5" active-class="bg-secondary text-primary rounded-md">
            <span>
              <component :is="link.icon" />
            </span>
            <a :href="link.route" class="block px-4 py-2">{{ link.name }}</a>
          </RouterLink>
        </li>
      </ul>
      <button
        class="lg:hidden absolute bottom-0 right-4 py-0.5 px-1 text-primary bg-primary/10 rounded-sm"
        @click="handleCloseSidebar"
      >
        <BackArrow class="w-5 h-5" />
      </button>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { BackArrow, UserIcon } from "../icons";
import { type DashboardMenu } from "../../types/global";

defineProps<{
  active: boolean;
}>();

const emit = defineEmits(["close-sidebar"]);

const handleCloseSidebar = () => {
  emit("close-sidebar");
};

const dashBoardMenu: DashboardMenu[] = [
  {
    name: "Customers",
    route: "/customers",
    icon: UserIcon,
  },
];
</script>
