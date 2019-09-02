<template>
	<div class="item">
		<router-link tag="div" class="birthday" :to="{ name: 'birthdayDetails', params: { id: birthday._id}}">
			<span class="birthday__counter">{{ Math.ceil(getDays(birthday.dob)) }} days..</span>
			<span class="birthday__name">{{ birthday.name }}</span>
			<span class="birthday__date">
				{{ birthday.dob.toLocaleString('default', {month: 'short'}) }}
				{{ birthday.dob.getDate() }}
			</span>
		</router-link>
	</div>
</template>

<script>
import { dateMixin } from '../../mixins/dateMixin.js';

export default {
	props: ['birthday'],
	mixins: [dateMixin]
}
</script>

<style lang="scss" scoped>
@import "./src/styles/_variables.scss";


.item {
	display: flex;
	flex-flow: column;

	&__days {
		font-weight: 900;
		margin-right: 10px;
		border-radius: 20px;
	}

	&__text {
		font-size: 40px;
	}
}

.birthday {
	z-index: 2;
	display: flex;
	align-items: center;
	position: relative;
	width: 880px;
	height: 130px;
	font-size: 52px;
	color: $text-color;
	background-color: $compl-color;
	border: none;
	box-shadow: $box-shadow;
	margin-bottom: 90px;

	&__name {
		font-family: 'Fredoka One', fantasy;
		font-size: 55px;
		letter-spacing: 3px;
		padding-left: 30px;
	}

	&__date {
		font-size: 60px;
		margin-left: auto;
		padding-right: 50px;
		font-weight: 400;
	}

	&__counter {
		font-weight: 600;
		font-size: 40px;
		position: absolute;
		top: -25px;
		left: 40%;
	}
}

</style>
