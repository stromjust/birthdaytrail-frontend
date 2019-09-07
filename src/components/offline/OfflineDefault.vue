<template>
  <div id="offline">
    <div class="main">
      <img class="main__img" src="../../assets/nointernet.svg" alt="No internet icon">
      <span class="main__header">No internet connection</span>
      <span class="main__sub">Resource you're looking for</span>
      <span class="main__sub">isn't cached or doesnt exist</span>
      <div @click="goHome" class="main__button">home</div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    goHome() {
      this.$router.push({path: '/'});
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./src/styles/_variables.scss";

#offline {
  display: flex;
  justify-content: center;
}

.main {
  margin-top: 100px;
  display: flex;
  flex-flow: column;
  align-items: center;

  &__img {
    width: 500px;
    opacity: .8;
  }

  &__header {
    margin: 50px 0;
    font-size: 70px;
    letter-spacing: 4px;
  }

  &__sub {
    font-size: 35px;
    font-weight: 500;
    text-align: center;
    width: 700px;
  }

  &__button {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 100px 0;
    font-size: 50px;
    min-height: 120px;
    width: 100%;
    background-color: $compl-color;
    border: 3px solid $text-color;
    box-shadow: $box-shadow;
    font-weight: 600;
    color: $text-color;
  }
}

</style>
