import {Vue} from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '../bill.vue',
      name: 'Bill Page',
      component: () => import('@/src/router/bill.vue') // Replace with the actual path and component for the target page
    },
    // Other routes
  ]
});

export default router;