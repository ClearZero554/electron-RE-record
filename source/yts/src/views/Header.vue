<template>
  <div class="header">
    <div class="logo" @click="clickLogo">
      <!-- <el-avatar shape="square" :size="24" :src="logo" ></el-avatar> -->
      <el-image :src="logo"></el-image>
      <span class="name">{{ title }}</span>
    </div>
    <div class="version">{{ version }}</div>

    <div class="VipBox">
      <!-- <VipBox></VipBox> -->
      <div class="expire" v-if="userInfo.isMember == 1">
        会员剩余:{{ userInfo.days }}天
      </div>
      <div
        class="expire"
        v-else-if="userInfo.isNewUserIn24h == 1"
        @click="$refs.vip.visible = true"
      >
        会员剩余:试用1天
      </div>
      <div class="expire" v-else @click="$refs.vip.visible = true">
        会员剩余:未开通
      </div>
    </div>
    <!-- <div class="icons" @click.stop="changeCss">
      <Icon
        fontName="icon-lieri"
        style="color: #000"
        v-if="css == 'theme'"
      ></Icon>
      <Icon fontName="icon-yueliang" style="color: #fff" v-else></Icon>
    </div> -->
    <div class="interval120"></div>
    <div class="block">
      <el-slider
        v-model="size"
        :step="10"
        show-stops
        :show-tooltip="false"
        :min="40"
        @change="sliderChange"
      >
      </el-slider>

      <span class="demonstration">{{ demonstration }}</span>
    </div>
    <div class="interval170"></div>

    <div class="control">
      <template v-if="disPlay == 0 || isShowHeader">
        <template v-if="userInfo.nickname">
          <el-dropdown
            size="mini"
            trigger="click"
            :show-timeout="0"
            ref="dropdown"
            class="clickDropdown"
            placement="bottom"
          >
            <el-image
              :src="userInfo.avatar"
              @click="clickAvatar"
              class="clickAvatar"
              :draggable="false"
            ></el-image>
            <el-dropdown-menu
              slot="dropdown"
              class="header-dropdown"
              id="popUp"
            >
              <el-dropdown-item @click.native="handleClickVip">
                <iconpark-icon name="vip-one"></iconpark-icon>
                <span>我的会员</span>
              </el-dropdown-item>
              <el-dropdown-item @click.native="handleClickDetail">
                <iconpark-icon name="edit-two"></iconpark-icon>
                <span>个人资料</span>
              </el-dropdown-item>
              <el-dropdown-item @click.native="handleClickSafe">
                <iconpark-icon name="protect"></iconpark-icon>
                <span>帐户安全</span>
              </el-dropdown-item>
              <el-dropdown-item @click.native="handleLogout">
                <iconpark-icon name="power"></iconpark-icon>
                <span>退出账号</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span class="username">{{ userInfo.nickname }}</span>
        </template>
        <template v-else-if="$root.store.isTourist">
          <span class="login">游客</span>
        </template>
        <template v-else>
          <span class="login" @click="handleLogin">登录</span>
        </template>
      </template>
      <div v-else class="interval80"></div>
      <div class="icons">
        <Icon
          fontName="icon-lieri"
          class="icon-lieri"
          style="color: #000"
          v-if="css == 'theme'"
          @click.stop="changeCss"
        ></Icon>
        <Icon
          fontName="icon-yueliang"
          class="icon-lieri"
          style="color: #fff"
          v-else
          @click.stop="changeCss"
        ></Icon>
        <!--  <iconpark-icon
          name="setting-one"
          class="icon"
          @click="handleClickSetting"
        ></iconpark-icon> -->
        <!-- <el-tooltip
          class="item"
          effect="dark"
          content="更多"
          placement="bottom"
        > -->
          <el-popover
            ref="popover"
            trigger="hover"
            popper-class="header-popover"
            transition="el-zoom-in-top"
            placement="bottom-start"
          >
            <span class="button" slot="reference"
              ><i class="el-icon-s-operation">
                <span class="itemIcon" v-if="uploadNum > 0">{{
                  uploadNum
                }}</span></i
              ></span
            >
            <div class="button-list">
              <div class="item" @click="handleClickSetting">
                <Icon fontName="icon-shezhi"></Icon>
                <span>设置</span>
              </div>
              <div class="item" @click="handleClickAbout">
                <Icon fontName="icon-info"></Icon>
                <span>关于</span>
              </div>
              <div class="item" @click="handleClickShare">
                <Icon fontName="icon-fenxiang"></Icon>
                <span>分享</span>
              </div>
              <div class="item" @click="handleClickChange">
                <Icon fontName="icon-refresh"></Icon>
                <span>分享码</span>
              </div>
              <div class="item" @click="novice">
                <iconpark-icon name="index-finger"></iconpark-icon>
                <span>新手指引</span>
              </div>
            </div>
          </el-popover>
        <!-- </el-tooltip> -->
        <!-- <iconpark-icon
            name="close-small"
            class="icon close-small"
          ></iconpark-icon> -->
        <div class="sx"></div>
        <span class="button" @click="handleMin"
          ><i class="el-icon-minus"></i
        ></span>
        <span class="button" @click="handleClose"
          ><i class="el-icon-close"></i
        ></span>
      </div>
    </div>
    <Login ref="login" @getInfo="getInfo"></Login>
    <share ref="share"></share>
    <setting ref="setting"></setting>
    <detail ref="detail" @getInfo="getInfo"></detail>
    <vip ref="vip" @getInfo="getInfo"></vip>
    <safe ref="safe"></safe>
    <Peeling ref="Peeling" @changePeeling="changePeeling"></Peeling>
    <Questionnaire ref="Questionnaire"></Questionnaire>
    <UploadDialog ref="uploadDialog" @changList="changList"></UploadDialog>
    <Task ref="task"></Task>
    <ConvertToFormat ref="ConvertToFormat"></ConvertToFormat>
  </div>
</template>

<script>
import Login from "@/views/dialog/Login.vue";
import Share from "@/views/dialog/Share.vue";
import Setting from "@/views/dialog/Setting.vue";
import Detail from "@/views/dialog/Detail.vue";
import Vip from "@/views/dialog/Vip.vue";
import Safe from "@/views/dialog/Safe.vue";
import Questionnaire from "@/views/home/Questionnaire.vue";
import feedback from "@/utils/feedback";
import ipcUtil from "@/ipc";
import { quit, useMembershipCode, update } from "@/api/login";
import config from "@/../package.json";
import Peeling from "@/components/Peeling/index.vue";
import UploadDialog from "@/components/UploadDialog";
import Task from "@/components/Task/index.vue";
import ConvertToFormat from "@/components/ConvertToFormat/index.vue";
import moment from "moment";
import VipBox from "@/components/VipBox/index";
import { userUploadLog } from "@/api/index";
export default {
  components: {
    Login,
    Share,
    Setting,
    Detail,
    Vip,
    Safe,
    Questionnaire,
    Peeling,
    UploadDialog,
    Task,
    ConvertToFormat,
    VipBox,
  },
  props: ["isShowHeader"],
  data() {
    return {
      logo: require("@/assets/logo.png"),
      loginDialogVisible: true,
      title: process.env.VUE_APP_API_TYPE == 1 ? "源调试" : "测试版",
      loop: null,
      size: 60,
      triggerType: "hover",
      version: null, // 版本号
      isShowPopup: false, //是否显示头像下拉框
      css: "theme",
      disPlay: 0,
      uploadNum: 0,
      popoverShow: false,
    };
  },
  mounted() {
    // 设置版本号
    this.version = config.version;
    // 更改主题
    this.css = localStorage.getItem("css") || "theme";
    this.$router.onReady(() => {
      if (this.$route.path == "/soundEffect") {
        this.title = "音效库";
        this.disPlay = 2;
      } else if (this.$route.path == "/chat") {
        this.title = "聊天室";
        this.disPlay = 1;
      }
    });
    this.size = Number(localStorage.getItem("size")) || 60;
    this.sliderChange();
    this.getInfo();
    if (!ipcUtil.getStore("token")) {
      // 打开登录弹框
      this.$refs.login.visible = true;
    }
    this.$bus.$on("isShowLogin", (data) => {
      // 监听到事件并获取传递的数据
      if (!this.$refs.login.visible) {
        if (data !== "登录过期,请重新登录") {
          this.$root.store.isUseTourist = true;
        } else {
          this.$root.store.isUseTourist = false;
        }
        if (!this.$root.store.isTourist && this.$route.path != "/chat") {
          // this.$root.userInfo = {};
          // ipcUtil.setStore('token', null);
          this.$refs.login.visible = true;
          feedback.msgWarning(data);
        }
      }
    });
    this.$bus.$on("isShowVip", (data) => {
      // 监听到事件并获取传递的数据
      if (!this.$refs.vip.visible) {
        this.$refs.vip.visible = true;
      }
    });

    const html = document.querySelector("html");
    html.setAttribute("data-v-css", this.css ? this.css : "theme");
    window.ipc.on("changeCss", () => {
      const html = document.querySelector("html");
      html.setAttribute("data-v-css", this.css == "theme" ? "night" : "theme");
      this.css = this.css == "theme" ? "night" : "theme";
    });
  },
  watch: {
    $route: {
      handler(val) {
        if (val.path == "/soundEffect") {
          this.size = Number(localStorage.getItem("audioSize")) || 40;
          this.sliderChange();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    demonstration() {
      if (this.size == 60) {
        return "100%";
      } else if (this.size == 50) {
        return "75%";
      } else if (this.size == 40) {
        return "50%";
      } else if (this.size == 70) {
        return "125%";
      } else if (this.size == 80) {
        return "150%";
      } else if (this.size == 90) {
        return "175%";
      } else if (this.size == 100) {
        return "200%";
      }
      return "100%";
    },
    userInfo() {
      return this.$root.userInfo;
    },
  },
  methods: {
    async getInfo() {
      
      let token = ipcUtil.getStore("token");
      console.log(token, "token");
      if (token != null) {
        // 获取个人信息
        const res = await this.$root.getUserInfo();
        if (res != null) {
          // 如果没有填写问卷
          if (this.userInfo.isNeedQuestion == 1) {
            this.$refs.Questionnaire.visible = true;
          }
          if (this.userInfo.days<=7) {
            this.$refs.vip.visible=true
          }
        }
      } else {
        this.$root.userInfo = {};
        this.$refs.login.visible = true;
      }
    },
    async handleLogout() {
      ipcUtil.setStore("token", null);
      this.$root.userInfo = {};
      this.userInfo.avatar = null;
      this.userInfo.username = null;
      await quit();
      this.$router.go(0);
    },
    handleLogin() {
      this.$refs.login.visible = true;
    },
    handleClose() {
      window.ipc.send("window-close", { child: this.disPlay });
    },
    handleMin() {
      window.ipc.send("window-min", { child: this.disPlay });
    },
    handleClickAbout() {
      this.$refs.setting.visible = true;
      this.$refs.setting.sidebarId = 4;
    },
    handleClickShare() {
      this.$refs.setting.visible = true;
      this.$refs.setting.sidebarId = 2;
    },
    handleClickSetting() {
      this.$refs.setting.visible = true;
      this.$refs.setting.sidebarId = 1;
    },
    handleClickDetail() {
      this.$refs.detail.visible = true;
    },
    handleClickVip() {
      this.$refs.vip.visible = true;
    },
    handleClickSafe() {
      this.$refs.safe.visible = true;
    },
    // 检测更新

    async handleClickChange() {
      this.$refs.setting.visible = true;
      this.$refs.setting.sidebarId = 3;
    },
    // 改变软件大小
    async sliderChange() {
      const sizeList = [
        {
          value: 40,
          size: "740*503",
        },
        {
          value: 50,
          size: "887*603",
        },
        {
          value: 60,
          size: "986*670",
        },
        {
          value: 70,
          size: "1233*838",
        },
        {
          value: 80,
          size: "1479*1005",
        },
        {
          value: 90,
          size: "1727*1173",
        },
        {
          value: 100,
          size: "1972*1340",
        },
      ];
      let val = sizeList.find((item) => item.value == this.size);
      const data = {
        w: val.size.split("*")[0],
        h: val.size.split("*")[1],
      };
      if (this.$route.name == "soundEffect") {
        await ipcUtil.setSize(data, "audio");
        localStorage.setItem("audioSize", val.value);
      } else if (this.$route.name == "chat") {
        await ipcUtil.setSize(data, "chat");
        localStorage.setItem("size", val.value);
      } else {
        await ipcUtil.setSize(data);
        localStorage.setItem("size", val.value);
      }
    },
    // 点击头像
    clickAvatar() {},
    // 换肤
    peeling() {
      this.$refs.Peeling.visible = true;
    },

    changeCss() {
      this.css = this.css == "theme" ? "night" : "theme";
      localStorage.setItem("css", this.css);
      const html = document.querySelector("html");
      html.setAttribute("data-v-css", this.css);
      ipcUtil.changeCss({ disPlay: this.disPlay });
    },
    changePeeling(css) {
      this.css = css;
    },
    // 进度条数组发生改变
    changList(length) {
      this.uploadNum = length;
    },
    clickUpload() {
      this.$refs.uploadDialog.changeShow();
    },
    clickTask() {
      this.$refs.task.visible = true;
    },
    conversion() {
      this.$refs.ConvertToFormat.dialogVisible = true;
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
    // 跳转官网
    clickLogo() {
      ipcUtil.openUrl("https://yuantiaoshi.com");
    },
    // 新手指引
    novice() {
      this.$refs.popover.doClose();
      if (this.$route.name=='home') {
        this.$bus.$emit("newcomerGuidance");
      }else if (this.$route.name=='audio') {
        this.$bus.$emit("newcomerGuidanceAudio");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dropdown {
  height: 36px;
}

.header {
  display: flex;
  align-content: center;
  width: 960px;
  height: 36px;
  box-sizing: border-box;
  background-color: var(--gbc);
  padding: 0 !important;
  color: var(--fc);
  .VipBox {
    font-size: 12px;
    .expire{
      line-height: 36px;
      width: 100px;
    }
  }
  .version {
    line-height: 36px;
    font-size: 12px;
    margin: 0 8px;
    -webkit-app-region: drag;
  }
  .logo {
    cursor: pointer;
    height: 36px;
    display: flex;
    align-items: center;
    margin-left: 8px;
    font-family: "仓耳舒圆体 W04" !important;
    /deep/ .el-image {
      width: 24px !important;
      height: 24px !important;
    }

    .name {
      margin-left: 12px;
      // width: ;
      font-size: 16px;
      font-weight: 500;
    }
  }
  .interval120 {
    width: 120px;
    height: 100%;
    -webkit-app-region: drag;
  }
  .block {
    width: 210px;
    height: 36px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      font-size: 10px;
      margin-top: 2px;
      // -webkit-app-region: drag;
    }
    /deep/ .el-slider {
      height: 36px;
      width: 180px;
      .el-slider__runway {
        // margin: 12px 0 !important;
      }
      .el-slider__button-wrapper {
        top: -16px;
      }
      .el-slider__button {
        width: 10px;
        height: 10px;
        border: 4px solid #409eff;
      }
    }
  }
  .interval170 {
    // min-width: 130px;
    flex: 1;
    height: 100%;
    -webkit-app-region: drag;
  }
  .interval80 {
    width: 80px;
    height: 100%;
    -webkit-app-region: drag;
  }

  .control {
    display: flex;
    background: var(--gbc);
    align-items: center;
    margin-right: 8px;
    // margin-top: 6px;
    .uploadLogs {
      height: 20px;
      margin: 4px;
      border-radius: 4px;
      color: #000;
      padding: 0 2px;
      font-size: 14px;
      cursor: pointer;
      background: #a0cfff;
    }
    .clickAvatar {
      box-sizing: border-box;
      width: 24px;
      border-radius: 50%;
      height: 24px;
      cursor: pointer;
      margin-top: 8px;
      margin-right: 4px;
      box-sizing: border-box;
      &:hover {
        border: 1px solid #a0cfff;
        border-radius: 50%;
      }
    }

    .username,
    .login {
      
      display: inline-block;
      text-align: left;
      height: 36px;
      line-height: 36px;
      margin-right: 5px;
      font-size: 16px;
      vertical-align: top;
      user-select: none;
      cursor: pointer;
    }
    .username {
      max-width: 107px;
      font-size: 13px;
      font-weight: 600;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
      -webkit-app-region: drag;
    }
    .icons {
      width: 116px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      .icon-lieri {
        font-size: 14px;
      }
      .close-small {
        font-size: 28px;
      }

      .sx {
        width: 2px;
        height: 10px;
        background: #ccc;
      }
      .icon {
        cursor: pointer;
        font-size: 20px;

        &:hover {
          color: #409eff;
        }
      }
    }

    .button {
      width: 20px;
      height: 20px;
      padding: 3px 0 5px;
      text-align: center;
      vertical-align: top;
      font-size: 22px;
      cursor: pointer;
      position: relative;
      .itemIcon {
        position: absolute;
        top: 0;
        right: 0px;
        width: 15px;
        height: 15px;
        line-height: 15px;
        font-size: 12px;
        background: red;
        display: inline-block;
        border-radius: 50px;
      }
      &:hover {
        // background-color: #cfcfcf;
        color: #a0cfff;
      }
    }
  }
}
</style>

<style lang="scss">
.header-dropdown,
.header2-dropdown {
  border: 2px #333333 solid !important;
  color: var(--fc) !important;
  background: var(--tgRight);

  .icon {
    color: var(--fc);
  }
  li {
    padding: 8px 20px !important;
    font-size: 14px !important;
    display: flex;
    justify-content: space-around;
    align-items: center;

    span {
      vertical-align: middle;
      display: inline-block;
      margin-left: 8px;
    }
  }

  .popper__arrow {
    &::after {
      top: 0px !important;
      border-bottom-color: #333333 !important;
    }
  }
}
.el-dropdown-menu__item {
  color: var(--fc) !important;
  &:hover {
    color: var(--buttonFc) !important;
    background: var(--action) !important;
  }
}
.header-popover {
  width: 175px !important;
  min-width: 100px !important;
  padding: 5px !important;
  top: 30px !important;
  border: 2px #969696 solid !important;
  border-radius: 8px !important;
  left: 770px !important;
  .button-list {
    position: relative;
    width: 100%;

    .item {
      display: inline-block;
      width: 50px;
      padding: 4px;
      border-radius: 5px;
      cursor: pointer;
      text-align: center;
      position: relative;
      color: var(--fc);

      &:hover {
        background-color: #eee;
        color: #000;
      }

      img {
        display: inline-block;
        height: 20px;
      }

      span {
        display: block;
        text-align: center;
        font-size: 12px;
      }
    }
  }

  .popper__arrow {
    left: 50% !important;
    &::after {
      top: 0px !important;
      border-bottom-color: #969696 !important;
    }
  }
}
</style>
