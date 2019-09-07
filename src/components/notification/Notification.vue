<template>
  <div id="notification" ref="notification">
    <div id="message" ref="message">
      <img :src="iconSource" alt="info icon">
      {{ message }}
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    successIcon: '/src/assets/notif_success.svg',
    infoIcon: '/src/assets/notif_info.svg'
  }),
  props: ['message', 'icon'],
  computed: {
    iconSource() {
      if(this.icon === 'success') return this.successIcon;
      else if(this.icon === 'info') return this.infoIcon;
      else return '';
    }
  },
  watch: {
    message() {
      this.$refs.message.style.visibility = "hidden";
      this.$refs.message.style.opacity = ".4";
      this.$refs.message.style.transform = "translateY(-50%)";
      setTimeout(() => {
        this.$refs.message.style.visibility = "visible";
        this.$refs.message.style.opacity = "1";
        this.$refs.message.style.transform = "translateY(0%)";
      }, 200);
    }
  },
  mounted() {
    setTimeout(() => {
      this.$refs.notification.style.opacity = "1";
      this.$refs.notification.style.transform = "translate(-50%, 0%)";
    });
  }
}
</script>

<style lang="scss" scoped>
@import "./src/styles/_variables.scss";

#notification {
  will-change: transform, opacity;
  transition: transform .2s ease-out, opacity .2s ease-out;
  opacity: .4;
  transform: translate(-50%, -30%);

  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;

  color: $text-color;
  font-size: 40px;
  font-weight: bold;
  position: fixed;
  left: 50%;
  top: 50px;

  width: auto;
  max-width: 100%;
  padding: 30px 50px;
  letter-spacing: 2px;
  background-color: rgba($bg-color, .8);
  box-shadow: $dp2;

}

#message {
  display: flex;
  align-items: center;
  will-change: transform;
  white-space: nowrap;
  pointer-events: none;
  backface-visibility: hidden;
  transition: transform .15s ease-out;
  img {
    margin-right: 15px;
    transform: translateY(5%);
  }
}

</style>
