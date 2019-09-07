<template>
  <div id="monthPopup" ref="popup">
    <div class="popup">
      <div v-for="(month, i) in monthShort" @click="emit(i)"class="popup__month">
        <span class="popup__month--text">{{ month }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { birthdayPopup } from '../../../mixins/birthdayPopupMixin';

export default {
  data: () => ({
    monthShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    monthLong: ['January', 'February', 'March', 'April',
                'May', 'June', 'July', 'August',
                'September', 'October', 'November', 'December'],
  }),
  mixins: [birthdayPopup],
  methods: {
    emit(i) {
      this.$emit('monthSelected', this.monthLong[i]);
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./src/styles/_variables.scss";

#monthPopup {
  transition: transform .15s ease-out, opacity .15s ease-out;
  opacity: 0.5;
  transform: translateY(30%);

  position: absolute;
  top: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  height: 700px;
  width: 850px;
  background-color: $bg-color;
  box-shadow: $dp6;
  border: 5px solid $compl-color;
  border-radius: 10px;

  &__month {
    margin: 0 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 150px;
    height: 150px;
    background-color: $compl-color;
    box-shadow: $box-shadow;

    &--text {
      font-size: 60px;
      font-weight: 500;
    }
  }
}

</style>
