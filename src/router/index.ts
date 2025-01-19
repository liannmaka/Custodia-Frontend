import { createRouter, createWebHistory } from 'vue-router';
import { AddCustomer } from '../components/ui';
import CustomerTable from '../components/dashboard-layout/CustomerTable.vue';

const routes = [
  {
    path: '/',
    redirect: '/customers',
  },
  {
    path: '/customers',
    // component: CustomerTable,
    children: [
      {
        path: '',
        name: 'CustomerHome',
        component: CustomerTable,
        props: { mode: 'home' },
      },
      {
        path: 'add-customer',
        name: 'AddCustomer',
        component: AddCustomer,
        props: { mode: 'add' },
      },
      {
        path: 'edit-customer/:id',
        name: 'EditCustomer',
        component: AddCustomer,
        props: (route: { params: { id: any; }; }) => ({ mode: 'edit', customerId: route.params.id }),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
