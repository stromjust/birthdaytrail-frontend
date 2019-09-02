<template>
	<div class="navbar">
		<router-link to="/" tag="span" v-if="$store.state.showLogo">
			<img class="navbar__logo" src="../../assets/logo.svg" alt="Birthday Trail logo">
		</router-link>

		<mobile-menu></mobile-menu>
	</div>
</template>

<script>
	import axios from 'axios'
	import Menu from './Menu.vue'

	export default {
		methods: {
		},
		components: {
			'mobile-menu': Menu
		}
	}
</script>

<style lang="scss" scoped>
@import "./src/styles/_variables.scss";

.navbar {
	overflow: hidden;
	margin: 0;
	padding: 20px 0 40px 0;
	width: 100%;
	height: auto;
	border-bottom: 3px solid $dull-text-color;
	box-shadow: $dp3;

	display: flex;
	align-items: center;

	&__logo {
		will-change: transform;
		margin-left: 30px;
		width: 430px;
	}
}


</style>
