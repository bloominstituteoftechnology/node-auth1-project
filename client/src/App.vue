<template>
  <div id="app">
    <div id="nav">
      <div v-if='loggedIn'>
        <router-link to="/home">Home</router-link> |
        <a v-on:click='logout' href="#">Logout</a>
      </div>
      <div v-else>
        <router-link to="/">Register</router-link> |
        <router-link to="/login">Login</router-link> |
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
import axios from "axios";
import store from "@/store.js";

export default {
	data: function() {
		return store.state;
	},
	name: "app",
	methods: {
		logout() {
			axios
				.get("http://localhost:8000/api/logout")
				.then(response => {
					console.log(response);
					store.setLoggedIn(false);
					this.$router.push("/");
				})
				.catch(error => {
					console.log(error);
				});
		},
	},
};
</script>


<style>
#app {
	font-family: "Avenir", Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
