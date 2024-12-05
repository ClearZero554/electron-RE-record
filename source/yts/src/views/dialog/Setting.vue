<template>
  <el-dialog
    append-to-body
    :show-close="false"
    title="设置"
    :visible.sync="visible"
    @open="handleOpen"
    width="50%"
  >
    <div class="header">
      <div>更多设置</div>
      <iconpark-icon
        name="close-small"
        class="close-small"
        @click="visible = false"
      ></iconpark-icon>
    </div>
    <div style="display: flex">
      <div class="sidebar">
        <div
          class="sidebarItem"
          :class="item.id == sidebarId ? 'action' : ''"
          v-for="item in sidebarList"
          :key="item.id"
          @click="sidebarId = item.id"
        >
          <iconpark-icon :name="item.icon" class="icon"></iconpark-icon>
          <div class="text">{{ item.title }}</div>
        </div>
      </div>
      <!-- 通用设置 -->
      <div class="setting" v-if="sidebarId == 1">
        <div class="title">· 通用设置</div>
        <div class="settingItem">
          <div class="lab">开机自启动</div>
          <div class="content">
            <el-checkbox
              class="item"
              v-model="setting.isLoginStart"
              @change="handleChangeIsLoginStart"
            ></el-checkbox>
          </div>
        </div>
        <div class="settingItem">
          <div class="lab">任务栏开播提示</div>
          <div class="content">
            <el-checkbox
              class="item"
              v-model="isBeginToShow"
              @change="handleChangeIsBeginToShow"
            ></el-checkbox>
          </div>
        </div>
        <div class="settingItem">
          <div class="lab h25">日志</div>
          <div class="content">
            <el-button @click="uploadLogs" class="button" size="mini"
              >上传</el-button
            >
          </div>
        </div>
        <div class="settingItem">
          <div class="lab h25">伴侣版本</div>
          <div class="content">
            {{ $root.liveVersion.dictName }}
            <el-button
              @click="$root.getLiveVersion(true)"
              class="button mal8"
              size="mini"
              >适配直播伴侣</el-button
            >
          </div>
        </div>
        <div class="settingItem">
          <div class="lab">伴侣更新时间</div>
          <div class="content">
            {{ $root.liveVersion.updateTime }}
          </div>
        </div>
        <div class="settingItem">
          <div class="lab">OBS路径</div>
          <div class="content">
            {{ setting.path }}
            <div class="buttonBox">
              <el-button
                size="small"
                class="button"
                @click="handleOpenDir(setting.path)"
                >打开目录位置</el-button
              >
              <el-button
                size="small"
                class="button"
                @click="handleSelectDir(setting.path, 'path')"
                >修改目录</el-button
              >
            </div>
          </div>
        </div>
        <div class="settingItem">
          <div class="lab">源调试缓存</div>
          <div class="content">
            {{ setting.resourcesPath }}
            <div class="buttonBox">
              <el-button
                size="small"
                class="button"
                @click="handleOpenDir(setting.resourcesPath)"
                >打开目录位置</el-button
              >
            </div>
          </div>
        </div>
        <div class="settingItem">
          <div class="lab">配置路径</div>
          <div class="content">
            {{ setting.allocationPath }}
            <div class="buttonBox">
              <el-button
                size="small"
                class="button"
                @click="handleOpenDir(setting.allocationPath)"
                >打开目录位置</el-button
              >
              <el-button
                size="small"
                class="button"
                @click="
                  handleSelectDir(setting.allocationPath, 'allocationPath')
                "
                >修改目录</el-button
              >
            </div>
          </div>
        </div>
      </div>
      <!-- 分享 -->
      <div class="setting" v-if="sidebarId == 2">
        <div class="title">· 分享</div>
        <div class="share">源调试https://yuantiaoshi.com</div>
        <el-button class="copy" size="mini">一键复制</el-button>
      </div>
      <!-- 分享码 -->
      <div class="setting" v-if="sidebarId == 3">
        <div class="title">· 请输入分享码</div>
        <div class="sharingCode">
          <div class="input">
            <div class="lab">分享码:</div>
            <div>
              <el-input
                v-model="sharingCode"
                size="mini"
                placeholder=""
              ></el-input>
            </div>
          </div>
          <div class="sharingCodeButton">
            <el-button @click="sharingCode = ''" class="button" size="mini"
              >清空</el-button
            >
            <el-button @click="submit" class="button" size="mini"
              >确定</el-button
            >
          </div>
        </div>
        <div class="title">· 历史记录</div>
        <div class="record">
          <div class="recordItem">
            <div class="recordTile">分享码</div>
            <div class="recordTile">时间</div>
          </div>
          <div class="recordBox" v-if="usageRecordsList.length > 0">
            <div
              class="recordItem recordContent"
              v-for="item in usageRecordsList"
              :key="item.id"
            >
              <div>{{ item.code }}</div>
              <div>{{ item.useTime }}</div>
            </div>
          </div>
          <div class="recordEmpty" v-else>暂无数据</div>
        </div>
      </div>

      <!-- 关于源调试 -->
      <div class="setting" v-if="sidebarId == 4">
        <div class="title">· 关于源调试</div>
        <div class="about">
          <div class="briefIntroduction">
            <el-image
              class="logo"
              :src="require('@/assets/logo.png')"
              :draggable="false"
            ></el-image>
            <span class="title">源调试</span>
          </div>
          <div class="list">
            <span class="left">当前版本</span>
            <span class="right">{{ version }}</span>
          </div>
          <div class="list">
            <span class="left">源调试官网</span>
            <span
              class="right"
              style="color: #409eff; cursor: pointer"
              @click="goOfficialWebsite"
              >https://yuantiaoshi.com</span
            >
          </div>
          <div class="list">
            <span class="left">客服QQ群</span>
            <span class="right">715581670</span>
          </div>
          <div class="list">
            <span class="left">在线时间</span>
            <span class="right">北京时间：10:00 -- 18:00</span>
          </div>
          <div class="list">
            <span class="left">源调试协议</span>
            <span class="right">
              <span class="protocol" @click="handleClickProtocol"
                >《会员协议》</span
              >
              <span class="protocol" @click="handleClickProtocol"
                >《版权协议》</span
              >
            </span>
          </div>
        </div>
      </div>
      <!-- 填写邀请人 -->
      <div class="setting" v-if="sidebarId == 5">
        <div class="title">· 邀请人</div>
        <div class="inviterBox" v-if="!inviterUserInfo.id">
          <div class="input">
            <div class="lab">ID：</div>
            <el-input
              v-model.trim="inviter"
              size="mini"
              placeholder="请输入ID"
              @change="inviterChange"
              suffix-icon="el-icon-search"
              :disabled="userInfo.isNewRegister == 0"
            ></el-input>
          </div>
          <div class="member">
            <div class="memberItem" v-if="user.id">
              <img :src="user.avatar" alt="" />
              <div>{{ user.nickname }}</div>
            </div>
          </div>
          <div class="buttons">
            <el-button
              class="button"
              style="background: #0d99ff"
              size="mini"
              :disabled="!user.id"
              @click="binding"
              >绑定</el-button
            >
            <!-- <el-button class="button" @click="unBinding" size="mini"
              >解除绑定</el-button
            > -->
          </div>
        </div>
        <div class="inviterBox" v-if="inviterUserInfo.id">
          <div class="member">
            <div class="memberTitle">已绑定用户:</div>
            <div class="memberItem">
              <img :src="inviterUserInfo.avatar" alt="" />
              <div>{{ inviterUserInfo.nickname }}</div>
            </div>
          </div>
          <div class="buttons">
            <el-button class="button" @click="unBinding" size="mini"
              >解除绑定</el-button
            >
          </div>
        </div>
      </div>
      <!-- 注销账号 -->
      <div class="setting" v-if="sidebarId == 6">
        <div class="title">· 注销账号</div>
        <div class="cancellation">
          <div class="textItem">
            <Icon fontName="icon-gantanhaozhong" class="gantanhaozhong"></Icon>
            <div>
              申请注销后需官方审核，有7天审核期，如果审核期内未
              驳回，审核期过后账号自动注销
            </div>
          </div>
          <div class="textItem">
            <Icon fontName="icon-gantanhaozhong" class="gantanhaozhong"></Icon>
            <div>
              账号成功注销后账号无法找回，包括账号内所有虚拟商品
              （实际相关数据依旧保存在数据库，可以查看）
            </div>
          </div>
          <div class="button" @click="accountCancellation">
            我已知晓确定注销账号
          </div>
        </div>
      </div>
      <div class="setting" v-if="sidebarId == 9">
        <div class="title">· 皮肤</div>
        <div class="imgList">
          <div @click="changeCss('theme')">
            <img
              src="@/assets/theme.png"
              alt=""
              :class="css == 'theme' ? 'action' : ''"
            />
            <div>经典白</div>
          </div>
          <div @click="changeCss('night')">
            <img
              src="@/assets/night.png"
              alt=""
              :class="css == 'night' ? 'action' : ''"
            />
            <div>炫酷黑</div>
          </div>
          <div>
            <img src="@/assets/sd.png" alt="" />
            <div>欢乐圣诞</div>
          </div>
        </div>
      </div>
      <!-- 下载 -->
      <div class="setting" v-if="sidebarId == 8">
        <div class="title">· 下载队列</div>
        <div class="uploadDialogList" v-if="uploadDialogList.length > 0">
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
                <iconpark-icon
                  name="folder-open"
                  class="folder-open"
                ></iconpark-icon>
              </div>
            </div>
            <el-progress
              :show-text="false"
              :percentage="item.percentage"
              :color="item.isComplete ? '#13CE66' : '#20A0FF'"
            ></el-progress>
          </div>
        </div>
        <div class="zwsj">
          <img src="@/assets/zwsj.png" alt="" />
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import ipcUtil from "@/ipc";
import moment from "moment";
import {
  userUploadLog,
  selectById,
  bindingInviter,
  inviterInfo,
} from "@/api/index";
import { membershipCode } from "@/api/article";
import { useMembershipCode } from "@/api/login";
import { logout, cancelDelete } from "@/api/index";
import config from "@/../package.json";
import feedback from "@/utils/feedback";
export default {
  data() {
    return {
      visible: false,
      setting: {
        // 开机自启
        isLoginStart: null,
        path: "",
        allocationPath: "",
        config: "",
        videoPath: null,
        imagePath: "",
        resourcesPath: "",
        audiosPath: "",
      },
      isBeginToShow: true, //是否能开播提示
      key: 0,
      outputList: [],
      output: "",
      sidebarId: 8,
      sidebarList: [
        {
          id: 1,
          title: "通用设置",
          icon: "setting-one",
        },
        {
          id: 2,
          title: "分享",
          icon: "share-one",
        },
        {
          id: 8,
          title: "下载",
          icon: "to-bottom",
        },
        {
          id: 9,
          title: "皮肤",
          icon: "user",
        },
        {
          id: 3,
          title: "分享码",
          icon: "weixin-mini-app",
        },
        {
          id: 5,
          title: "绑定邀请人",
          icon: "share",
        },
        {
          id: 7,
          title: "任务",
          icon: "list-two",
        },
        {
          id: 6,
          title: "注销账号",
          icon: "power-ee71d1hk",
        },
        {
          id: 4,
          title: "关于源调试",
          icon: "info",
        },

        // {
        //   id: 10,
        //   title: "更多",
        //   icon: "system",
        // },
      ],
      sharingCode: "", //分享码
      usageRecordsList: [], //已使用分享码列表
      version: "",
      inviter: "",
      inviterUserInfo: {},
      user: {},
      css: "theme",
      uploadDialogList: [],
    };
  },
  watch: {
    immediate: true,
  },
  computed: {
    userInfo() {
      return this.$root.userInfo;
    },
  },
  mounted() {
    this.size = localStorage.getItem("size") || "924*646";
    this.output = localStorage.getItem("defaultDeviceId") || "default";

    let isBeginToShow = localStorage.getItem("isBeginToShow");
    if (isBeginToShow == undefined) {
      localStorage.setItem("isBeginToShow", "1");
    } else {
      this.isBeginToShow = isBeginToShow == "1" ? true : false;
    }
    this.$root.isBeginToShow = this.isBeginToShow;
    // this.handleOpen();
    this.css = localStorage.getItem("css") || "theme";
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
  },
  methods: {
    async handleOpen() {
      this.version = config.version;
      this.setting = ipcUtil.getStore("setting") || {};
      const homeDir = ipcUtil.getStore("homeDir");
      if (this.setting.isLoginStart === undefined) {
        this.setting.isLoginStart = false;
      }
      if (this.$root.obs.path) {
        this.setting.path = this.$root.obs.path;
      } else {
        // 查询obs路径是否存在
        let flag = await ipcUtil.isAccess(this.setting.path);
        if (this.setting.path && flag) {
          this.$root.obs.path = this.setting.path;
        }
      }
      if (this.$root.obs.config) {
        this.setting.config = this.$root.obs.config;
      } else {
        this.setting.config = homeDir + "\\AppData\\Roaming\\obs-studio";
        this.$root.obs.config = homeDir + "\\AppData\\Roaming\\obs-studio";
      }
      if (!this.setting.allocationPath) {
        this.setting.allocationPath = homeDir + "\\Desktop";
      }
      ipcUtil.setStore("setting", this.setting);
      this.key = this.key + 1;
      this.usageRecords();
      this.getInviterInfo();
    },
    handleChangeIsLoginStart() {
      ipcUtil.setStore("setting", this.setting);
      ipcUtil.loginStartStatus(this.setting.isLoginStart);
    },
    handleChangeIsBeginToShow() {
      localStorage.setItem("isBeginToShow", this.isBeginToShow ? "1" : "0");
      if (!this.isBeginToShow) {
        window.ipc.send("changeIcon", { name: "blank.png" });
      }
    },
    async handleSelectDir(path, type) {
      if (type == "path") {
        ipcUtil.selectFile((res) => {
          this.setting[type] = res.data;
          ipcUtil.setStore("setting", this.setting);
          this.key = this.key + 1;
        });
      } else {
        ipcUtil.selectDir(path, (res) => {
          this.setting[type] = res.data;
          ipcUtil.setStore("setting", this.setting);
          this.key = this.key + 1;
        });
      }
    },
    handleInputChange(event) {
      console.log(event.target.files);
    },
    handleOpenDir(src) {
      ipcUtil.openDir(src);
    },
    // 获取音频输出设备
    async getAudioFrequency() {
      await navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          devices.forEach((device) => {
            if (device.kind === "audiooutput") {
              if (device.label.includes("Default")) {
                this.outputList.push({
                  label: "默认",
                  deviceId: device.deviceId,
                });
                return;
              }
              this.outputList.push(device);
            }
          });
        })
        .catch((error) => {
          console.error("Error enumerating output devices:", error);
        });
    },
    // 上传日志
    async uploadLogs() {
      const basePath = await ipcUtil.getSystemDisk();
      let time = moment().format("YYYY-MM-DD");
      let name = "yts-.-" + time + ".txt";
      const res = await window.ipc.invoke("uploadConfiguration", {
        path: basePath + "yuantiaoshi-hc",
        name,
      });
      const data = {
        file: res.result.data.path,
      };

      const rel = await userUploadLog(data);
      if (rel.data.code) {
        feedback.msgSuccess("上传成功~等待客服和您联系");
      }
    },
    outputChange(e) {
      localStorage.setItem("defaultDeviceId", e);
    },
    // 提交分享码
    async submit() {
      const res = await useMembershipCode({ code: this.sharingCode });
      if (res.data.code == 200) {
        this.$root.getUserInfo();
        this.$message({
          type: "success",
          message: "会员增加成功",
        });
        this.usageRecords();
      } else {
        this.$message({
          type: "error",
          message: res.data.msg,
        });
      }
    },
    async usageRecords() {
      const res = await membershipCode({
        status: "2",
        time: null,
        pageNo: 1,
        pageSize: 6,
        type: null,
      });
      if (res.data.code == 200) {
        this.usageRecordsList = res.data.data.lists;
      }
    },
    goOfficialWebsite() {
      ipcUtil.openUrl("https://yuantiaoshi.com");
    },
    handleClickProtocol() {},
    // 搜索id
    async inviterChange(value) {
      if (!value) return;
      const res = await selectById({ id: value });
      if (res.data.code == 200) {
        this.user = res.data.data;
      } else {
        feedback.msgWarning("查询失败");
      }
    },
    // 绑定
    async binding() {
      if (this.userInfo.isNewRegister == 0) {
        feedback.msgWarning("您不是7天内注册的新用户");
        return;
      }
      const res = await bindingInviter({ inviter: this.user.id });
      if (res.data.code == 200) {
        feedback.msgSuccess("绑定成功");
        this.getInviterInfo();
      } else {
        feedback.msgWarning("绑定失败");
      }
    },
    // 解除绑定
    async unBinding() {
      if (this.userInfo.isNewRegister == 0) {
        feedback.msgWarning("您不是7天内注册的新用户");
        return;
      }
      const res = await bindingInviter({ inviter: null });
      console.log(res);
      if (res.data.code == 200) {
        feedback.msgSuccess("解绑成功");
      } else {
        feedback.msgWarning("解绑失败");
      }
    },
    // 查询绑定人
    async getInviterInfo() {
      const res = await inviterInfo();
      console.log(res, "res");
      if (res.data.code == 200) {
        this.inviterUserInfo = res.data.data;
      }
    },
    async accountCancellation() {
      const rel = await logout();
      if (rel.data.code == 200) {
        feedback.msgSuccess("注销成功");
        ipcUtil.setStore("token", null);
        this.$root.userInfo = {};
        this.$router.go(0);
      } else {
        feedback.msgWarning(rel.data.msg);
      }
    },
    async revoke() {
      const rel = await cancelDelete();
      if (rel.data.code == 200) {
        feedback.msgSuccess("撤销注销成功");
        this.$root.getUserInfo();
        this.visible = false;
      }
    },
    changeCss(type) {
      if (this.css == type) {
        return;
      }
      this.css = type;
      if (this.$route.path == "/soundEffect") {
        ipcUtil.changeCss({ disPlay: 2 });
      } else if (this.$route.path == "/chat") {
        ipcUtil.changeCss({ disPlay: 1 });
      } else {
        ipcUtil.changeCss({ disPlay: 1 });
      }
      localStorage.setItem("css", this.css);
    },
    finishDownload(event, file) {
      let findFile = this.uploadDialogList.find((item) => item.uid == file.uid);
      findFile.isComplete = true;
      findFile.downloadSize = findFile.totalSize;
      this.uploadDialogList = this.uploadDialogList.filter(
        (item) => item.uid != file.uid
      );
    },
    openFile(item) {
      ipcUtil.openDir(item.filePath);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-button {
  background: #e6e6e6;
  padding: 6px 12px;
  &:hover {
    background: #ccc !important;
  }
}
::v-deep .el-dialog__header {
  display: none;
}
::v-deep .el-dialog {
  background: rgba($color: #000000, $alpha: 0) !important;
}
::v-deep .el-dialog__body {
  height: 400px;
  width: 540px;
  background: linear-gradient(
    to right,
    var(--tgLeft) 0%,
    var(--tgLeft) 110px,
    var(--tgRight) 110px,
    var(--tgRight) 100%
  ) !important;
  border-radius: 9px;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
  .close-small {
    font-size: 20px;
    // cursor: pointer;
    // position: absolute;
    // right: 10px;
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
  .sidebar {
    width: 110px;
    height: 339px;
    padding: 14px 0px;
    .sidebarItem {
      width: 110px;
      padding-left: 5px;
      box-sizing: border-box;
      height: 28px;
      display: flex;
      align-items: center;
      margin-top: 4px;
      // border-radius: 3px;
      cursor: pointer;
      .text {
        margin-left: 6px;
        font-size: 10px;
      }
      .icon {
        height: 12px;
        width: 12px;
        margin-left: 4px;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        background: var(--iconBj);
        color: var(--icon);
        border-radius: 3px;
      }
    }
    .action {
      background: #d1e5f9;
      .icon {
        background: #0d99ff;
        color: #fff;
      }
      .text {
        color: #0d99ff;
        font-size: 12px;
        font-weight: 700;
      }
    }
  }
  .setting {
    padding: 18px 9px;
    flex: 1;
    .share {
      width: 200px;
      height: 90px;
      background: var(--tgn);
      border-radius: 5px;
      margin-left: 19px;
      font-size: 12px;
      text-align: center;
      line-height: 90px;
    }
    .copy {
      margin-left: 90px;
      margin-top: 10px;
      background: var(--tgn);
      color: var(--fz);
      border-radius: 16px;
      &:hover {
        background: #ccc;
      }
    }
    .title {
      font-weight: 800;
      font-size: 12px;
      margin-bottom: 12px;
      margin-left: 9px;
    }
    .settingItem {
      display: flex;
      margin-left: 19px;
      font-size: 12px;
      margin-bottom: 8px;
      .lab {
        width: 120px;
        // line-height: 25px;
      }
      .h25 {
        line-height: 25px;
      }
      .mal8 {
        margin-left: 8px;
      }
      .button {
        border-radius: 16px;
        padding: 6px 8px;
        background: var(--tgButton);
        color: var(--fz);
      }
      .buttonBox {
        margin-top: 8px;
      }
    }
    .sharingCode {
      width: 300px;
      height: 90px;
      background: var(--tgn);
      margin-left: 19px;
      border-radius: 9px;
      overflow: hidden;
      margin-bottom: 18px;
      .input {
        display: flex;
        margin: 20px 0 8px 8px;
        align-items: center;
        .el-input__inner {
          width: 228px;
          height: 24px;
        }
        .lab {
          font-size: 12px;
          // color: #000000;
          margin-right: 8px;
        }
      }
      .sharingCodeButton {
        display: flex;
        justify-content: flex-end;
        margin-right: 20px;
        .button {
          border-radius: 16px;
          background: #e6e6e6;
          color: var(--fz);
          &:hover {
            background: #ccc;
          }
        }
      }
    }
    .record {
      width: 384px;
      height: 157px;
      background: var(--tgn);
      margin-left: 19px;
      border-radius: 9px;
      padding: 5px 8px;
      box-sizing: border-box;
      .recordEmpty {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 130px;
        font-size: 12px;
        color: #999;
      }
      .recordBox {
        width: 100%;
        height: 130px;
        overflow-y: scroll;
        &::-webkit-scrollbar {
          display: none;
        }
        /* 滚动条轨道样式 */
        &::-webkit-scrollbar-track {
          background: #f1f1f1; /* 滚动条轨道的背景色 */
        }
        /* 滚动条滑块样式 */
        &::-webkit-scrollbar-thumb {
          background: #888; /* 滚动条滑块的颜色 */
          border-radius: 10px; /* 滑块的圆角 */
        }
        /* 当滑块悬停时 */
        &::-webkit-scrollbar-thumb:hover {
          background: #555; /* 悬停时的颜色 */
        }
      }
      .recordItem {
        display: flex;
        justify-content: space-between;
        .recordTile {
          // color: #000000;
          font-size: 12px;
        }
      }
      .recordContent {
        font-size: 10px;
        margin-top: 10px;
      }
    }
    .about {
      background: var(--tgn);
      border-radius: 5px;
      width: 384px;
      height: 240px;
      margin: auto;
      margin-top: 40px;
      padding: 12px;
      box-sizing: border-box;
      .briefIntroduction {
        margin-bottom: 14px;
        display: flex;
        align-items: center;
        .logo {
          height: 48px;
          width: 48px;
          vertical-align: middle;
        }
        .title {
          font-size: 20px;
          font-weight: 800;
          // color: #000000;
          margin-left: 10px;
          margin-bottom: 0;
        }
      }
      .list {
        font-size: 12px;
        display: flex;
        // color: #000000;
        margin-bottom: 12px;
        .left {
          width: 60px;
          margin-right: 10px;
        }
        .right {
          line-height: 16px;
        }
        .protocol {
          cursor: pointer;
          color: #409eff;
        }
      }
    }
    .inviterBox {
      width: 300px;
      height: 180px;
      background: var(--tgn);
      border-radius: 9px;
      margin-left: 19px;
      overflow: hidden;
      position: relative;
      .input {
        width: 100%;
        display: flex;
        align-items: center;
        margin-top: 26px;
        margin-left: 8px;
        .lab {
          width: 30px;
          font-size: 10px;
          // color: #000000;
        }
        .el-input {
          width: 220px;
        }
      }
      .member {
        width: 180px;
        height: 100px;
        // background: #000;
        margin-top: 15px;
        margin-left: 8px;
        // color: #000000;
        .memberTitle {
          margin-bottom: 20px;
          font-weight: 500;
          margin-top: 24px;
        }
        .memberItem {
          display: flex;
          align-items: center;
          cursor: pointer;

          img {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            margin-right: 8px;
          }
        }
      }
      .buttons {
        position: absolute;
        right: 8px;
        bottom: 8px;
        .button {
          border-radius: 16px;
          // color: #000000;
          color: var(--fz);
        }
      }
    }
    .cancellation {
      width: 384px;
      height: 158px;
      margin-left: 19px;
      margin-top: 35px;
      border-radius: 6px;
      background: var(--tgLeft);
      font-size: 10px;
      padding: 20px;
      box-sizing: border-box;
      .textItem {
        display: flex;
        margin-bottom: 8px;
        color: var(--fc);
        font-weight: 700;
        .gantanhaozhong {
          font-weight: 700;
          color: red;
        }
      }
      .button {
        width: 120px;
        height: 25px;
        line-height: 25px;
        text-align: center;
        border-radius: 20px;
        color: #000000;
        background: #e6e6e6;
        margin-left: 130px;
        margin-top: 34px;
        cursor: pointer;
      }
    }
    .imgList {
      display: flex;
      margin-left: 8px;
      div {
        margin-right: 8px;
        font-size: 12px;
        width: 100%;
        text-align: center;
        cursor: pointer;
      }
      .action {
        border: 2px solid #0d99ff;
      }
      img {
        width: 100px;
        height: 70px;
        box-sizing: border-box;
        border-radius: 9px;
      }
    }
    .uploadDialogItem {
      width: 284px;
      height: 60px;
      background: #fff;
      box-sizing: border-box;
      margin-left: 8px;
      border-radius: 9px;
      padding: 8px;
      /deep/ .el-progress-bar__outer {
        height: 12px !important;
      }
      .name {
        font-weight: 700;
        font-weight: 28px;
      }
      .size {
        font-size: 10px;
        margin-top: 2px;
      }
    }
    .zwsj {
      width: 250px;
      height: 120px;
      border: 1px solid #e6e6e6;
      border-radius: 9px;
      background: var(--tgn);
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 19px;
      img {
        width: 188px;
        height: 108px;
      }
    }
    .uploadDialogList {
      width: 300px;
      height: 120px;
      background: var(--tgLeft);
      border-radius: 9px;
      overflow-y: scroll;
      padding: 8px 0;

      &::-webkit-scrollbar {
        display: none;
      }
      /* 滚动条轨道样式 */
      &::-webkit-scrollbar-track {
        background: #f1f1f1; /* 滚动条轨道的背景色 */
      }
      /* 滚动条滑块样式 */
      &::-webkit-scrollbar-thumb {
        background: #888; /* 滚动条滑块的颜色 */
        border-radius: 10px; /* 滑块的圆角 */
      }
      /* 当滑块悬停时 */
      &::-webkit-scrollbar-thumb:hover {
        background: #555; /* 悬停时的颜色 */
      }
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
  }
}
</style>
