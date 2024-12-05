<template>
  <el-dialog
    :append-to-body="true"
    
    title=""
    @open="open"
    :visible.sync="visible"
    custom-class="login"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <div class="header">
      <div class="title">
        <iconpark-icon name="info" class="titleInfo"></iconpark-icon
        >微信登录与手机登录账号不是同一个
      </div>
      <iconpark-icon
        name="close-small"
        class="close-small"
        @click="visible = false"
      ></iconpark-icon>
    </div>
    <div class="main">
      <span class="protocol"
        >登录即同意<el-link type="primary" @click="handleProtocol"
          >《源调试用户协议》</el-link
        ></span
      >
      <div class="wechat">
        <div class="wechatTitle" v-if="!qrCode">微信扫码登录</div>
        <div @click="clickQrCode" class="touristClick" v-if="!qrCode">
          <div>鼠标单击生成</div>
          <div>微信登录二维码</div>
        </div>
        <wxlogin
          v-show="qrCode"
          appid="wx8bf802e415e74eab"
          scope="snsapi_login"
          theme="black"
          :redirect_uri="encodeURIComponent('https://yuantiaoshi.com')"
          class="qrcode"
        ></wxlogin>
      </div>

      <div class="touristBox" v-show="isTouristLogin">
        <div class="verticalLine"></div>

        <div class="touristLeft">
          <div class="wechatTitle">游客登录</div>
          <el-button
            size="small"
            @click="touristLogin"
            class="tourist"
            icon="el-icon-user"
            >游客登录</el-button
          >
          <div style="color: red; text-align: center; font-size: 12px">
            无法登录时使用游客登录
          </div>
        </div>
        <div class="touristRight" @click="isTouristLogin = false">
          <div class="right">
            <img src="@/assets/img/left.png" alt="" />
          </div>
          <div class="tip">手机号登录</div>
        </div>
      </div>
      <div class="account" v-show="!isTouristLogin">
        <div class="wechatTitle">手机账号登录</div>
        <el-input
          size="small"
          placeholder="请输入手机号"
          v-model="mobile"
        ></el-input>
        <el-slider
          v-model="slider"
          :show-tooltip="false"
          @change="sliderChange"
        ></el-slider>
        <div class="tip">移动可点击获取验证码</div>
        <div class="sendBox">
          <el-input
            size="small"
            class="send"
            v-model="smscode"
            placeholder="请输入验证码"
          >
          </el-input>
          <el-button
            type="primary"
            @click="handleGetSmscode"
            v-if="count == 120"
            :disabled="slider != 96"
            >{{ smscodeLabel }}</el-button
          >
          <el-button type="primary" v-else :disabled="true"
            >{{ count }}s</el-button
          >
        </div>

        <el-button size="small" @click="handleLogin">立即登录</el-button>
        <div
          style="
            color: red;
            text-align: center;
            font-size: 12px;
            margin-top: 16px;
            cursor: pointer;
          "
          @click="isTouristLogin = true"
        >
          使用游客登录
        </div>
      </div>
    </div>
    <div class="phoneLogin" @click="phoneLogin">
      <!-- 使用<span>{{ isTouristLogin ? "手机号登录" : "游客登录" }}</span> -->
    </div>

    <Protocol ref="protocol"></Protocol>
    <!-- 选择用户 -->
    <ChoiceUser
      ref="choiceUser"
      :userList="userList"
      @closeLogin="closeLogin"
    ></ChoiceUser>
  </el-dialog>
</template>

<script>
import Protocol from "@/views/dialog/Protocol.vue";
import wxlogin from "vue-wxlogin/src/components/vue-wxlogin.vue";
import ChoiceUser from "@/components/ChoiceUser";
import ipcUtil from "@/ipc";
import { verifyMobile } from "@/utils/tools";
import feedback from "@/utils/feedback";
import { sendSms } from "@/api/index";
import { mobileLogin, wxScanLogin, isTouristLoginShow } from "@/api/login";
import Intro from "@/utils/intro";
export default {
  components: {
    Protocol,
    wxlogin,
    ChoiceUser,
  },
  data() {
    return {
      slider: 3, //滑块
      visible: false,
      wechat: {
        qrcode: require("@/assets/qrcode.png"),
      },
      mobile: null,
      smscode: null,
      smscodeLabel: "获取验证码",
      count: 120,
      isTouristLogin: true,
      qrCode: false,
      userList: [],
    };
  },
  watch: {
    visible: {
      handler(val) {
        if (!val) {
          // Object.assign(this.$data, this.$options.data());
          // 关闭时如果没有token&& !this.$root.store.isUseTourist
          if (!ipcUtil.getStore("token") ) {
            window.ipc.send("window-close", { child: 0 });
          }
        }
      },
    },
  },
  mounted() {
    this.$bus.$on("newcomerGuidance", () => {
      this.newcomerGuidance(true);
    });
  },
  methods: {
    // 点击登录
    handleLogin() {
      if (!verifyMobile(this.mobile))
        return feedback.msgWarning("请输入正确的手机号");
      else if (this.smscode == null) return feedback.msgWarning("请输入验证码");
      else {
        mobileLogin({ mobile: this.mobile, code: this.smscode }).then((res) => {
          // console.log('[ res ] >', res)
          if (res.data.code == 200) {
            if (res.data.data.token == null) {
              // 走选择用户信息登录
              this.userList = res.data.data.users;
              this.$refs.choiceUser.visible = true;
            } else {
              ipcUtil.setStore("token", res.data.data.token);

              this.$root.getUserInfo();
              this.visible = false;
              // 新手指引
              this.newcomerGuidance();
            }
            window.ipc.send("window-close", { child: 3 });
          }
        });
      }
    },
    // 点击获取验证码
    handleGetSmscode() {
      console.log(this.count, "this.count");
      if (this.count != 120) {
        return;
      } else if (!verifyMobile(this.mobile))
        return feedback.msgWarning("请输入正确的手机号");
      else {
        sendSms({ mobile: this.mobile, scene: 101 }).then((res) => {
          console.log("[ res ] >", res);
          if (res.data.code == 200) {
            this.smscodeLabel = this.count + "秒";
            let countdown = setInterval(() => {
              this.count--;
              this.smscodeLabel = this.count + "秒";
              if (this.count <= 0) {
                this.smscodeLabel = "获取验证码";
                this.count = 120;
                this.slider = 3;
                clearInterval(countdown);
              }
            }, 1000);
          } else if (res.data.code == 300) {
            return feedback.msgWarning(res.data.msg);
          }
        });
      }
    },
    // 点击用户协议
    handleProtocol() {
      this.$refs.protocol.visible = true;
    },
    // 滑块改变
    sliderChange(e) {
      if (e != 100) {
        this.slider = 3;
      }
      if (e >= 96) {
        this.slider = 96;
      }
    },
    // 扫码登录初始化
    initWechatLogin() {
      ipcUtil.getWechatLoginCode((res) => {
        let code = new URLSearchParams(new URL(res.url).search).get("code");
        wxScanLogin({ code })
          .then((loginRes) => {
            if (loginRes.data.code == 200) {
              ipcUtil.setStore("token", loginRes.data.data.token);
              /*    window.ipc.send("setJsonToken", {
                path: "C:\\yts\\config.json",
                text: {
                  token: loginRes.data.data.token,
                },
              }); */
              this.$root.getUserInfo();
              // 新手指引
              this.newcomerGuidance();
              this.visible = false;
              window.ipc.send("window-close", { child: 3 });
            } else if (loginRes.data.code == 331) {
              feedback.msgWarning("您已被封禁,请联系管理员");
            }
          })
          .catch((e) => {
            console.log(e);
          });
      });
    },
    clickQrCode() {
      this.qrCode = true;
      this.initWechatLogin();
    },
    // 游客登录
    touristLogin() {
      return;
      if (!this.$root.store.isUseTourist) {
        feedback.msgWarning("现在不能使用游客登录");
        return;
      }
      // 开启游客登录
      this.$root.store.isTourist = true;
      this.visible = false;
      window.ipc.send("window-close", { child: 3 });
    },
    // 切换登录模式
    phoneLogin() {
      this.isTouristLogin = !this.isTouristLogin;
    },
    async open() {
      try {
        const rel = await isTouristLoginShow();
        if (rel.data.code == 200) {
          this.$root.store.isUseTourist = true;
        } else {
          this.$root.store.isUseTourist = false;
        }
      } catch (error) {
        // 开启游客模式
        this.$root.store.isUseTourist = true;
      }
    },
    closeLogin() {
      this.visible = false;
    },
    // 新手指引
    newcomerGuidance(type) {
      if (!localStorage.getItem("isShowHelp")) {
        // 配置
        this.$nextTick(() => {
          // 开始
          Intro.start();
        });
        // 退出引导回调函数
        Intro.onexit(function () {
          localStorage.setItem("isShowHelp", 1);
        });
        return;
      }

      if (type) {
        // Intro.exit();
        Intro.setOptions({
          steps: [
            {},
            {
              element: "#start1", // 目标元素
              intro:
                "自动推流,打开OBS、源调试、抖音直播伴侣,等待源调试变黄色,抖音直播伴侣开播就可以了", // 提示文本
              position: "left", // 提示位置
            },
            {
              element: "#debug",
              intro: "一键配置,可保存配置可一键调试",
              position: "top",
            },
            {
              element: "#course",
              intro: "音效软件,可设置快捷键,一键播放音乐",
              position: "top",
            },
            {
              element: "#tabs",
              intro: "素材中心",
              position: "top",
            },
            {
              element: "#userInfo",
              intro: "个人中心",
              position: "left",
            },
          ],
        });
        // 配置
        this.$nextTick(() => {
          // 开始
          Intro.start();
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.wechatTitle {
  margin-bottom: 16px;
  font-weight: 700;
  font-size: 16px;
}
::v-deep .el-dialog__header {
  display: none;
}
::v-deep .el-dialog {
  background: rgba($color: #000000, $alpha: 0) !important;
  width: 600px;
}
::v-deep .login {
  border-radius: 16px !important;
  overflow: hidden;
  background-color: #fff !important;
  z-index: 9999 !important;
  .el-dialog__body {
    color: #000;
    background: #fff;
    height: 384px;
    width: 600px;
    padding: 16px;
    box-sizing: border-box;
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
      box-sizing: border-box;
      width: 100%;
      height: 32px;
      font-weight: 700;
      .title {
        display: flex;
        align-items: center;
        font-size: 10px;
        .titleInfo {
          color: red;
          margin-right: 8px;
          font-size: 14px;
        }
      }
      .close-small {
        color: #000;
      }
    }
  }
  /*  .el-dialog__headerbtn {
    background-image: url("@/assets/img/x.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  } */
}
.verticalLine {
  height: 200px;
  border: 1px solid #ccc;
  background: #000;
  margin-right: 16px;
}
::v-deep .el-button--small {
  padding: 8px 15px !important;
}
/* ::v-deep .el-button {
  font-size: 14px !important;
} */
::v-deep .sendBox {
  display: flex;
  justify-content: center;
  width: 100%;
  .el-button--primary {
    width: 92px !important;
    height: 24px !important;
    padding: 8px 12px;
    font-size: 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #000;
    margin-left: 30px;
  }
  .is-disabled {
    background: #aad4ff !important;
  }
}
.info {
  position: relative;
  top: -10px;
  font-size: 12px;
  color: #909399;
}
.main {
  width: 100%;
  display: flex;
  justify-content: space-between;
  .verticalLine {
    height: 220px;
    border: 1px solid #ccc;
    background: #000;
    margin-right: 16px;
  }
  .touristBox {
    width: 55%;
    height: 200px;
    margin-top: 30px;
    display: flex;
    align-items: center;
    .touristRight {
      width: 25%;
      display: flex;
      align-items: center;
      cursor: pointer;
      margin-top: -30px;
      font-size: 12px;
      .right {
        // background-image: url("@/assets/img/left.png");
        width: 50px;
        height: 120px;
        img {
          width: 110%;
          height: 140%;
          margin-top: -10px;
        }
      }
      .tip {
        width: 10px;
        color: #409eff;
        margin-top: 24px;
      }
    }
    .touristLeft {
      width: 70%;
      display: flex;
      flex-direction: column;
      align-items: center;
      div {
        font-size: 16px;
      }
    }
    .tourist {
      width: 184px;
      height: 154px;
      line-height: 100px;
      text-align: center;
      background: #d9d9d9;
      border-radius: 8px;
      color: #000;
      margin-bottom: 16px;
      font-size: 12px !important;
    }
  }
}
.wechat {
  height: 260px;
  width: 40%;
  min-width: 180px;
  padding-top: 30px;
  text-align: center;
  vertical-align: top;
  display: flex;
  flex-direction: column;
  align-items: center;

  .touristClick {
    height: 184px;
    width: 184px;
    border-radius: 8px;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    color: #000;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: #d9d9d9;
  }
  .desc {
    img {
      height: 24px;
      width: 24px;
      margin-right: 5px;
    }

    span {
      display: inline-block;
      line-height: 24px;
      vertical-align: top;
    }
  }

  .qrcode {
    display: inline-block;
    width: 184px;
    height: 184px;
  }
}
::v-deep .account {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60%;
  padding-top: 36px;
  vertical-align: top;
  text-align: center;
  position: relative;
  .tip {
    position: absolute;
    top: 114px;
    left: 70px;
    color: #c0c4cc;
    font-size: 12px;
  }
  .el-slider__runway {
    height: 26px;
    width: 240px;
    box-sizing: border-box !important;
    border: 1px solid #000;
    border-radius: 3px;
    background: #fff;
    margin-top: 0 !important;
    margin-bottom: 14px !important;
  }
  .el-slider__bar {
    height: 24px;
    box-sizing: border-box;
    width: 100%;
    border: 1px solid #000;
    margin: 0px 0 0 -3px;
    // border-radius: 8px;
    // border-top-left-radius: 8px;
    // border-bottom-left-radius: 8px;
  }
  .el-slider__button-wrapper {
    top: 0px;
    height: 24px;
    border-radius: 3px;
    box-sizing: border-box;
  }
  .el-slider__button {
    height: 24px;
    border: 2px solid #dcdfe6;
    border-radius: 3px;
    box-sizing: border-box;
    width: 20px !important;
    background-image: url("@/assets/svg/icon--peizhi.svg");
    background-position: center center;
    background-size: 70% 70%;
    background-repeat: no-repeat;
  }
  .el-input__inner {
    max-width: 240px;
    height: 24px !important;
    margin-bottom: 14px;
    border: 1px solid #000;
    border-radius: 3px;
    font-size: 16px;
    padding: 0 18px;
    &::-webkit-input-placeholder {
      font-size: 12px;
    }
  }

  .send {
    cursor: pointer;
    user-select: none;
    width: 120px;
    /deep/ .el-input-group__append {
      padding: 0;
    }
  }

  .el-button {
    width: 100%;
    max-width: 240px;
    border-radius: 3px;
    color: #fff;
    box-sizing: border-box;
    font-weight: 600;
    background: #0d99ff;
  }
}
.protocol {
  display: inline-flex;
  position: absolute;
  bottom: 24px;
  right: 70px;
  // margin: 40px 0 0 30px;
  font-size: 10px;

  /deep/ .el-link--inner {
    font-size: 10px !important;
  }
}
.phoneLogin {
  position: absolute;
  bottom: 50px;
  right: 28px;
  font-size: 12px;
  span {
    color: #409eff;
    cursor: pointer;
  }
}
.login {
  font-size: 16px;
  .title {
    font-size: 18px;
    font-weight: 600;
    color: #000;
  }
  .text {
    font-size: 12px;
    font-weight: 600;
    margin-top: 4px;
    color: red;
  }
}
</style>

<style>
iframe {
  position: absolute;
  left: -20px;
  top: -5px;
  transform: scale(0.7);
}
</style>
