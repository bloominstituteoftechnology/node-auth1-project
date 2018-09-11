<template>
  <div class="login">
    <h1>Login</h1>
    <loading-modal v-if='loading'/>
    <form-comp v-on:submission='login' />
  </div>
</template>


<script>
import FormComp from "@/components/Form.vue";
import LoadingModal from "@/components/LoadingModal.vue";
import axios from "axios";
import store from "@/store";

export default {
	name: "login",
	data: function() {
		return {
			loading: false,
		};
	},
	components: {
		FormComp,
		LoadingModal,
	},
	methods: {
		login: function(username, password) {
			this.loading = true;
			axios
				.post("http://localhost:8000/api/login", {
					username,
					password,
				})
				.then(response => {
					console.log(response);
					this.loading = false;
					store.setLoggedIn(true);
					this.$router.push("/home");
				})
				.catch(error => {
					console.log(error);
					this.loading = false;
				});
		},
	},
};
</script>
