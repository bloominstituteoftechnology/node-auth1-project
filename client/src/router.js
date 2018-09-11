import Vue from 'vue';
import Router from 'vue-router';
import Register from './views/Register.vue';
import Login from './views/Login.vue';
import Users from './views/Users.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'register',
      component: Register,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/users',
      name: 'users',
      component: Users,
    },
  ],
});
