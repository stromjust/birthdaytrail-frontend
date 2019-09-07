<template>
  <div ref="root" class="menu">

    <div :class="{'menu__toggle': true, 'menu-icon-show': showMenu}" @click="toggleMenu">
      <span id="firstspan" class="menu__toggle--span"></span>
        <span id="middlespan" class="menu__toggle--span"></span>
      <span id="lastspan" class="menu__toggle--span"></span>
    </div>

    <div :class="{ 'menu__page': true, 'menu-show': showMenu }">
      <img class="menu__page--decor" src="../../assets/decor.svg" alt="Menu background decoration">
      <ul>
        <span v-if="!$store.getters.tokenExist">
          <router-link to="/login" tag='li' @click.native="hideMenu">login</router-link>
          <router-link to="/signup" tag='li' @click.native="hideMenu">sign up</router-link>
        </span>
        <span v-else>
          <router-link to="/login" tag='li' @click.native="hideMenu">change user</router-link>
          <router-link to="/" tag='li' @click.native="logOut">logout</router-link>
          <router-link to="/addbirthday" tag='li' @click.native="hideMenu">add birthday</router-link>
          <li v-if="showNotificationButton" @click="promptNotifications">notifications</li>
        </span>
      </ul>
    </div>

  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    data: () => ({
      showMenu: false,
      menuElement: document.createElement('div')
    }),
    computed: {
      clickedElement() {
        return this.$store.state.clickedElement;
      },
      showNotificationButton() {
        if(Notification && Notification.permission === 'default') return true;
        else false;
      },
    },
    watch: {
      clickedElement(el) {
        if(this.showMenu) {
          if(!this.menuElement.contains(el)) this.hideMenu();
        }
      }
    },
    methods: {
      toggleMenu() {
        this.showMenu = !this.showMenu;
      },
      hideMenu() {
        this.showMenu = false;
      },
      logOut() {
        this.hideMenu();
        this.$store.dispatch('logOut');
        this.$store.dispatch('setNotification', {message: 'logged out', icon: 'success'});
      },
      promptNotifications() {
        this.hideMenu();

        if( !'Notification' in window || !'serviceWorker' in navigator) {
          console.log('Notifications/Service Workers not supported');
          return;
        }

        var worker;
        Notification.requestPermission((res) => {
          if(res == 'granted') {
            navigator.serviceWorker.ready
              .then(serviceWorker => {
                worker = serviceWorker;
                return serviceWorker.pushManager.getSubscription();
              })
              .then(subscription => {
                if(!subscription) {
                  const vapidPK = 'BLHWNB-PfP_Md94GpQ_d2Ek1-5AqUH4v-ISkbrZTNls1pxXUi1fyX7NMPR8KQeI-Hc3PUMY40AazLYTWjc0xWSA';
                  const vapidPKarray = urlBase64ToUint8Array(vapidPK);
                  return worker.pushManager.subscribe({
                    userVisibleOnly:  true,
                    applicationServerKey: vapidPKarray
                  });
                }
                else {
                  throw('notification already enabled');
                }
              })
              .then(subscription => {
                const data = {
                  subscription,
                };
                const config = {
                  headers: {
                    Authorization: 'Bearer ' + this.$store.state.token
                  }
                };
                axios.post('http://localhost:8081/subscribe', data, config)
                  .then(() => {
                    this.$store.dispatch('setNotification', {message: 'notifications enabled', icon: 'success'});
                  });
              })
              .catch(err => {
                console.log(err);
              })
          }
        });
      }
    },
    mounted() {
      this.menuElement = this.$refs.root;
    }
  }
</script>

<style lang="scss" scoped>
@import "./src/styles/_variables.scss";


.menu {
  margin-left: auto;
  margin-right: 50px;
  margin-top: 30px;

  &__toggle {
    display: flex;
    flex-flow: column;
    justify-content: space-around;
    align-items: center;
    position: relative;
    height: 80px;
    z-index: 6;
    &--span {
      display: block;
      width: 100px;
      height: 10px;
      background-color: $text-color;
      border-radius: 5px;
    }
  }

  &__page {
    white-space: nowrap;
    overflow: hidden;
    background-color: $main-color;
    position: absolute;
    padding-top: 130px;
    border-left: 5px solid $text-color;
    border-bottom: 5px solid $text-color;
    z-index: 3;
    top: 0;
    right: 0;
    width: 400px;
    height: 100%;
    transform: translateX(100%);
    box-shadow: $dp6;
    transition: transform .15s ease-out;
    border-bottom-left-radius: 20px;
    will-change: transform;

    &--decor {
      z-index: 4;
      opacity: .2;
      top: 0;
      right: 0;
      transform: translate(30%, -20%);
      width: 600px;
      position: absolute;
    }

    li {
      z-index: 5;
      font-size: 52px;
      margin: 70px 20px 0 20px;
      min-height: 130px;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: $button-weight;
      color: $text-color;
      background-color: $bg-color;
    }

    ul {
      padding: 0;
      list-style-type: none
    }
  }
}

.menu-show {
  transform: translateX(0%);
}

.menu-icon-show {
  .menu__toggle--span {
    background-color: $bg-color;
  }
  #firstspan {
    transform: translateY(265%) rotate(45deg);
  }
  #middlespan {
    transform: scale(0);
  }
  #lastspan {
    transform: translateY(-265%) rotate(-45deg);
  }
}

</style>
