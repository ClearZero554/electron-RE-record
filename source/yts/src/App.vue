<template>
  <div>
    <div class="appBox">
      <el-container id="app" v-if="isShowHeader">
        <el-header>
          <Header ref="header"></Header>
        </el-header>
        <el-main>
          <el-scrollbar ref="scrollbar" :noresize="false">
            <keep-alive :include="['home']">
              <router-view />
            </keep-alive>
          </el-scrollbar>
        </el-main>
      </el-container>
      <div class="chat" id="chat" v-show="isShowHeader">
        <div
          class="chatBut"
          @click="openChat"
          v-show="isChatBut != '1'"
          ref="chatBut"
        >
          <div class="tip" v-show="totalNumber > 0"> {{ totalNumber }}</div>
          <div class="arrow">></div>
          <div class="onLine" v-if="isOnLine">在线</div>
          <div ref="chat" class="chatText">客服</div>
        </div>
      </div>
    </div>

    <el-container id="custom" v-if="!isShowHeader">
      <router-view />
    </el-container>
  </div>
</template>

<script>
import Header from "@/views/Header.vue";
import lodash from "lodash";
import { userOutline } from "@/api/index";
import ipcUtil from "@/ipc";
import axios from "axios";

export default {
  components: {
    Header,
  },
  data() {
    return {
      isNoMore: false, //是否触底
      innerHeight: 0,
      top: 0,
      isChatBut: "0", //是否显示了客服窗口
      isShowHeader: true, //是否显示头部
      isOnLine: false, //客服是否在线
    };
  },
  async mounted() {
    this.$router.onReady(() => {
      if (this.$route.path == "/speech" || this.$route.path == "/tip"||this.$route.path == "/download") {
        this.speechInit();
      } else if (
        this.$route.path == "/chat" ||
        this.$route.path == "/audio" ||
        this.$route.path == "/soundEffect"
      ) {
        this.isChatBut = "1";
      } else {
        this.homeInit();
      }
    });
    document.body.onkeydown = function (event) {
      var e = window.event || event;
      if (e.code === "Space") {
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          window.event.returnValue = false;
        }
      }
    };
    // 捕获报错
    window.onerror = function (message, source, lineno, colno, error) {
      ipcUtil.log("渲染进程捕获到全局错误:", error);
      let options = {
        method: "POST",
        url: "https://yts.yuantiaoshi.com:8880/api/logs/addObsLog",
        json: true,
        body: {
          key: store.get("token"),
          time: Date.now(),
          info: `[back] ${error}`,
        },
      };
      axios(options, (res) => {
        console.log("[ res ] >", res);
      });
      return false; // 阻止默认的错误处理行为
    };
  },
  computed: {
    totalNumber() {
      return this.$root.totalNumber;
    },
  },
  methods: {
    resize(e) {
      let innerHeight = e.target.innerHeight;
      if (e.target.innerHeight == 0 || innerHeight - this.innerHeight < 0) {
        this.innerHeight = innerHeight;
        return;
      }
      if (this.isNoMore) {
        this.$refs.scrollbar.wrap.scrollTop = 999;
        this.top = this.$refs.scrollbar.wrap.scrollTop;
        sessionStorage.setItem("top", this.top);
        this.innerHeight = innerHeight;
      }
    },
    // 打开客服窗口
    openChat() {
      let route = this.$router.resolve({
        path: "/chat",
      });
      let size = Number(localStorage.getItem("size")) || 60;
      const sizeList = [
        {
          value: 40,
          size: "493*335",
        },
        {
          value: 50,
          size: "740*503",
        },
        {
          value: 60,
          // size: "924*646",
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
      let val = sizeList.find((item) => item.value == size);
      const data = {
        w: val.size.split("*")[0],
        h: val.size.split("*")[1],
      };
      ipcUtil.openChat(route.href, data);
      this.isChatBut = this.isChatBut == "1" ? "0" : "1";
      sessionStorage.setItem("isChatBut", this.isChatBut);
    },
    // 初始化home
    homeInit() {
      this.$bus.$on("customerService", (e) => {
        console.log(this.$refs.chatBut);
        if (this.$refs.chatBut) {
          if (e == 0) {
            this.isOnLine = false;
            this.$refs.chatBut.style.color = "#ccc";
          } else {
            this.isOnLine = true;
            this.$refs.chatBut.style.color = "#409eff";
          }
        }
      });
      // 退出
      window.ipc.on("close", async (event) => {
        await userOutline();
      });
      this.top = sessionStorage.getItem("top") || 0;
      this.$refs.scrollbar.wrap.onscroll = () => {
        if (this.$refs.scrollbar.wrap.scrollTop) {
          let elscroll = new CustomEvent("elscroll", {
            detail: {
              top: this.$refs.scrollbar.wrap.scrollTop,
            },
          });
          window.dispatchEvent(elscroll);
        }
      };
      // 判断是否触底
      this.$refs.scrollbar.handleScroll = () => {
        var wrap = this.$refs.scrollbar.wrap;
        this.$refs.scrollbar.moveY = (wrap.scrollTop * 100) / wrap.clientHeight;
        this.$refs.scrollbar.moveX = (wrap.scrollLeft * 100) / wrap.clientWidth;
        let poor = wrap.scrollHeight - wrap.clientHeight;
        if (
          poor - parseInt(wrap.scrollTop) < 3 &&
          poor - parseInt(wrap.scrollTop) > -10
        ) {
          this.isNoMore = true;
        } else {
          this.isNoMore = false;
        }
      };
      // 监听屏幕变化
      window.onresize = lodash.throttle((e) => {
        this.resize(e);
      }, 10);
      window.ipc.on("chatType", () => {
        this.isChatBut = this.isChatBut == "1" ? "0" : "1";
        sessionStorage.setItem("isChatBut", this.isChatBut);
      });
      let isChatBut = sessionStorage.getItem("isChatBut");
      if (isChatBut != null) {
        this.isChatBut = isChatBut;
      }
      // 发请求使得后台使用人数准确
      setInterval(async () => {
        await this.$root.getUserInfo();
      }, 12 * 60 * 60 * 1000);
    },
    speechInit() {
      // 不显示客服按钮
      this.isChatBut = "1";
      this.isShowHeader = false;
    },
  },
  destroyed() {
    window.onresize = null;
  },
};
</script>

<style lang="scss">
.introjs-overlay{
  background: rgba($color: #000000, $alpha: 0.4);
  opacity: 0.4 !important;
  width: 960px;
  border-radius: 20px
}
@import "@/assets/font/iconfont.css";
@font-face {
  font-family: "仓耳舒圆体 W04";
  src: url("https://resource.yuantiaoshi.com/fonts/%E4%BB%93%E8%80%B3%E8%88%92%E5%9C%86%E4%BD%93%20W04.ttf");
}
@font-face {
  font-family: "jiyucho";
  src: url("https://resource.yuantiaoshi.com/fonts/jiyucho.ttf");
}
@font-face {
  font-family: "猫啃什锦黑";
  src: url("https://resource.yuantiaoshi.com/fonts/%E7%8C%AB%E5%95%83%E4%BB%80%E9%94%A6%E9%BB%91.ttf");
}
@font-face {
  font-family: "猫啃珠圆体";
  src: url("https://resource.yuantiaoshi.com/fonts/%E7%8C%AB%E5%95%83%E7%8F%A0%E5%9C%86%E4%BD%93.ttf");
}
.el-select-dropdown__list {
  background: var(--tgRight);
  border-radius: 9px;

}
.shortcutKeys-popover{
  color: var(--fc) !important;
}
// 新手指引
.introjs-tooltip-header {
  .introjs-skipbutton {
    font-size: 14px;
  }
}
.introjs-button{
  border-radius: 16px;
}
.introjs-tooltip{
  // border: 1px solid #000;
  border-radius: 16px;
}
.introjs-helperLayer{
  border-radius: 16px;
}
.el-image-viewer__mask,.el-image-viewer__canvas{
  width: 960px !important;
}
.introjs-tooltiptext {
  
  font-weight: 700;
}
.introjs-button {
  padding: 5px !important;
}
.icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-small {
  font-size: 24px;
  cursor: pointer;
}
.appBox {
  display: flex;
  width: 986px;
  .chat {
    width: 26px;
  }
  #custom {
    width: 100%;
    height: 100%;
  }
  #app {
    height: 670px;
    width: 960px;
    border-radius: 16px;
    background: var(--bgc);
    box-sizing: border-box;
    border: 3px solid #000;
    overflow: hidden;
  }
  .chatBut {
    width: 23px;
    height: 100px;
    border: 2px solid #000;
    box-sizing: border-box;
    border-left: none;
    text-align: center;
    background-color: var(--bgc);
    position: relative;
    margin-top: 50px;
    color: #409eff;
    border-bottom-right-radius: 35px;
    border-top-right-radius: 35px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 12px;
    .chatText {
    }
    .arrow {
      // margin-top: 16px;
    }
    .onLine {
      font-size: 8px;
      width: 30px;
      margin-bottom: 4px;
    }
    .tip {
      font-size: 10px;
      position: absolute;
      top: 0px;
      right: -4px;
      width: 20px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      border-radius: 50px;
      background: red;
      color: #fff;
    }
  }
  .soundEffectAction {
    background: #409eff;
  }
}
.el-popover{
  background: var(--tgRight) !important;
}
.el-popper{
  background: var(--tgRight) !important;
  
}
.el-select-dropdown {
  z-index: 9999 !important;
  border-radius: 9px;
  background: var(--tgRight) !important;
  .hover {
    background: var(--action) !important;
  }
  .el-select-dropdown__item {
    color: var(--fc) !important;
  }
}

.el-scrollbar {
  height: 100%;
  background: var(--bgc);

  .el-scrollbar__wrap {
    overflow-x: hidden;
  }

  .el-scrollbar__thumb {
    // 改变滚动条颜色
    background: #b2b2b2;
  }
}
.v-modal {
  border-radius: 16px !important;
  width: 960px !important;
}
.el-scrollbar__bar {
  width: 10px !important;
}
.v-modal,
.el-dialog__wrapper {
  height: 670px !important;
}
.el-dropdown-menu,.el-select-dropdown{
  border-radius: 9px !important;
}
.el-dialog {
  border-radius: 16px !important;
  background-color: var(--tgb) !important;

  .el-dialog__title,
  .el-dialog__body {
    color: var(--fc);
    background: var(--tgb);
    .close-small {
      color: var(--fc);
    }
  }
  .el-dialog__headerbtn {
    i {
      &::before {
        content: "";
      }
    }
  }
}
.el-loading-mask {
  background: var(--bgc) !important;
}

.el-message {
  left: 50%;
}

body .topLeft {
  left: 200px !important;
}
body .topRi {
  left: 700px !important;
}

html {
  font-family: Adobe Heiti Std, "Helvetica Neue", Helvetica, "PingFang SC",
    "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  height: 100%;
  user-select: auto;
}

body {
  margin: 0;
  height: 100%;
}

.el-header {
  height: 36px !important;
  width: 924px;
  padding: 0 !important;
  z-index: 100;
  flex: 0;
  box-sizing: border-box;

  .header {
    border-bottom: 1px solid #aaa;
  }
}

.el-main {
  padding: 0 !important;
  background: var(--bgc);
  width: 960px;
}

.el-scrollbar__wrap {
  overflow-x: hidden !important;
}

.is-horizontal {
  display: none;
}

.back {
  display: none;
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 10000;

  img {
    width: 100%;
    opacity: 0.5;
  }
}
// flex布局
.df {
  display: flex;
}
.jzs {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.jz {
  display: flex;
  justify-content: center;
  align-items: center;
}
html[data-v-css="theme"] {
  .el-dialog__headerbtn {
    background-image: url("@/assets/img/x.png");
    width: 38px;
    height: 37px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    top: 20px;
  }
}
html[data-v-css="night"] {
  .el-dialog__headerbtn {
    background-image: url("@/assets/img/bx.png");
    width: 38px;
    height: 37px;
    background-size: 70% 70%;
    background-repeat: no-repeat;
    top: 20px;
  }
}
</style>

<!-- Select -->
<style lang="scss">
.el-scrollbar__wrap {
  margin-bottom: 0 !important;
}
</style>
