import { createRouter, createWebHistory } from "vue-router";
import { CustomerTable, AddCustomer, Dashboard, NotFound } from "@/views";

const routes = [
  // {
  //   path: "/",
  //   redirect: "/customers",
  // },
  {
    path: "/",
    name:"Dashboard",
    component: Dashboard
  },
  {
    path: "/customers",
    children: [
      {
        path: "",
        name: "CustomerHome",
        component: CustomerTable,
        props: { mode: "customers" },
      },
      {
        path: "add-customer",
        name: "AddCustomer",
        component: AddCustomer,
        props: { mode: "add" },
      },
      {
        path: "edit-customer/:id",
        name: "EditCustomer",
        component: AddCustomer,
        props: (route: { params: { id: any } }) => ({
          mode: "edit",
          customerId: route.params.id,
        }),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: "NotFound",
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
