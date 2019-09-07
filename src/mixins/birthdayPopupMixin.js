export const birthdayPopup = {
  data: () => ({
    rootElement: document.createElement('div')
  }),
  props: ['button'],
  computed: {
    clickedElement() {
      return this.$store.state.clickedElement;
    }
  },
  watch: {
    clickedElement(el) {
      if(!this.rootElement.contains(el) &&
         !this.button.contains(el) &&
          this.button != el) {
        this.emit(undefined);
      }
    }
  },
  mounted() {
    this.rootElement = this.$refs.popup;
    setTimeout(() => {
      this.$refs.popup.style.opacity = "1";
      this.$refs.popup.style.transform = "translateY(0%)";
    });
  }
}
