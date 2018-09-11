<template functional>
    <div class='wrapper'>
        <div class='loading' />
    </div>    
</template>



<style lang='scss' scoped>
.wrapper {
	position: fixed;
	top: 0;
	bottom: 0;
	width: 100%;
	height: 100vh;
	background-color: rgba(#000, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 300;
}

.loading {
	width: 100px;
	height: 100px;
	border: 5px solid #000;
	border-top-color: #4fc08d;
	border-radius: 50%;
	animation: spin 1s linear infinite;
}

@keyframes spin {
	from {
		transform: rotate(0deg);
	}

	to {
		transform: rotate(360deg);
	}
}
</style>



