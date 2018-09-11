import Vue from "vue";
import Router from "vue-router";
import Register from "./views/Register.vue";
import Login from "./views/Login.vue";
import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: "/",
			name: "Register",
			component: Register,
		},
		{
			path: "/login",
			name: "Login",
			// route level code-splitting
			// this generates a separate chunk (about.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: Login,
		},
		{
			path: "/home",
			name: "Home",
			component: Home,
		},
	],
});
