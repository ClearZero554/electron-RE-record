<template>
  <el-dialog
    append-to-body
    width="50%"
    title="个人信息"
    :visible.sync="visible"
    @open="handleOpen"
  >
    <el-button size="mini" class="submit" @click="handleSubmit">保存</el-button>
    <div class="header">
      <div :span="6">个人信息</div>
      <iconpark-icon
        name="close-small"
        class="close-small"
        @click="visible = false"
      ></iconpark-icon>
    </div>
    <div class="main">
      <div class="mainItem">
        <div class="lab">ID</div>
        <div class="content">{{ userInfo.id }}</div>
      </div>
      <div class="mainItem">
        <div class="lab">昵称</div>
        <div class="content">
          <el-input
            v-model="info.nickname"
            placeholder="请输入昵称"
            size="mini"
            maxlength="10"
            show-word-limit
            class="input"
          ></el-input>
        </div>
      </div>
      <div class="mainItem">
        <div class="lab">签名</div>
        <div class="content">
          <el-input
            v-model="info.signature"
            placeholder="请输入签名"
            size="mini"
            maxlength="20"
            show-word-limit
            class="input"
          ></el-input>
        </div>
      </div>
      <div class="mainItem">
        <div class="lab">抖音主页</div>
        <div class="content">
          <el-input
            v-model="info.douyin"
            placeholder="请输入抖音主页"
            size="mini"
            maxlength="20"
            show-word-limit
            class="input"
          ></el-input>
        </div>
      </div>
      <div class="mainItem">
        <div class="lab">性别</div>
        <div class="content">
          <el-radio-group v-model="info.sex" class="radio">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
            <el-radio :label="0">未知</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="mainItem">
        <div class="lab">地区</div>
        <div class="content">
          <el-select
            v-model="info.province"
            placeholder="请选择省份"
            size="mini"
            filterable
            class="input"
          >
            <el-option
              v-for="item in provinceList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="mainItem">
        <div class="lab">头像</div>
        <div class="content avatarContent">
          <img :src="avatar" class="avatar" />
          <div class="control">
            <el-upload
              :limit="999"
              accept="image/*"
              action="https://yts.yuantiaoshi.com:8880/api/upload/image"
              :on-success="handleUpload"
              :show-file-list="false"
            >
              <el-button class="button" type="primary">修改头像</el-button>
            </el-upload>
            <el-button class="button bg" @click="del">删除头像</el-button>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import ipcUtil from "@/ipc";
import { userInfo, userEdit } from "@/api/user";
import feedback from "@/utils/feedback";

export default {
  data() {
    return {
      visible: false,
      key: 0,
      info: {
        nickname: null,
        signature: null,
        douyin: null,
        sex: null,
        province: null,
        avatar: null,
        id: null,
      },
      avatar: null,
      provinceList: [
        { id: 0, label: "北京" },
        { id: 1, label: "天津" },
        { id: 2, label: "河北" },
        { id: 3, label: "辽宁" },
        { id: 4, label: "吉林" },
        { id: 5, label: "黑龙江" },
        { id: 6, label: "山东" },
        { id: 7, label: "江苏" },
        { id: 8, label: "上海" },
        { id: 9, label: "浙江" },
        { id: 10, label: "安徽" },
        { id: 11, label: "福建" },
        { id: 12, label: "江西" },
        { id: 13, label: "广东" },
        { id: 14, label: "广西" },
        { id: 15, label: "海南" },
        { id: 16, label: "河南" },
        { id: 17, label: "湖南" },
        { id: 18, label: "湖北" },
        { id: 19, label: "山西" },
        { id: 20, label: "内蒙古" },
        { id: 21, label: "宁夏" },
        { id: 22, label: "青海" },
        { id: 23, label: "陕西" },
        { id: 24, label: "甘肃" },
        { id: 25, label: "新疆" },
        { id: 26, label: "四川" },
        { id: 27, label: "贵州" },
        { id: 28, label: "云南" },
        { id: 29, label: "重庆" },
        { id: 30, label: "西藏" },
        { id: 31, label: "香港" },
        { id: 32, label: "澳门" },
        { id: 33, label: "台湾" },
      ],
    };
  },
  computed: {
    userInfo() {
      this.avatar = this.$root.userInfo.avatar;
      this.info = this.$root.userInfo;
      return this.$root.userInfo;
    },
  },
  methods: {
    handleOpen() {
      this.$root.getUserInfo();
    },
    handleUpload(response, file, fileList) {
      this.avatar = response.data.path;
      this.info.avatar =
        "https://resource.yuantiaoshi.com/" + response.data.url;
    },
    handleSubmit() {
      userEdit(this.info).then((res) => {
        if (res.data.code == 200) {
          feedback.msgSuccess("修改成功");
          this.$root.getUserInfo();
        }
        this.visible = false;
      });
    },
    del() {
      this.info.avatar = "";
      this.handleSubmit();
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
  height: 370px;
  width: 495px;
  border-radius: 9px;
  padding: 0px;
  box-sizing: border-box;
  background: linear-gradient(
    to right,
    var(--tgLeft) 0%,
    var(--tgLeft) 100px,
    var(--tgRight) 100px,
    var(--tgRight) 100%
  ) !important;
  .header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 16px;
    box-sizing: border-box;
    font-weight: 700;
  }
  .main {
    margin-left: 26px;
    margin-top: 24px;
    .mainItem {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      .lab {
        width: 75px;
        font-size: 12px;
      }
      .content {
        margin-left: 28px;
        width: 320px;
      }
      .avatarContent {
        display: flex;
        .avatar {
          width: 60px;
          height: 60px;
          margin-right: 18px;
          border-radius: 3px;
        }
        .button {
          width: 56px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          margin-bottom: 10px;
        }
      }
    }
  }
}
.submit {
  position: absolute;
  right: 16px;
  bottom: 14px;
  border-radius: 3px !important;
  background: #d9d9d9;
}
.bg {
  background: #d9d9d9;
}
</style>