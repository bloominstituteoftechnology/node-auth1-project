<template>
    <div>
        <h1>HOME</h1>
    </div>
</template>

<script>
import axios from "axios";

export default {
	name: "Home",
	mounted: function() {
		axios
			.get("http://localhost:8000/api/restricted/users")
			.then(response => {
				console.log(response);
			})
			.catch(error => {
				console.log(error);
			});
	},
};
</script>

