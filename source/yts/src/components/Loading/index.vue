<template>
  <div class="loading" @click="clickLoading">
    <img src="@/assets/loading.gif" alt="" />
    <div class="text">飞速加载中，请稍后...</div>
  </div>
</template>

<script>
export default {
  props: ["isLoading"],
  methods:{
    clickLoading(){
      this.$parent.isLoading=false
    }
  }
};
</script>

<style lang='scss' scoped>
.loading {
  width: 960px;
  height: 632px;
  background: rgba($color: #000000, $alpha: 0.3);
  position: fixed;
  top: 37px;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(3px);
  img {
    zoom: 0.2;
  }
  .text {
    color: #fff;
    font-weight: 700;
    position: absolute;
    top: 420px;
  }
}
</style>