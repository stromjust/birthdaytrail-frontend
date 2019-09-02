<template>
  <div v-if="show" class="person" ref="person">

		<div v-if="deletePrompt" class="person__prompt" ref="prompt">
			<div class="person__prompt--box">
				<div class="person__prompt--text">
					Delete {{ person.name }} ?
				</div>
				<div class="person__prompt--buttons">
					<div @click="deletePrompt = false">cancel</div>
					<div @click="removePerson">delete</div>
				</div>
			</div>
		</div>

		<div class="person__info">
			<span class="person__info--name">{{ person.name }}</span>
			<span class="person__info--age">{{ getAge() }}</span>
			<img class="person__info--decor" src="../../assets/decor.svg" alt="Background decoration">
		</div>

		<div class="person__date">
			<span class="person__date--day">{{ person.dob.getDate() }}</span>
			<span class="person__date--ordinal">{{ getOrdinal() }}</span>,
			<span class="person__date--month">{{ person.dob.toLocaleString('default', {month: 'long'}) }}</span>
		</div>

		<div class="person__weekday">
			<span class="person__weekday--container">
				<span :class="{'person__weekday--day': true, 'person__weekday--day-active': person.dob.getDay() == 0}">M</span>
				<span :class="{'person__weekday--day': true, 'person__weekday--day-active': person.dob.getDay() == 1}">T</span>
				<span :class="{'person__weekday--day': true, 'person__weekday--day-active': person.dob.getDay() == 2}">W</span>
				<span :class="{'person__weekday--day': true, 'person__weekday--day-active': person.dob.getDay() == 3}">T</span>
				<span :class="{'person__weekday--day': true, 'person__weekday--day-active': person.dob.getDay() == 4}">F</span>
				<span :class="{'person__weekday--day': true, 'person__weekday--day-active': person.dob.getDay() == 5}">S</span>
				<span :class="{'person__weekday--day': true, 'person__weekday--day-active': person.dob.getDay() == 6}">S</span>
			</span>
		</div>

		<div class="person__buttons">
			<div class="person__buttons--save" @click="updatePerson">save</div>
			<div class="person__buttons--delete" @click="deletePrompt = true" ref="deleteButton">delete</div>
		</div>

		<div class="person__birthdayplan">
			<span class="person__birthdayplan--title">Birthday Plan</span>
			<textarea v-model="birthdayplan_text"
								class="person__birthdayplan--text"
								rows="6" cols="30" maxlength="160"
								:placeholder="'Describe a birthday plan for ' + person.name"></textarea>
			<span class="person__birthdayplan--word-count">{{ birthdayPlanWords }}/160</span>
		</div>

		<div class="person__giftidea">
			<span class="person__giftidea--title">Gift Ideas</span>
			<div v-for="(idea, i) in giftIdeas" class="person__giftidea--container">
				<input class="person__giftidea--idea" type="text"
							 v-model="giftIdeas[i]" placeholder=""
							 @keyup.enter="$store.dispatch('hideKeyboard', $event)">
				<button class="person__giftidea--remove-idea" @click="removeIdea(i)" type="button" >
					<img src="../../assets/delete-button.svg" alt="delete idea icon">
				</button>
			</div>
			<button class="person__giftidea--add-idea" @click="addIdea" type="button">add idea</button>

		</div>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  data: () => ({
		id: '',
		person: null,
		birthdayplan_text: '',
		giftIdeas: [],
		deletePrompt: false,
		rootElement: document.createElement('div')
  }),
	computed: {
		show() {
			return this.person ? true : false
		},
		birthdayPlanWords() {
			return this.birthdayplan_text.length;
		},
		clickedElement() {
			return this.$store.state.clickedElement;
		}
	},
	watch: {
		clickedElement(el) {
			if(this.deletePrompt) {
				if(!this.$refs.prompt.contains(el) && this.$refs.deleteButton != el) {
					this.deletePrompt = false;
				}
			}
		},
		show(val) {
			if(val) {
				setTimeout(() => {
					this.$refs.person.style.opacity = "1";
					this.$refs.person.style.transform = "translateX(0%)";
					this.rootElement = this.$refs.person;
				}, 10);
			}
		}
	},
	methods: {
		updatePerson() {
			// CHECK AND CLEAN DATA BEFORE SENDING

			const data = {
				birthdayId: this.id,
				birthdayplan: this.birthdayplan_text,
				giftideas: this.giftIdeas
			};
			const config = {
				headers: {
					Authorization: 'Bearer ' + this.$store.state.token
				}
			};
			axios.patch('http://localhost:8081/birthdays', data, config)
						.then(doc => {
							this.$store.dispatch('parseAndSetBirthdays', doc.data.data.birthdays);
							this.$store.dispatch('setNotification', {message: 'saved birthday', icon: 'success'});
							this.$router.push({path: '/'});
						})
						.catch(err => {
							this.$store.dispatch('setNotification', {message: 'error while saving', icon: 'info'});
							console.log('Error saving profile: ', err);
						});
		},
		removePerson() {
			const config = {
				data: {
					birthdayId: this.id,
				},
				headers: {
					Authorization: 'Bearer ' + this.$store.state.token
				}
			};

			axios.delete('http://localhost:8081/birthdays', config)
						.then(doc => {
							this.$store.dispatch('parseAndSetBirthdays', doc.data.data.birthdays);
							this.$store.dispatch('setNotification', {message: 'deleted birthday', icon: 'success'})
							this.$router.push({path: '/'});
						})
						.catch(err => {
							this.$store.dispatch('setNotification', {message: 'error while deleting', icon: 'info'});
							console.log(err);
						});
		},
		addIdea() {
			this.giftIdeas.push('');
		},
		removeIdea(i) {
			this.giftIdeas.splice(i, 1);
		},
	  getAge() {
			if(this.person.dob.getYear() != 0) {
				const now = new Date();
				var age = now.getYear() - this.person.dob.getYear();
				const months = now.getMonth() - this.person.dob.getMonth();
				if(months < 0 || (months == 0 && now.getDate() < this.person.dob.getDate())) {
					age -= 1;
				}
				return age;
			}
			else return '';
	  },
		getOrdinal() {
			const day = this.person.dob.getDate();
			const modulo = day % 10;
			if(modulo == 3) return 'rd';
			else if(modulo == 2) return 'nd';
			else if(modulo == 1) return 'st';
			else return 'th';
		}
	},
	beforeMount() {
	  if(!this.$store.getters.tokenExist) {
			this.$router.push({path: '/login'});
		}
	},
	mounted() {
		this.$store.state.showLogo = true;
	  this.id = this.$route.params.id;

		if(this.$store.getters.tokenExist && this.$store.getters.birthdaysExist) {
			const birthdays = this.$store.getters.getBirthdays;
			for(var i = 0; i < birthdays.length; i++) {
				if(birthdays[i]._id == this.id) {
					this.person = birthdays[i];
					break;
				}
			}

			// copy
			this.birthdayplan_text = this.person.birthdayplan;
			// reference
			this.giftIdeas = this.person.giftideas;
		}
		else this.$router.push({path: '/'});
	}
}
</script>

<style lang="scss" scoped>
@import "./src/styles/_variables.scss";

.person {
	will-change: transform;
	font-size: 60px;
	color: $text-color;
	transition: transform .15s ease-out, opacity .15s ease-out;
	opacity: 0;
	transform: translateX(30%);

	&__prompt {
		position: fixed;
		display: flex;
		justify-content: center;
		width: 100%;
		z-index: 7;

		&--box {
			display: flex;
			flex-flow: column;
			align-items: center;
			justify-content: space-around;

			border: 5px solid $compl-color;
			border-radius: 10px;
			box-shadow: $dp6;
			margin-top: 100px;
			font-size: 40px;
			width: 750px;
			height: 400px;
			background-color: $bg-color;
		}

		&--text {
			font-size: 50px;
			font-weight: 600;
		}

		&--buttons {
			display: flex;
			justify-content: space-around;
			width: 100%;

			div {
				font-weight: 500;
				font-size: 50px;
				letter-spacing: 1px;
				padding: 30px 50px;
				border: 3px solid $text-color;
			}

			div:first-of-type {
				box-shadow: $box-shadow;
				font-weight: $button-weight;
				background-color: $bg-color;
			}

			div:last-of-type {
				box-shadow: $box-contr-shadow;
				background-color: $compl-contr-color;
			}
		}
	}

	&__info {
		display: flex;
		justify-content: center;
		align-items: baseline;
		margin-top: 130px;
		margin-bottom: 30px;
		position: relative;

		&--name {
			font-size: 75px;
			font-family: 'Fredoka One', cursive;
			margin-right: 20px;
		}

		&--age {
			font-size: 70px;
			transform: translateY(-50%);
		}

		&--decor {
			position: absolute;
			width: 750px;
			opacity: .1;
			transform: translateY(-15%);
		}
	}

	&__date {
		display: flex;
		justify-content: center;
		align-items: baseline;
		margin-bottom: 50px;

		&--day {

		}

		&--ordinal {
			align-self: flex-start;
			font-size: 40px;
		}

		&--month {
			margin-left: 15px;
			font-size: 50px;
		}
	}

	&__weekday {
		display: flex;
		flex-flow: column;
		align-items: center;
		margin-bottom: 150px;

		&--container {
			position: relative;
			display: flex;
			justify-content: center;
			z-index: 1;
		}

		&--container:after {
			z-index: -1;
			position: absolute;
			display: block;
			content: '';
			width:  95%;
			height: 2px;
			bottom: 20%;
			background-color: $text-color;
			border-radius: 20px;
		}

		&--day {
			box-sizing: inherit;
			display: flex;
			justify-content: center;
			align-items: center;
			margin: 0 10px;
			font-size: 45px;

			width: 70px;
			height: 70px;

			border-radius: 100%;

			&-active {
				font-family: 'Fredoka One', cursive;
				background-color: $bg-color;
				border: 3px solid $text-color;
			}
		}
	}

	&__buttons {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 50px 8%;

		&--save, &--delete {
			display: flex;
			flex-flow: column;
			justify-content: center;
			align-items: center;

			position: relative;
			font-size: $button-text-size;
			font-weight: $button-weight;
			width: 150px;
			padding: 15px 35px;
			background-color: $compl-color;
			border: 3px solid $text-color;
			box-shadow: $box-shadow;
		}

		&--delete {
			background-color: $compl-contr-color;
			box-shadow: $box-contr-shadow;
		}

		&--save::after, &--delete::after {
			content: '';
			position: absolute;
			display: block;
			height: 20px;
			width: 30px;
			left: 50%;
			bottom: 0;
			transform: translate(-50%, 100%);
			clip-path: polygon(0 0, 50% 100%, 100% 0);
			background-color: $text-color;
		}
	}



	&__birthdayplan, &__giftidea {
		display: flex;
		align-items: center;
		flex-flow: column;
		border-top: 2px solid $text-color;
		padding: 70px 0;

		&--title {
			font-size: 50px;
			font-weight: 800;
			align-self: flex-start;
			margin-left: 8%;
			margin-bottom: 50px;
		}
	}

	&__birthdayplan {
		&--text {
			background-color: rgba($main-color, .1);
			font-family: monospace;
			width: 82%;
			height: 350px;
			font-size: 45px;
			padding: 10px;
			border: none;
			border-bottom: 5px solid $main-color;
		}

		&--word-count {
			margin-top: 20px;
			font-size: 40px;
			align-self: flex-end;
			margin-right: 8%;
		}
	}

	&__giftidea {
		&--container {
			display: flex;
			flex-flow: row;
			align-items: center;
			width: 100%;
			margin-bottom: 50px;
		}

		&--idea {
			padding: 20px 0 20px 15px;
			background-color: rgba($main-color, .1);
			font-family: monospace;
			align-self: flex-start;
			margin-left: 8%;
			font-size: 45px;
			width: 65%;
			border: none;
			border-bottom: 5px solid $main-color;
		}

		&--remove-idea, &--add-idea {
			font-weight: $button-weight;
			font-family: 'Raleway', sans-serif;
			background-color: $compl-color;
			color: $text-color;
			box-shadow: $box-shadow;
			border: 3px solid $text-color;
		}

		&--remove-idea {
			height: 90px;
			padding: 0 30px;
			margin-left: 5%;
			position: relative;

			img {
				width: 45px;
			}
		}

		&--remove-idea::before {
			content: '';
			position: absolute;
			display: block;
			height: 30px;
			width: 20px;
			left: 0;
			top: 50%;
			transform: translate(-100%, -50%);
			clip-path: polygon(0% 50%, 100% 100%, 100% 0);
			background-color: $text-color;

		}

		&--add-idea {
			font-size: $button-text-size;
			padding: 15px 70px;
			position: relative;
		}

		&--add-idea::before {
			content: '';
			position: absolute;
			display: block;
			height: 20px;
			width: 30px;
			left: 50%;
			top: 0;
			transform: translate(-50%, -100%);
			clip-path: polygon(0 100%, 50% 0, 100% 100%);
			background-color: $text-color;
		}
	}
}
</style>
