<template>
  <i
    class="iconfont"
    :class="fontName"
    v-on='$listeners'
    v-bind='$attrs'
    :style="color != '' && { color: color }"
  ></i>
</template>

<script>
export default {
  name: 'icon',
  props: {
    fontName: {
      default: '',
    },
    color: {
      default: '',
    },
    shop: {
      default: false,
    },
    clickStop: {
      default: false,
    },
  },
  methods: {
    callBack(e) {
      if (this.clickStop) {
        e.stopPropagation()
      }
      this.$emit('click',e);
    },
    /* mouseover(e) {
      this.$emit('mouseover', e);
    },
    mouseout(e) {
      this.$emit('mouseout', e);
    }, */
  },
};
</script>

<style lang="scss" scoped>
i {
  font-size: 16px;
}
</style>
