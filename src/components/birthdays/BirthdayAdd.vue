<template>
  <div id="addTemplate" ref="app">

		<div class="form">

			<div class="form__head">
				<span class="form__head--text">Once you've created a person, you can write <strong>birthday plan</strong> and assign <strong>gift ideas</strong> for them!</span>
				<img class="form__head--decor" src="../../assets/decor.svg" alt="Background decoration">
			</div>

			<div class="form__input">
					<div class="form__input--text">name</div>
					<input class="form__input--value" type="text"
								 @keyup.enter="$store.dispatch('hideKeyboard', $event)"
								 v-model:value="name" placeholder="">
			</div>

			<div class="form__input">
					<div class="form__input--text">month</div>
					<input class="form__input--value" type="text"
								 @keyup.enter="$store.dispatch('hideKeyboard', $event)"
							   v-model:value="month" placeholder="June">
					<div @click="showMonths()" class="form__input--selector" ref="month_popup_button">
						<div class="form__input--tip" ref="tip">click me!</div>
						<img src="../../assets/calendar-month.svg" alt="month icon">
					</div>
			</div>

			<div class="form__input">
					<div class="form__input--text">day</div>
					<input class="form__input--value" type="number"
								 @keyup.enter="$store.dispatch('hideKeyboard', $event)"
								 v-model:value="day" placeholder="21">
					<div @click="showDays()" class="form__input--selector" ref="day_popup_button">
						<img src="../../assets/calendar-day.svg" alt="day icon">
					</div>
			</div>

			<div class="form__input">
					<div class="form__input--text">year</div>
					<input class="form__input--value" type="number"
								 @keyup.enter="$store.dispatch('hideKeyboard', $event)"
								 v-model:value="year" placeholder="1990 (optional)">
					<div @click="showYears()" class="form__input--selector" ref="year_popup_button">
						<img src="../../assets/calendar-year.svg" alt="year icon">
					</div>
			</div>

			<button class="form__submit" type="button" @click="addBirthday">create</button>
		</div>

		<month-popup v-if="showMonthsPopup"
								 v-on:monthSelected="setMonthAndClose"
								 :button="$refs.month_popup_button"></month-popup>
		<day-popup v-if="showDaysPopup"
							 v-on:daySelected="setDayAndClose"
							 :button="$refs.day_popup_button"
							 :days="days"></day-popup>
		<year-popup v-if="showYearsPopup"
		 						v-on:yearSelected="setYearAndClose"
								:button="$refs.year_popup_button"></year-popup>

	</div>
</template>

<script>
	import axios from 'axios'
	import BirthdayMonthPopup from './popups/BirthdayMonthPopup.vue'
	import BirthdayDayPopup from './popups/BirthdayDayPopup.vue'
	import BirthdayYearPopup from './popups/BirthdayYearPopup.vue'

	export default {
	  data: () => ({
			name: null,
			day: null,
			month: null,
			year: null,
			showMonthsPopup: false,
			showDaysPopup: false,
			showYearsPopup: false,
			months: {
				january: {
					days: 31,
					index: 0
				},
				february: {
					days: 29,
					index: 1
				},
				march: {
					days: 31,
					index: 2
				},
				april: {
					days: 30,
					index: 3
				},
				may: {
					days: 31,
					index: 4
				},
				june: {
					days: 30,
					index: 5
				},
				july: {
					days: 31,
					index: 6
				},
				august: {
					days: 31,
					index: 7
				},
				september: {
					days: 30,
					index: 8
				},
				october: {
					days: 31,
					index: 9
				},
				november: {
					days: 30,
					index: 10
				},
				december: {
					days: 31,
					index: 11
				}
			}
	  }),
		computed: {
			days() {
				if(this.month && this.months[this.month.toLowerCase()]) {
					return this.months[this.month.toLowerCase()].days;
				}
				else {
					return 31;
				}
			}
		},
		components: {
		  'month-popup': BirthdayMonthPopup,
			'day-popup': BirthdayDayPopup,
			'year-popup': BirthdayYearPopup
		},
		methods: {
			showMonths() {
				this.showMonthsPopup = true;
			},
			showDays() {
				this.showDaysPopup = true;
			},
			showYears() {
				this.showYearsPopup = true;
			},
			setMonthAndClose(month) {
				this.showMonthsPopup = false;
				if(month) this.month = month;
			},
			setDayAndClose(day) {
				this.showDaysPopup = false;
				if(day) this.day = day;
			},
			setYearAndClose(year) {
				this.showYearsPopup = false;
				if(year) this.year = year;
			},
			resetForm() {
				this.name = null;
				this.day = null;
				this.month = null;
				this.year = null;
			},
			isFormReady() {
				if(this.name && this.day && this.month) {
					const month = this.month.toLowerCase();
					if(!this.months[month]) return false;
					if(this.months[month].days < this.day) {
						this.day = null;
						return false;
					}
					return true;
				}
				return false;
			},
		  addBirthday() {
				if(this.isFormReady()) {
					this.year = this.year ? this.year : '1900';
					const monthIndex = this.months[this.month.toLowerCase()].index;
					const dob = new Date(this.year, monthIndex, this.day);

					const data = {
						name: this.name,
						dob: dob
					};
					const config = {
						headers: {
							Authorization: 'Bearer ' + this.$store.state.token
						}
					};

					axios.post('http://localhost:8081/birthdays', data, config)
								.then(doc => {
									this.$store.dispatch('parseAndSetBirthdays', doc.data.data.birthdays);
									this.$store.dispatch('setNotification', {message: 'new birthday added', icon: 'success'});
									this.$router.push({path: '/'});
								})
								.catch(err => {
									if(err.response && err.response.status == 401) {
										this.$router.push({path: '/login'});
									}
									this.resetForm();
								});
				}
				else {
					this.$store.dispatch('setNotification', {message: 'missing input', icon: 'info'});
				}
		  }
		},
		mounted() {
		  this.$store.state.showLogo = true;
			setTimeout(() => {
				this.$refs.app.style.opacity = "1";
				this.$refs.app.style.transform = "translateX(0%)";
			});
			setTimeout(() => {
				this.$refs.tip.style.opacity = "0";
				setTimeout(() => {
					this.$refs.tip.style.display = "none";
				}, 300);
			}, 2000);
		}
	}
</script>

<style lang="scss" scoped>
@import "./src/styles/_variables.scss";

#addTemplate {
	display: flex;
	justify-content: center;
	height: 100%;
	transition: transform .15s ease-out, opacity .15s ease-out;
	opacity: 0;
	transform: translateX(30%);
}

.form {
	display: flex;
	flex-flow: column;
	align-items: center;

	&__head {
		position: relative;
		margin-top: 100px;
		margin-bottom: 70px;
		width: 800px;

		&--text {
			line-height: 75px;
			font-size: 50px;
		}

		&--decor {
			transform: translate(-50%, -50%);
			position: absolute;
			width: 700px;
			opacity: .15;
			top: 55%;
			left: 50%;
		}
	}

	&__profile {
		width: 500px;
		margin: 30px 0;
		filter: grayscale(100%);
	}

	&__input {
		position: relative;
		display: flex;
		margin: 30px 0;
		box-shadow: $box-shadow;
		width: 800px;

		&--text {
			display: flex;
			justify-content: center;
			align-items: center;

			min-width: 300px;
			font-size: 45px;
			color: $text-color;
			font-weight: 600;
			letter-spacing: 3px;
			background-color: $compl-color;
			border-right: 3px solid $dull-text-color;
		}

		&--value {
			max-width: 470px;
			width: auto;
			padding-left: 30px;
			border: none;
			font-size: 52px;
			height: 100px;
			background-color: $compl-color;
		}

		&--value::placeholder {
			color: rgba($dull-text-color, .3);
			font-size: 44px;
		}

		&--selector {
			border-left: 3px solid $dull-text-color;
			display: flex;
			justify-content: center;
			align-items: center;
			min-width: 150px;
			background-color: #B6F2EF;
			transform: translateX(-100%);
			img {
				width: 65px;
			}
		}

		&--tip {
			display: flex;
			justify-content: center;
			align-items: center;

			font-size: 40px;
			font-weight: bold;

			transition: opacity .3s ease-out;
			position: absolute;
			top: -100%;
			left: 50%;
			transform: translateX(-50%);
			background-color: $main-color;
			width: 140%;
			height: 80px;
			border-radius: 10px;
			animation: bounce .5s 6 alternate ease-out;
		}

		&--tip::after {
			content: '';
			position: absolute;
			bottom: 1px;
			left: 50%;
			transform: translate(-50%, 100%);

			background-color: $main-color;
			width: 40px;
			height: 30px;
			clip-path: polygon(0 0, 100% 0, 50% 100%);
		}
	}

	&__submit {
		font-family: 'Raleway', sans-serif;
		margin-top: 90px;
		margin-bottom: 100px;
		position: relative;
		width: 800px;
		min-height: 110px;
		font-size: 52px;
		background-color: $compl-color;
		border: 3px solid $text-color;
		font-weight: 600;
		box-shadow: $box-shadow;
	}
}

@keyframes bounce {
	0% {
		transform: translate(-50%, -50%);
	}

	100% {
		transform: translate(-50%, 0%);

	}
}

</style>
