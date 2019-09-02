import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export var store = new Vuex.Store({
	state: {
		showLogo: true,
		clickedElement: document.createElement('div'),
		token: null,
		birthdays: null,
		notificationMessage: '',
		notificationIcon: ''
	},
	getters: {
		birthdaysExist: (state) => {
			if(state.birthdays &&
			 	 state.birthdays.length > 0) return true;
			else return false;
		},
		tokenExist: (state) => {
			if(state.token) return true;
			else return false;
		},
		getBirthdays: (state) => {
			return state.birthdays;
		},
		getToken: (state) => {
			return state.token;
		},
		getNotification: (state) => {
			if(state.notificationMessage &&
				 state.notificationIcon) {
			 	return {
					message: state.notificationMessage,
					icon: state.notificationIcon
				};
			}
			else {
				return null;
			}
		}
	},
	mutations: {
		setBirthdays: (state, payload) => {
			if(payload) payload.sort(compareDates);
			state.birthdays = payload;
		},
		setToken: (state, payload) => {
			state.token = payload;
		},
		setNotification: (state, payload) => {
			state.notificationMessage = payload.message;
			state.notificationIcon = payload.icon;
		}
	},
	actions: {
		setNotification({commit}, payload) {
			commit('setNotification', payload);
		},
		setTokenAndExp({commit}, payload) {
			window.localStorage['token'] = payload.token;
			window.localStorage['expiration'] = payload.expirationDate;
			commit('setToken', payload.token);
		},
		parseAndSetBirthdays({commit}, payload) {
			for(let i = 0; i < payload.length; i++) {
				payload[i].dob = new Date(payload[i].dob);
			}
			commit('setBirthdays', payload);
		},
		setBirthdays({commit}, payload) {
			commit('setBirthdays', payload);
		},
		setUpToken({commit, dispatch}) {
			if(window.localStorage['expiration'] && window.localStorage['token']) {
				const token = window.localStorage['token'];
				const expiration = new Date(window.localStorage['expiration']);
				const now = new Date();
				if(expiration > now) {
					commit('setToken', token);
					const config = {
						headers: {
							Authorization: 'Bearer ' + token
						}
					};
					axios.get('http://localhost:8081/birthdays', config)
								.then(res => {
									dispatch('parseAndSetBirthdays', res.data.data.birthdays);
								})
								.catch(err => {
									console.log(err);
								});
				}
			}
		},
		logOut({commit}) {
			window.localStorage['token'] = null;
			window.localStorage['expiration'] = null;
			commit('setToken', null);
		},
		hideKeyboard({commit}, payload) {
				payload.target.blur();
		}
	}
});


function getDays(a) {
	const DAY = 60000 * 60 * 24;
	const now = new Date();

	const cutoffEnd = new Date(now.getFullYear(), 11, 32);
	const cutoffStart = new Date(now.getFullYear(), 0, 0);
	const cutoffStartNext = new Date(now.getFullYear()+1, 0, 0);

	const date = new Date(now.getFullYear(), a.getMonth(), a.getDate());

	if( ((date - now) / DAY) < 0 ) {
			var newDate = new Date(now.getFullYear()+1, date.getMonth(), date.getDate());
			var thisYearDays = (cutoffEnd - now) / DAY;
			var nextYearDays = (newDate - cutoffStartNext) / DAY;
			return thisYearDays + nextYearDays;
	} else {
			return (date - now) / DAY;
	}
};

function compareDates(a, b) {
	if( getDays(a.dob) > getDays(b.dob) ) return 1;
	else return -1;
};
