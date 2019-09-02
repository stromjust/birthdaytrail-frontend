import Home from './components/birthdays/Home.vue'
import Login from './components/auth/Login.vue'
import Signup from './components/auth/Signup.vue'
import BirthdayAdd from './components/birthdays/BirthdayAdd.vue'
import BirthdayDetails from './components/birthdays/BirthdayDetails.vue'
import OfflineDefault from './components/offline/OfflineDefault.vue'


export const routes = [
		{ path: '/', component: Home },
		{ path: '/login', component: Login, name: 'login'},
		{ path: '/signup', component: Signup, name: 'signup'},
		{ path: '/addbirthday', component: BirthdayAdd, name: 'addbirthday'},
		{ path: '/birthday/:id', component: BirthdayDetails, name: 'birthdayDetails'},
		{ path: '/offline', component: OfflineDefault, name: 'offline' }
];
