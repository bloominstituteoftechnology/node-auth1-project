<template>
  <div>
    <h1>Sign Up Babyyyyyyy</h1>
    <loading-modal v-if='loading'></loading-modal>
    <form-comp v-on:submission="register"/>
  </div>
</template>

<script>
import FormComp from "@/components/Form.vue";
import LoadingModal from "@/components/LoadingModal.vue";
import axios from "axios";

export default {
	name: "register",
	data: function() {
		return {
			loading: false,
		};
	},
	components: {
		"form-comp": FormComp,
		LoadingModal,
	},
	methods: {
		register: function(username, password) {
			this.loading = true;
			axios
				.post("http://localhost:8000/api/register", {
					username,
					password,
				})
				.then(response => {
					console.log(response);
					this.loading = false;
				})
				.catch(error => {
					console.log(error);
					this.loading = false;
				});
		},
	},
};
</script>
