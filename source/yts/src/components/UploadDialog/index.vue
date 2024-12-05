<template>
  <div class="uploadDialog" v-show="uploadDialogList.length > 0&&isShow">
    <div class="icon" @click="changeShow">
      <Icon fontName="icon-guanbi" ></Icon>
    </div>
    <div
      class="uploadDialogItem"
      v-for="item in uploadDialogList"
      :key="item.uid"
    >
      <el-progress
        :text-inside="true"
        :stroke-width="25"
        :percentage="item.percentage"
        :format="format(item)"
      ></el-progress>
    </div>
  </div>
</template>

<script>
export default {
  name: 'uploadDialog',
  data() {
    return {
      uploadDialogList: [], //上传进度弹框
      isShow:true
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    format(item) {
      return () => item.name;
    },
    // 初始化
    init() {
      // 上传前
      this.$bus.$on('before', (file) => {
        this.before(file);
      });
      // 进度条
      this.$bus.$on('progress', (file) => {
        this.progress(file);
      });
      // 上传完成
      this.$bus.$on('success', (file) => {
        this.success(file);
      });
      console.log('进度条初始化成功');
    },
    // 上传前
    before(file) {
      // 每次有上传任务就开启
      this.isShow=true
      this.uploadDialogList.push({
        uid: file.uid,
        name: file.name,
        percentage: 0,
      });
      this.$emit('changList', this.uploadDialogList.length);
    },
    // 进度条
    progress(file) {
      let findFile = this.uploadDialogList.find((item) => item.uid == file.uid);
      if (findFile) {
        findFile.percentage = Math.round(file.percentage);
      } else {
        // 说明没创建
        this.uploadDialogList.push({
          uid: file.uid,
          name: file.name,
          percentage: 0,
        });
        // 每次有上传任务就开启
        this.isShow=true
        this.$emit('changList', this.uploadDialogList.length); 
      }
    },
    // 上传完成
    success(file) {
      // 控制进度条逻辑·····
      let fileIndex = this.uploadDialogList.findIndex(
        (item) => item.uid == file.uid
      );
      this.uploadDialogList.splice(fileIndex, 1, {
        ...this.uploadDialogList[fileIndex],
        name: '上传完成',
      });
      setTimeout(() => {
        this.uploadDialogList.splice(fileIndex, 1);
        this.$emit('changList', this.uploadDialogList.length);
      }, 1000);
    },
    changeShow(){
      this.isShow=!this.isShow
    }
  },
};
</script>

<style lang="scss" scoped>
.uploadDialog {
  position: fixed;
  z-index: 9999;
  color: #000;
  top: 38px;
  left: 45px;
  padding: 8px;
  border-radius: 8px;
  width: 300px;
  background: #fff;
  .icon{
    display: flex;
    width: 100%;
    justify-content: end;
    padding: 0 8px;
    box-sizing: border-box;
    i{
      font-size: 14px;
      cursor: pointer;
    }
  }
  .uploadDialogItem {
    margin-top: 8px;
  }
}
</style>
