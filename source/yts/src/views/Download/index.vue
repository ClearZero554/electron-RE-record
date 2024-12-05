<template>
  <div class="uploadDialog">
    <!-- <div class="icon" @click="changeShow">
      <Icon fontName="icon-guanbi"></Icon>
    </div> -->
    <div class="header">
      <div class="left">
        <img src="@/assets/logo.png" alt="" />
        <span>任务队列</span>
      </div>
      <div @click="close">
        <span class="button"><i class="el-icon-close"></i></span>
      </div>
    </div>
    <div
      class="uploadDialogItem"
      v-for="item in uploadDialogList"
      :key="item.uid"
    >
      <div class="uploadInfo">
        <div>
          <div class="name">{{ item.name }}</div>
          <div class="size" v-if="!item.isComplete">
            {{ item.downloadSize + "/" + item.totalSize + "Mb" }}
          </div>
          <div class="size" v-else>
            {{ item.filePath ? "下载完成" : "上传完成" }}
          </div>
        </div>
        <div @click="openFile(item)" v-if="item.filePath">
          <iconpark-icon name="folder-open" class="folder-open"></iconpark-icon>
        </div>
      </div>
      <el-progress
        :text-inside="true"
        :percentage="item.percentage"
        :color="item.isComplete ? '#13CE66' : '#20A0FF'"
      ></el-progress>
    </div>
  </div>
</template>

<script>
import ipcUtil from "@/ipc";
export default {
  name: "uploadDialog",
  data() {
    return {
      uploadDialogList: [], //上传进度弹框
    };
  },
  created() {
    window.ipc.on("downloadProgress", (event, file) => {
      let findFile = this.uploadDialogList.find((item) => item.uid == file.uid);
      if (findFile) {
        findFile.percentage = Math.round(file.percentage);
        findFile.downloadSize = Math.round(file.downloadSize);
      } else {
        // 说明没创建
        this.uploadDialogList.push({
          percentage: 0,
          isComplete: false,
          ...file,
        });
        // 每次有上传任务就开启
        window.ipc.send("downloadSetSize", {
          num: this.uploadDialogList.length,
        });
      }
    });
    window.ipc.on("finishDownload", this.finishDownload);
    setInterval(() => {
      // 每次有上传任务就开启
      window.ipc.send("downloadSetSize", {
        num: this.uploadDialogList.length,
      });
    }, 3000); 
  },
  methods: {
    finishDownload(event, file) {
      let findFile = this.uploadDialogList.find((item) => item.uid == file.uid);
      findFile.isComplete = true;
      findFile.downloadSize = findFile.totalSize;
      this.uploadDialogList = this.uploadDialogList.filter(
        (item) => item.uid != file.uid
      );
    },
    openFile(item) {
      console.log(item.filePath, "item.filePath");
      ipcUtil.openDir(item.filePath);
    },
    close() {
      window.ipc.send("uploadClose");
    },
  },
};
</script>

<style lang="scss" scoped>
.uploadDialog {
  color: #000;
  padding: 8px;
  border-radius: 8px;
  width: 300px;
  // height: 300px;
  background: #fff;
  .header {
    width: 100%;
    height: 30px;
    display: flex;
    /deep/ .icon-guanbi {
      font-size: 16px;
    }
    .left {
      width: 260px;
      display: flex;
      align-items: center;
      font-weight: 700;
      -webkit-app-region: drag;
    }
    img {
      width: 24px;
      height: 24px;
      margin-right: 8px;
    }
    // -webkit-app-region: drag;
  }
  .uploadInfo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .folder-open {
      margin-right: 8px;
      cursor: pointer;
      width: 28px;
      height: 28px;
      border-radius: 9px;
      &:hover {
        background: var(--action);
      }
    }
  }
  .icon {
    display: flex;
    width: 100%;
    justify-content: end;
    padding: 0 8px;
    box-sizing: border-box;
    i {
      font-size: 14px;
      cursor: pointer;
    }
  }
  .uploadDialogItem {
    margin-top: 8px;
    .name {
      font-weight: 700;
      font-weight: 28px;
    }
    .size {
      font-size: 10px;
      margin-top: 2px;
    }
  }
}
</style>
