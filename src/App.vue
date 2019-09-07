<template>
  <div id="global-app" @click="clicked">
    <navbar></navbar>
    <router-view></router-view>
    <notification v-if="showNotification" :message="message" :icon="icon"></notification>
  </div>
</template>

<script>
import Header from './components/header/Header.vue'
import Notification from './components/notification/Notification.vue'

export default {
  data: () => ({
    showNotification: false,
    message: '',
    icon: '',
    myTimeout: null,
  }),
  methods: {
    clicked(e) {
      this.$store.state.clickedElement = e.target;
    },
    closeNotificationIn(miliSeconds) {
      this.myTimeout = setTimeout(() => {
        this.showNotification = false;
        this.message = '';
        this.icon = ''
        this.$store.commit('setNotification', {message: '', icon: ''});
      }, miliSeconds);
    }
  },
  computed: {
    notification() {
      return this.$store.getters.getNotification;
    }
  },
  watch: {
    notification(notif) {
      if(notif) {
        clearTimeout(this.myTimeout);
        this.message = notif.message
        this.icon = notif.icon;
        this.showNotification = true;
        this.closeNotificationIn(2000);
      }
    }
  },
  components: {
    'navbar': Header,
    'notification': Notification
  },
  beforeCreate() {
    this.$store.dispatch('setUpToken');
  }
}
</script>

<style lang="scss">
@import "./src/styles/_variables.scss";

html,body {
  overscroll-behavior: none;
  margin: 0;
  width: 100%;
  overflow-x: hidden;
  background-color: $bg-color;
  box-sizing: border-box;
  font-family: 'Raleway', sans-serif;
}

#global-app {
  padding-bottom: auto;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

</style>
