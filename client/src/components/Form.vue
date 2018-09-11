<template>
  <div>
    <form v-on:submit.prevent="$emit('submission', username, password)" class="form">
      <div class="input-wrapper">
        <input v-model ='username' class="input" type="text" placeholder="Username">
        <span class ='border'></span>
      </div>
      <div class="input-wrapper">
        <input v-model='password' class="input" type="password" placeholder="Password">
        <span class ='border'></span>
      </div>
      <button class="button">Submit</button>
    </form>
  </div>
</template>


<script>
export default {
	name: "form-comp",
	data: function() {
		return {
			username: "",
			password: "",
		};
	},
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.form {
	max-width: 400px;
	margin: 0 auto;
	padding: 50px;
	background-color: white;
	box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.input-wrapper {
	position: relative;

	&:not(:last-child) {
		margin-bottom: 20px;
	}
}

.input {
	width: 100%;
	display: block;
	padding: 10px;
	font-size: inherit;
	font-family: inherit;
	color: inherit;
	border: none;

	&:focus {
		outline: none;

		& + .border::after {
			transform: scale(1);
		}
	}
}

.border {
	position: absolute;
	display: block;
	width: 100%;
	height: 2px;
	bottom: 0;
	left: 0;
	background-color: #bdbdbd;

	&::after {
		position: absolute;
		content: "";
		display: block;
		width: 100%;
		height: 2px;
		bottom: 0;
		left: 0;
		background-color: #4fc08d;
		transform: scale(0, 1);
		transform-origin: 10%;
		transition: all 0.3s;
	}
}

.button {
	background-color: #4fc08d;
	color: #fafafa;
	font-size: 14px;
	font-family: inherit;
	text-transform: uppercase;
	letter-spacing: 2px;
	padding: 10px 20px;
	border: none;
	border-radius: 2px;
	cursor: pointer;
	transition: all 0.3s;

	&:hover {
		box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
	}
}
</style>