<template>
  <div id="dayPopup" ref="popup">
    <div class="popup">
      <div v-for="day in days" @click="emit(day)"class="popup__day">
        <span class="popup__day--text">{{ day }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { birthdayPopup } from '../../../mixins/birthdayPopupMixin';

export default {
  mixins: [birthdayPopup],
  props: ['days'],
  methods: {
    emit(day) {
      this.$emit('daySelected', day);
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./src/styles/_variables.scss";

#dayPopup {
  transition: transform .15s ease-out, opacity .15s ease-out;
  opacity: 0.5;
  transform: translateY(30%);

  position: absolute;
  top: 15%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup {
  padding-left: 30px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  height: 1050px;
  width: 850px;
  background-color: $bg-color;
  box-shadow: $dp6;
  border: 5px solid $compl-color;
  border-radius: 10px;

  &__day {
    margin: 0 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 100px;
    background-color: $compl-color;
    box-shadow: $box-shadow;

    &--text {
      font-size: 60px;
      font-weight: 500;
    }
  }
}

</style>
