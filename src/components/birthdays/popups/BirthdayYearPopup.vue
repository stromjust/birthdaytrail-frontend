<template>
  <div id="yearPopup" ref="popup">
    <div class="popup">
      <div v-for="year in range" @click="emit(now - year + 1)"class="popup__year">
        <span class="popup__year--text">{{ now - year + 1 }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { birthdayPopup } from '../../../mixins/birthdayPopupMixin';

export default {
  data: () => ({
    now: new Date().getFullYear(),
    range: 100,
  }),
  mixins: [birthdayPopup],
  methods: {
    emit(year) {
      this.$emit('yearSelected', year);
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./src/styles/_variables.scss";

#yearPopup {

  transition: transform .15s ease-out, opacity .15s ease-out;
  opacity: 0.5;
  transform: translateY(30%);

  position: absolute;
  top: 20%;
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
  height: 800px;
  width: 850px;
  background-color: $bg-color;
  box-shadow: $dp6;
  border: 5px solid $compl-color;
  border-radius: 10px;
  overflow-y: scroll;

  &__year {
    margin: 30px 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 150px;
    height: 100px;
    background-color: $compl-color;
    box-shadow: $box-shadow;

    &--text {
      font-size: 60px;
      font-weight: 400;
    }
  }
}

</style>
