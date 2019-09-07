<template>
  <div id="app" ref="app">
    <div class="control">
      <span class="control__text">Upcoming birthdays</span>
      <router-link tag="div" class="control__button" :to="{ name: 'addbirthday'}">add</router-link>
      <img class="control__decor" src="../../assets/decor.svg" alt="Background decor">
    </div>
    <div class="birthdays">
      <div v-if="$store.getters.tokenExist && ready" >
        <div v-if="$store.getters.birthdaysExist" class="birthdays__list">
          <birthday-item v-for="birthday in $store.state.birthdays" :birthday="birthday" :key="birthday._id"></birthday-item>
        </div>

        <div v-else class="birthdays__empty">
          <span class="birthdays__empty--text">You have no birthdays saved</span>
          <img class="birthdays__empty--icon" src="../../assets/tumbleweed.svg" alt="tumbleweed icon">
        </div>

      </div>

      <div v-else class="birthdays__not-logged">
        <span class="birthdays__not-logged--text">login to save birthdays</span>
        <div class="birthdays__not-logged--button" @click="toLogin">login</div>
        <span class="birthdays__not-logged--text">or</span>
        <div class="birthdays__not-logged--button" @click="toSignup">sign up</div>
      </div>

    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import BirthdayItem from './BirthdayItem.vue'

  export default {
    data: () => ({
      ready: false
    }),
    methods: {
      toLogin() {
        this.$router.push({path: '/login'});
      },
      toSignup() {
        this.$router.push({path: '/signup'});
      }
    },
    components: {
      'birthday-item': BirthdayItem,
    },
    mounted() {
      this.$store.state.showLogo = true;
      this.ready = true;
      setTimeout(() => {
        this.$refs.app.style.opacity = "1";
        this.$refs.app.style.transform = "translateX(0%)";
      }, 1)
    }
}

</script>

<style lang="scss" scoped>
@import "./src/styles/_variables.scss";

#app {
  position: relative;
  will-change: transform;
  overflow-x: hidden;
  transition: all .15s ease-out;
  opacity: 0;
  transform: translateX(-30%);
}

.control {
  display: flex;
  align-items: center;
  border-bottom: 3px solid $dull-text-color;
  margin-top: 150px;
  margin-bottom: 100px;
  padding: 0 50px 50px 50px;

  &__text {
    color: $text-color;
    font-size: 50px;
    font-weight: bold;
  }

  &__button {
    font-weight: $button-weight;
    position: relative;
    margin-left: auto;
    background-color: $compl-color;
    font-size: $button-text-size;
    padding: 10px 60px;
    background-color: $compl-color;
    border: 3px solid $text-color;
    box-shadow: $box-shadow;
    z-index: 2;
  }

  &__button:before {
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

  &__decor {
    position: absolute;
    right: 0;
    transform: translate(45%, 13%) rotateZ(10deg);
    width: 750px;
    opacity: .15;
    z-index: 1;
  }
}

.birthdays {
  z-index: 2;
  font-size: 60px;

  &__list {
    align-items: center;
    display: flex;
    flex-flow: column;
    margin: 50px 0;
  }

  &__empty {
    margin-top: 200px;
    display: flex;
    flex-flow: column;
    align-items: center;
    &--text {
      margin-bottom: 100px;
    }

    &--icon {
      width: 800px;
    }
  }

  &__not-logged {
    margin-top: 200px;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;

    &--text {
    }

    &--button {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 100px 0;
      font-size: 50px;
      min-height: 120px;
      width: 784px;
      background-color: $compl-color;
      border: 3px solid $text-color;
      box-shadow: $box-shadow;
      font-weight: 600;
      color: $text-color;
    }
  }
}

</style>
