<template>
    <div>
        <h1>HOME</h1>
        <p v-for="user in users" v-bind:key="user.id">{{user.username}}</p>
    </div>
</template>

<script>
import axios from "axios";

export default {
	name: "Home",
	data: function() {
		return {
			users: [],
		};
	},
	mounted: function() {
		axios
			.get("http://localhost:8000/api/restricted/users")
			.then(response => {
				console.log(response);
				this.users = response.data;
			})
			.catch(error => {
				console.log(error);
			});
	},
};
</script>

