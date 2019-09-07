<template>
  <div id="app" ref="app">
    <div class="form">
      <img class="form__decor" src="../../assets/decor.svg" alt="Background decoration">
      <img class="form__title" src="../../assets/logo.svg" alt="Birthday Trail logo">
      <span class="form__desc">Plan, manage and most importantly - don't forget <strong>birthdays</strong>!</span>

      <div class="form__input">
        <div class="form__input--text">username</div>
        <input class="form__input--value" type="text"
               v-model:value="name" placeholder=""
               @keyup.enter="$store.dispatch('hideKeyboard', $event)">
      </div>

      <div class="form__input">
        <div class="form__input--text">password</div>
        <input class="form__input--value" type="password"
               v-model:value="password" placeholder=""
               @keyup.enter="$store.dispatch('hideKeyboard', $event)">
      </div>

      <button class="form__button" type="submit" @click="login">login</button>

      <router-link tag="div" class="form__link" :to="{ name: 'signup'}">sign up</router-link>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    data: () => ({
      name: '',
      password: '',
    }),
    methods: {
      resetForm() {
        this.name = '';
        this.password = '';
      },
      login() {
        if( this.password && this.name ) {
          const data = {
            name: this.name,
            password: this.password
          };
          axios.post('http://localhost:8081/login', data)
              .then(res => {
                if(res.status == 200) {
                  const payload = {
                    token: res.data.token,
                    expirationDate: res.data.data.expirationDate
                  }
                  this.$store.dispatch('setTokenAndExp', payload);
                  this.$store.dispatch('parseAndSetBirthdays', res.data.data.birthdays );
                }
                this.$router.push({ path: '/' });
              })
              .catch(err => {
                console.log(err);
                this.resetForm();
              });
        }
      }
    },
    mounted() {
      this.$store.state.showLogo = false;
      this.$store.state.token = null;
      this.$store.dispatch('setBirthdays', null);
      setTimeout(() => {
        this.$refs.app.style.opacity = "1";
        this.$refs.app.style.transform = "scale(1)";
      }, 1);
    }
  }
</script>

<style lang="scss" scoped>
@import "./src/styles/_variables.scss";


#app {
  height: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  transition: all .15s ease-out;
  opacity: 0;
  transform: scale(.8);
}

.form {
  margin-top: 10%;
  display: flex;
  flex-flow: column;
  width: 80%;

  &__decor {
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-30%, -50%) rotateZ(10deg);
    width: 800px;
    opacity: .15;
  }

  &__title {
    min-height: 206px;
    width: 750px;
  }

  &__desc {
    font-size: 50px;

    margin: 70px 0;
    line-height: 75px;
  }

  &__input {
    position: relative;
    display: flex;
    margin: 30px 0;
    box-shadow: $box-shadow;

    &--text {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 300px;
      font-size: 45px;
      color: $text-color;
      font-weight: 600;
      background-color: $compl-color;
      border-right: 3px solid $dull-text-color;
    }

    &--value {
      padding-left: 30px;
      border: none;
      font-size: 52px;
      width: 470px;
      height: 100px;
      background-color: $compl-color;
    }
  }

  &__button {
    font-family: 'Raleway', sans-serif;
    margin-top: 100px;
    font-size: 50px;
    min-height: 120px;
    width: auto;
    background-color: $compl-color;
    border: 3px solid $text-color;
    box-shadow: $box-shadow;
    font-weight: 600;
    color: $text-color;
  }

  &__link {
    margin: 150px 0;
    align-self: center;
    font-size: 50px;
    font-weight: bold;
    text-decoration: underline;
  }

}

</style>
