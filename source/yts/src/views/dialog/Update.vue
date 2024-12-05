<template>
  <el-dialog
    append-to-body
    width="50%"
    title="更新"
    :visible.sync="visible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <div class="header">
      <div class="info">
        更新
      </div>
      <iconpark-icon
        name="close-small"
        class="close-small"
        @click="visible = false"
      ></iconpark-icon>
    </div>
    <div class="panel">
      <!-- <div>1.更新了实时客服未读消息</div>
            <div>2.适配了Obs主题</div>
            <div>3.修改了客服部分问题(可回车发送)</div> -->
      <div v-for="item in logs" :key="item">{{ item }}</div>
      <p>正在下载新版本 {{ version }}</p>
      <p>网速 {{ bytes }}m/s</p>
      <div style="color: #409eff" @click="goOfficialWebsite">
        https://yuantiaoshi.com
      </div>
      <div style="color: #409eff" @click="handleClickChange">
        自动更新卡住,点这里
      </div>

      <el-progress
        :text-inside="true"
        :stroke-width="26"
        :percentage="progress"
      ></el-progress>
    </div>
  </el-dialog>
</template>

<script>
import { updateLogs } from "@/api/index";
import { quit, update } from "@/api/login";
import ipcUtil from "@/ipc";
import feedback from "@/utils/feedback";
export default {
  data() {
    return {
      visible: false,
      version: false,
      progress: 0,
      logs: "",
      bytes: 0,
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      const res = await updateLogs(3);
      if (res.data?.code == 200) {
        this.logs = res.data.data.dictRemark.split("\n");
      }
    },
    goOfficialWebsite() {
      ipcUtil.openUrl("https://yuantiaoshi.com");
    },
    // 检测更新
    async handleClickChange() {
      const res = await update();
      if (res.data.data.dictType !== this.version) {
        feedback.msgSuccess("正在下载最新安装包,请稍等");
        let basePath = (await ipcUtil.getSystemDisk()) + "源调试.exe";
        ipcUtil.updateVersion(
          res.data.data.dictRemark,
          basePath,
          this.downloadFileCallback
        );
      } else {
        feedback.msgWarning("已是最新版本");
      }
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-dialog__header {
  display: none;
}
::v-deep .el-dialog {
  background: rgba($color: #000000, $alpha: 0) !important;
}
::v-deep .el-dialog__body {
  // height: 250px;
  width: 500px;
  border-radius: 9px;
  padding: 10px;
  box-sizing: border-box;
  .tip {
    font-size: 9px;
    margin-left: 12px;
    margin-top: 14px;
    // color: #000000;
  }
  .header {
    display: flex;
    justify-content: space-between;
    position: relative;
    font-size: 18px;
    margin-bottom: 18px;
    .close-small {
      font-size: 40px;
      cursor: pointer;
      position: absolute;
      right: 0px;
    }
  }
}
</style>