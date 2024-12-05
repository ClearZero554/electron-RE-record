<template>
  <el-dialog
    append-to-body
    width="40%"
    :visible.sync="visible"
  >
   <div class="header">
      <div>编辑配置</div>
      <iconpark-icon
        name="close-small"
        class="close-small"
        @click="visible = false"
      ></iconpark-icon>
    </div>
    <div class="main">
      <div>上传时间:{{ createTime }}</div>
      <div>文件大小:{{ size }}MB</div>

      <el-input size="mini" v-model="name" class="input">
        <el-button slot="append" size="mini" @click.native="handleRename"
          >重命名</el-button
        >
      </el-input>
      <el-button size="mini" class="button" @click="handleTop">{{
        isTop == 1 ? '取消置顶' : '置顶'
      }}</el-button>
      <el-button size="mini" class="button" @click="handleUpload"
        >下载</el-button
      >
      <el-button size="mini" class="button" @click="handleDel">删除</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { top, rename, del, untop } from '@/api/user';
import ipcUtil from '@/ipc';
import feedback from '@/utils/feedback';

export default {
  data() {
    return {
      visible: false,
      id: null,
      name: null,
      isTop: null,
      createTime: null,
      setting: null,
      size: null,
    };
  },
  methods: {
    handleRename() {
      rename({ id: this.id, name: this.name }).then((res) => {
        if (res.data.code == 200) {
          this.visible = false;
          this.$parent.getLocalProfiles();
        }
      });
    },
    handleTop() {
      if (this.isTop) {
        untop({ id: this.id }).then((res) => {
          if (res.data.code == 200) {
            this.visible = false;
            this.$parent.getLocalProfiles();
          }
        });
      } else {
        top({ id: this.id }).then((res) => {
          if (res.data.code == 200) {
            this.visible = false;
            this.$parent.getLocalProfiles();
          }
        });
      }
    },
    handleDel() {
      del({ id: this.id }).then((res) => {
        if (res.data.code == 200) {
          this.visible = false;
          this.$parent.getLocalProfiles();
        }
      });
    },
    async handleUpload() {
      const {allocationPath}=ipcUtil.getStore('setting')
      let basePath =allocationPath+"\\" + this.name + '.zip';
      this.visible = false;
      const res = await ipcUtil.uploadChineseFile(
        this.setting,
        basePath,
        (data) => {
          // 进度条逻辑
          this.$bus.$emit('progress',data)
        }
      );
      this.$bus.$emit('success',res)
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__header {
  display: none;
}
::v-deep .el-dialog {
  background: rgba($color: #000000, $alpha: 0) !important;
}
::v-deep .el-dialog__body {
  height: 230px;
  width: 400px;
 
  border-radius: 9px;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
  .close-small {
    font-size: 20px;
    cursor: pointer;
    position: absolute;
    right: 10px;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    box-sizing: border-box;
    width: 100%;
    height: 32px;
    font-weight: 700;
  }
}
.main {
  padding: 20px;
}

.input {
  border: 2px solid #969696;
  border-radius: 5px;
  margin-bottom: 20px;
  margin-top: 20px;
}

.button {
  width: 80px;
  border: 2px solid #969696;
  border-radius: 5px;
}
</style>
