<template>
  <el-dialog
    append-to-body
    title="将软件分享给朋友"
    :visible.sync="visible"
    custom-class="share"
    :show-close="false"
    @open="handleOpen"
  >
    <template #title>
      <div class="title">
        <div>将软件分享给朋友</div>
        <div class="close" @click="visible = false"></div>
      </div>
    </template>
    <div class="info">
      <span class="name">源调试</span>
      <span class="href">https://yuantiaoshi.com</span>
    </div>
    <!-- <div class="invite">
            <span class="label">邀请码：</span>
            <span class="code">{{ code }}</span>
        </div> -->
    <div class="copy" v-clipboard:copy="copy" v-clipboard:success="handleCopy">
      一键复制
    </div>
  </el-dialog>
</template>

<script>
import ipcUtil from "@/ipc";
import feedback from "@/utils/feedback";

export default {
  data() {
    return {
      visible: false,
      code: "",
      copy: "",
    };
  },
  methods: {
    handleCopy() {
      feedback.msgSuccess("复制成功");
    },
    handleOpen() {
      let info = this.$root.userInfo
      this.code = info.sn;
      this.copy = "https://yuantiaoshi.com";
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .share {
  width: 531px;
  height: 172px;
  font-family: Adobe Heiti Std;
  margin-top: 208px !important;
  .el-dialog__header {
    padding: 0;
  }
  .title {
    padding: 0 12px 0 24px;
    display: flex;
    justify-content: space-between;
    &:nth-child(1) {
      font-size: 16px;
      font-weight: normal;
      color: var(--fc) !important;
      line-height: 37px;
    }
    .close {
      width: 38px;
      height: 37px;
      background-image: url("@/assets/img/x.png");
      background-size: 100% 100%;
    }
  }
  .el-dialog__body {
    padding: 5px 50px 0 58px;
    .info {
      font-size: 24px;
      font-family: Adobe Heiti Std;
      font-weight: normal;
      color: var(--fc) !important;
    }
    .copy {
      width: 164px;
      height: 49px;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 2px solid #03a6fa;
      border-radius: 12px;
      font-size: 31px;
      font-family: Adobe Heiti Std;
      font-weight: normal;
      color: var(--fc) !important;
      cursor: pointer;
      position: absolute;
      right: 32px;
      bottom: 6px;
    }
  }
}
</style>