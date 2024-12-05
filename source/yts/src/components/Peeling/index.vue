<template>
  <el-dialog
    :append-to-body="true"
    width="50%"
    title="换肤"
    @open="open"
    @close="close"
    :visible.sync="visible"
  >
    <div class="peeling">
      <!-- 经典 -->
      <div>
        <div
          class="classical"
          @click="changePeeling('theme')"
          :class="peeling === 'theme' ? 'action' : ''"
        ></div>
        <div>经典</div>
      </div>
      <!-- 黑 -->
      <div>
        <div
          class="black"
          @click="changePeeling('night')"
          :class="peeling === 'night' ? 'action' : ''"
        ></div>
        <div>黑夜</div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "peeling", //换肤
  data() {
    return {
      visible: false,
      peeling: "theme", //theme为经典 night为黑夜
    };
  },

  methods: {
    open() {
     let css= localStorage.getItem("css")
     this.peeling=css?css:"theme"
    },
    // 关闭
    close() {

    },
    changePeeling(type) {
      this.peeling = type;
      localStorage.setItem('css',type)
      const html = document.querySelector("html");
      html.setAttribute("data-v-css", type);
      this.$emit("changePeeling",type)
    },
  },
};
</script>

<style lang="scss" scoped>
.peeling {
  display: flex;
  justify-content: space-around;
  text-align: center;
}
.classical {
  width: 150px;
  height: 80px;
  border-radius: 16px;
  border: 3px solid #ccc;
  cursor: pointer;
  margin-bottom: 8px;
  background: #fff;
}
.black {
  width: 150px;
  height: 80px;
  border-radius: 16px;
  border: 3px solid #ccc;
  background: #191b26;
  cursor: pointer;
  margin-bottom: 8px;
}
.action {
  border: 3px solid #a0cfff;
}
</style>