<template>
  <div class="home" ref="home">
    <!-- <el-button size="mini" @click="obs">操作obs</el-button> -->
    <!-- 轮播 -->
    <Carousel></Carousel>
    <div class="homeHeader">
      <debug ref="debug"></debug>
      <div id="start1">
        <div
          v-if="status == 0"
          class="start"
          :class="spareShow ? 'start4' : 'start0'"
        >
          <div class="block obs">
            <span class="status">obs 状态（{{ label.obsStatus }}）</span>
            <span class="version">版本&nbsp;&nbsp;{{ label.obsVersion }}</span>
          </div>
          <div class="block douyin">
            <span class="status">伴侣环境（{{ label.douyinStatus }}）</span>
            <span class="version"
              >版本&nbsp;&nbsp;{{ label.douyinVersion }}</span
            >
          </div>
          <el-tooltip
            class="item"
            effect="light"
            content="伴侣打开更新后建议点一次状态刷新"
            placement="bottom"
          >
            <div class="error" @click="error">
              <i class="el-icon-refresh-right"></i>
              <span>状态刷新</span>
            </div>
          </el-tooltip>
          <span
            class="control"
            @click="() => (spareShow ? alternativePlan() : handleStart(0))"
          >
            <span>{{ spareTitle }}</span>
            <span class="ps" v-if="!spareShow">{{ ps }}</span>
          </span>
          <span class="setting" @click="openPushFlowVisible = true">
            <img src="@/assets/home.png" />
            <span>推流码列表</span>
          </span>
          <!-- 快捷键 -->
          <div class="shortcutKeys">
            <div style="display: flex; align-items: center">
              <el-popover
                placement="bottom"
                width="200"
                trigger="click"
                popper-class="shortcutKeys-popover"
                content="开启后，直播伴侣开播后无需点击自动推流可开播"
              >
                <Icon
                  fontName="icon-wenhao1"
                  slot="reference"
                  class="icon-wenhao1"
                ></Icon>
              </el-popover>

              <el-switch
                class="shortcutKeysSwitch"
                v-model="shortcutKeysShow"
                :active-value="false"
                :inactive-value="true"
                inactive-text="自动操作"
                @change="switchChange"
              ></el-switch>
            </div>
            <div class="delay">
              <span>延迟启动</span>
              <el-select
                v-model="delay"
                popper-class="home-select"
                :disabled="shortcutKeysShow"
                size="mini"
                @change="delayChang"
              >
                <el-option label="1秒" :value="1"></el-option>
                <el-option label="2秒" :value="2"></el-option>
                <el-option label="3秒" :value="3"></el-option>
                <el-option label="4秒" :value="4"></el-option>
              </el-select>
            </div>
          </div>
          <div class="open">
            <el-switch
              v-model="open"
              ref="switch"
              :active-value="false"
              :inactive-value="true"
              inactive-text="一键打开软件"
              @change="handleOpenAllChange"
              v-if="!spareShow"
            ></el-switch>

            <div class="prompt" v-else>
              <div>ps：</div>
              <div>1.开播后点获取推流</div>
              <div>2.关闭伴侣(别点下播)</div>
              <div>3.点自动推流变成绿色就好了</div>
              <div>(没变成绿色可以重新自动推)</div>
            </div>
            <el-button
              type="primary"
              size="mini"
              v-if="spareShow"
              @click="openPushFlowVisible = true"
              >推流码</el-button
            >
          </div>
        </div>
        <div v-if="status == 3" class="start start3">
          <div class="block obs">
            <span class="status">obs 状态（{{ label.obsStatus }}）</span>
            <span class="version">版本&nbsp;&nbsp;{{ label.obsVersion }}</span>
          </div>
          <div class="block douyin">
            <span class="status">伴侣环境（{{ label.douyinStatus }}）</span>
            <span class="version"
              >版本&nbsp;&nbsp;{{ label.douyinVersion }}</span
            >
          </div>
          <el-tooltip
            class="item"
            effect="light"
            content="伴侣打开更新后建议点一次状态刷新"
            placement="bottom"
          >
            <div class="error" @click="error">
              <i class="el-icon-refresh-right"></i>
              <span>状态刷新</span>
            </div>
          </el-tooltip>
          <span class="control" @click="handleStart(0)" id="#step1">
            <span>自动推流</span>
            <span class="ps">PS：手动开播后等提示出现点自动推流</span>
          </span>
          <span class="setting" @click="openPushFlowVisible = true">
            <img src="@/assets/home.png" />
            <span>推流码列表</span>
          </span>
          <!-- 快捷键 -->
          <div class="shortcutKeys">
            <div style="display: flex; align-items: center">
              <el-popover
                placement="bottom"
                width="200"
                trigger="click"
                popper-class="shortcutKeys-popover"
                content="开启后，直播伴侣开播后无需点击自动推流可开播"
              >
                <Icon fontName="icon-wenhao1" slot="reference"></Icon>
              </el-popover>

              <el-switch
                class="shortcutKeysSwitch"
                v-model="shortcutKeysShow"
                :active-value="false"
                :inactive-value="true"
                inactive-text="自动操作"
                @change="switchChange"
              ></el-switch>
            </div>
            <!-- <div class="ps">PS:开启后，直播伴侣开播后无需点击自动推流可开播</div> -->
            <div class="delay">
              <span>延迟启动</span>
              <el-select
                v-model="delay"
                popper-class="home-select"
                :disabled="shortcutKeysShow"
                size="mini"
                @change="delayChang"
              >
                <el-option label="1秒" :value="1"></el-option>
                <el-option label="2秒" :value="2"></el-option>
                <el-option label="3秒" :value="3"></el-option>
                <el-option label="4秒" :value="4"></el-option>
              </el-select>
            </div>
          </div>
          <div class="open">
            <el-switch
              v-model="open"
              ref="switch"
              :active-value="false"
              :inactive-value="true"
              inactive-text="一键打开软件"
              @change="handleOpenAllChange"
              v-if="!spareShow"
            ></el-switch>
          </div>
        </div>
        <div v-else-if="status == 1" class="start start1">
          <div class="panel1">
            <p class="title">正在开播，请勿操作</p>
            <div class="item">
              <span class="label">服务器：</span>
              <el-input size="mini" v-model="live.rtmp"></el-input>
              <el-button size="mini" @click="copy(live.rtmp)">复制</el-button>
            </div>
            <div class="item">
              <span class="label">串流码：</span>
              <el-input size="mini" v-model="live.stream"></el-input>
              <el-button size="mini" @click="copy(live.stream)">复制</el-button>
            </div>
            <el-button class="bottom" @click="stop">停止操作</el-button>
          </div>
          <!-- <span class="setting">备用模式</span> -->
          <!-- 快捷键 -->
          <div class="shortcutKeys">
            <el-switch
              class="shortcutKeysSwitch"
              v-model="shortcutKeysShow"
              :active-value="false"
              :inactive-value="true"
              inactive-text="自动操作"
              @change="switchChange"
            ></el-switch>
            <div class="ps">
              PS:开启后，直播伴侣开播后无需点击自动推流可开播
            </div>
          </div>
          <el-switch
            class="open"
            v-model="open"
            :active-value="false"
            :inactive-value="true"
            inactive-text="一键打开软件"
            @change="handleOpenAllChange"
          ></el-switch>
        </div>
        <div v-else-if="status == 2" class="start start2">
          <div class="panel1">
            <p class="title">{{ title }}</p>
            <div class="item">
              <span class="label">服务器：</span>
              <el-input size="mini" v-model="live.rtmp"></el-input>
              <el-button
                size="mini"
                @click="copy(live.rtmp)"
                style="border-radius: 8px"
                >复制
              </el-button>
            </div>
            <div class="item">
              <span class="label">串流码：</span>
              <el-input size="mini" v-model="live.stream"></el-input>
              <el-button
                size="mini"
                @click="copy(live.stream)"
                style="border-radius: 8px"
                >复制
              </el-button>
            </div>
            <el-button class="bottom" @click="handleLeaveClick(0)"
              >返回
            </el-button>
          </div>
          <!-- <span class="setting">备用模式</span> -->
          <!-- 快捷键 -->
          <div class="shortcutKeys">
            <el-switch
              class="shortcutKeysSwitch"
              v-model="shortcutKeysShow"
              :active-value="false"
              :inactive-value="true"
              inactive-text="自动操作"
              @change="switchChange"
            ></el-switch>
          </div>
        </div>
        <!-- 备用模式 -->
        <div
          v-else-if="status == 9"
          class="start"
          :class="spareStatus == 0 ? 'start1' : 'start2'"
        >
          <div class="panel">
            <p class="title">{{ title }}</p>
            <div class="item">
              <span class="label">服务器：</span>
              <el-input size="mini" v-model="live.rtmp"></el-input>
              <el-button
                size="mini"
                @click="copy(live.rtmp)"
                style="border-radius: 8px"
                >复制
              </el-button>
            </div>
            <div class="item">
              <span class="label">串流码：</span>
              <el-input size="mini" v-model="live.stream"></el-input>
              <el-button
                size="mini"
                @click="copy(live.stream)"
                style="border-radius: 8px"
                >复制
              </el-button>
            </div>
            <el-button
              class="bottom"
              @click="backupStartBroadcasting"
              v-if="this.spareStatus == 0"
              >自动推流
            </el-button>
            <el-button class="bottom" @click="handleLeaveClick(0)"
              >返回
            </el-button>
          </div>
          <!-- <span class="setting">备用模式</span> -->
          <!-- 快捷键 -->
          <div class="shortcutKeys">
            <el-switch
              class="shortcutKeysSwitch"
              v-model="shortcutKeysShow"
              :active-value="false"
              :inactive-value="true"
              inactive-text="自动操作"
              @change="switchChange"
            ></el-switch>
          </div>
        </div>
      </div>
    </div>
    <Tabs
      v-if="!isSearch"
      ref="tabs"
      @change="
        (e) => {
          isSearch = !isSearch;
          search = e;
        }
      "
    ></Tabs>
    <Search
      v-else
      @change="isSearch = !isSearch"
      :keyWord="search"
      :virtualization="virtualization"
    ></Search>
    <Uninstall ref="uninstall"></Uninstall>
    <Update ref="update"></Update>
    <!-- 这个组件专门用来操作语音通话 -->
    <!-- <HomeSpeech></HomeSpeech> -->
    <!-- 推流码列表 -->
    <el-dialog
      title="推流码列表"
      :visible.sync="openPushFlowVisible"
      width="70%"
      custom-class="PushFlowVisible"
      @open="openPushFlow"
    >
     <div class="header">
      <div class="info">
        推流码列表
      </div>
      <iconpark-icon
        name="close-small"
        class="close-small"
        @click="openPushFlowVisible = false"
      ></iconpark-icon>
    </div>
      <div class="box">
        <div class="typeChange"></div>
        <div class="table">
          <div
            class="tableItem"
            v-for="(item, index) in openPush.list"
            :key="item.time"
          >
            <div class="venue">第{{ index + 1 }}场</div>

            <div class="pushFlow">
              <div class="item">
                <!-- <span class="label">服务器：</span> -->
                <el-input
                  size="mini"
                  disabled
                  :value="item.streamCode.split('stream')[0]"
                ></el-input>
                <el-button
                  size="mini"
                  @click="copy(item.streamCode.split('stream')[0])"
                  >复制</el-button
                >
              </div>
              <div class="item">
                <!-- <span class="label">串流码：</span> -->
                <el-input
                  size="mini"
                  disabled
                  :value="'stream' + item.streamCode.split('stream')[1]"
                ></el-input>
                <el-button
                  size="mini"
                  @click="copy('stream' + item.streamCode.split('stream')[1])"
                  >复制</el-button
                >
              </div>
            </div>
            <div class="importObs">
              <el-button
                type="primary"
                size="mini"
                @click="importObs(item.streamCode)"
                >导入OBS</el-button
              >
              <div class="time">{{ item.time }}</div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Uninstall from "@/views/dialog/Uninstall.vue";
import Update from "@/views/dialog/Update.vue";
import Tabs from "@/views/home/Tabs.vue";
import Debug from "@/views/home/Debug.vue";
import NoThreshold from "@/views/home/noThreshold.vue";
import ipcUtil from "@/ipc";
import { Message } from "element-ui";
import lodash from "lodash";
import drag from "@/components/drag/index";
import { keyboardProcessing } from "@/utils/index";
import feedback from "@/utils/feedback";
import Search from "@/views/search.vue";
import Carousel from "@/components/Carousel/index.vue";
import HomeSpeech from "@/views/Speech/components/HomeSpeech";

import { userObsStreamList } from "@/api/index";
import moment from "moment";
export default {
  name: "home",
  components: {
    Uninstall,
    Update,
    Tabs,
    Debug,
    drag,
    NoThreshold,
    Search,
    Carousel,
    HomeSpeech,
  },
  data() {
    return {
      tab: "1",
      tabList: [],
      value: null,
      shortcutKeysShow: true, //是否打开快捷键
      shortcutKeys: [], //快捷键
      contrastShortcutKeys: [], //对比的快捷键
      status: 0, // 0: 一键开播 1: 正在开播 2: 开播成功 4:零粉开播
      spareStatus: 0, //备用模式状态
      canStart: true,
      count: 0, // 公用计数器
      open: true,
      listenKeys: false,
      live: {
        rtmp: "",
        stream: "",
      },
      update: {
        version: "",
        progress: 0,
      },
      key: window.key,
      label: {
        obsStatus: "未识别",
        obsVersion: "",
        douyinStatus: "未识别",
        douyinVersion: "",
      },
      top: 0,
      spareShow: false, //是否为备用方案
      time: null,
      isFocus: false,
      customerServiceDisabled: true, // 禁用客服
      isChatShow: false, // 客服是否显示
      spareTitle: "自动推流",
      isSearch: false, //是否为搜索模式
      search: null, //搜索内容
      unreadCount: null, //未读消息
      interval: null, //定时器
      chatQuestions: [],
      title: "开播成功",
      ps: "PS：手动开播后等提示出现点自动推流",
      virtualization: false,
      chatNotifyList: [],
      delay: 1, //延迟
      openPushFlowVisible: false,
      openPush: {
        list: [],
        type: 1,
      },
      livingNum: 0, //查询是否开播计算
    };
  },
  watch: {
    "$root.obs.version": {
      handler(newValue, oldValue) {
        if (newValue != null) {
          this.updateLabel();
        }
      },
    },
    "$root.douyin.version": {
      handler(newValue, oldValue) {
        if (newValue != null) {
          this.updateLabel();
        }
      },
    },
    "$root.mediasdk.status": {
      handler(newValue, oldValue) {
        if (newValue != null) {
          this.updateLabel();
        }
      },
    },
    "$root.websocket.connect": {
      handler(newValue, oldValue) {
        if (newValue != null) {
          this.updateLabel();
        }
      },
    },
    "$route.query.keyword": {
      handler() {
        if (this.$route.query.keyword != undefined) {
          this.search = this.$route.query.keyword;
          this.isSearch = true;
        } else {
          this.isSearch = false;
        }
        // 判断是否为最后一页
        this.virtualization = this.$root.lastPage();
      },
    },
  },
  computed: {
    userInfo() {
      return this.$root.userInfo;
    },
  },
  activated() {
    // this.$parent.wrap.scrollTop = sessionStorage.getItem("top");
    this.$refs.tabs.remindUnreadCount();
  },
  async mounted() {
    await ipcUtil.getDisk();
    this.initRoot();
    this.$root.getLiveVersion();

    let size = localStorage.getItem("size");
    if (size) {
      const data = {
        w: size.split("*")[0],
        h: size.split("*")[1],
      };
      await ipcUtil.setSize(data);
      this.innerHeight = document.body.clientHeight;
    }
    this.shortcutKeysShow =
      localStorage.getItem("shortcutKeysShow") == "true" ? true : false;

    try {
      this.delay = Number(localStorage.getItem("delay") || 1);
    } catch (error) {
      console.log(error, "loc");
    }
    // 检查更新
    setTimeout(async () => {
      window.ipc.send("checkUpdate");
    }, 500);
    window.ipc.on("update", (event, version) => {
      this.$refs.update.visible = true;
      this.$refs.update.version = version;
    });

    window.ipc.on("updateProgress", (event, progressObj) => {
      this.$refs.update.progress = parseFloat(progressObj.percent.toFixed(1));
      this.$refs.update.bytes = parseFloat(
        (progressObj.bytesPerSecond / 1000 / 1000).toFixed(1)
      );
    });

    this.updateLabel();

    window.addEventListener("elscroll", lodash.throttle(this.handleScroll, 30));
    this.initWs(); //初始化聊天

    // 自动监听抖音伴侣是否开启直播
    this.$bus.$on("isLiving", () => {
      if (this.userInfo.id) {
        if (this.spareShow) {
          feedback.msgSuccess("检测到您开启的备用模式，请手动点击自动推流");
          return;
        }
        if (!this.shortcutKeysShow && this.status == 3) {
          setTimeout(() => {
            feedback.msgSuccess("检测到您已开播,已自动推流~");
            this.handleStart(0);
          }, this.delay * 1000);
        } else {
          feedback.msgSuccess("您未开启自动操作推流模式，请手动点击自动推流");
        }
      }
    });
    // 检测直播伴侣是否手动关播
    this.$bus.$on("closeLiving", async () => {
      // 关闭obs推流
      await this.$root.obsHandle.call("StopStream");

      // 重载页面
      window.ipc.send("reload");
    });
  },
  methods: {
    async initRoot() {
      this.livingNum++;
      try {
        if (this.$root.websocket.connect && this.livingNum % 2 == 0) {
          const streamingStatus = await this.$root.obsHandle.call(
            "GetStreamStatus"
          );
          if (streamingStatus.outputActive) {
            // 正在直播
            this.$root.obs.living = true;
          } else {
            this.$root.obs.living = false;
          }
        }
      } catch (error) {}
      await this.$root.loop();
      setTimeout(() => {
        this.initRoot();
      }, 500);
    },
    handleScroll(e) {
      sessionStorage.setItem("top", e.detail.top);
    },
    // v2
    error() {
      window.ipc.send("window-close", { child: 3 });
      // 循环任务
      ipcUtil.status();
      this.$root.mediasdk.status = false;
      this.updateLabel();
      ipcUtil.log("[error] " + this.key);
      this.$router.go(0);
      Message.success("状态已刷新");
    },

    // v2
    updateLabel() {
      if (this.$root.obs.version != null) {
        this.label.obsVersion = this.$root.obs.version;
        if (this.$root.websocket.connect == true) {
          this.label.obsStatus = "已连接";
        } else {
          this.label.obsStatus = "已识别";
        }
      } else {
        this.label.obsStatus = "未识别";
        this.label.obsVersion = "";
      }
      if (this.$root.douyin.version != null) {
        this.label.douyinVersion = this.$root.douyin.version;
        if (this.$root.mediasdk.status == true) {
          if (!this.spareShow && this.status != 1) {
            this.status = 3;
          }
          this.label.douyinStatus = "可以开播";
          if (this.$root.isBeginToShow) {
            window.ipc.send("changeIcon", { name: "logoR.png" });
          }
        } else {
          this.status = 0;
          this.label.douyinStatus = "已识别";
          if (this.$root.isBeginToShow) {
            window.ipc.send("changeIcon", { name: "blank.png" });
          }
        }
      } else {
        this.label.douyinStatus = "未识别";
        this.label.douyinVersion = "";
      }
    },

    // v2 点击一键开播
    async handleStart(task, rtmp_url) {
      // 是否为试用
      if (this.userInfo.isNewUserIn24h == 0) {
        // 是否为游客模式
        if (this.$root.store.isTourist == 0) {
          // 是否为会员
          if (this.userInfo.isMember == 0) {
            feedback.msgWarning("需要充值会员,才可以使用", {
              customClass: "topRi",
            });
            this.$bus.$emit("isShowVip");
            return;
          }
        }
      }

      if (!this.canStart) {
        this.status = 0;
        this.canStart = true;
        return;
      }
      // ipcUtil.log(`[Task] Task ${task} is running...`);
      // try {
      setTimeout(async () => {
        // 0: 是否安装OBS
        // 1: 获取推流码
        // 2: 关闭OBS
        // 3: 设置推流码
        // 4: 打开OBS
        // 5: OBS开播

        // newAlternativePlan
        let streamCode = rtmp_url ? rtmp_url : this.$root.douyin.rtmp_url;

        if (task == 0) {
          if (this.spareShow) {
            this.title = "obs设置推流码开播成功";
          } else {
            this.status = 1;
          }
          if (this.$root.obs.name == "" || this.$root.obs.name == null) {
            this.withoutObs();
            this.status = 0;
          } else {
            if (this.$root.obs.path == null) {
              feedback.msgWarning("OBS未安装、或重新安装");
              return;
            }
            if (this.$root.websocket.connect) {
              this.count = 0;
              this.handleStart(10, rtmp_url);
            } else {
              this.handleStart(1, rtmp_url);
              feedback.msgWarning("您未开启OBS,请稍等");
            }
          }
        } else if (task == 1) {
          this.live.rtmp = "";
          this.live.stream = "";
          if (streamCode != null) {
            let url = streamCode.split("stream");
            this.live.rtmp = url[0];
            this.live.stream = "stream" + url[1];
          }
          ipcUtil.log(
            `[GetLiveCode] rtmp: "${this.live.rtmp}", stream: "${this.live.stream}"`
          );
          if (this.live.rtmp == "" || this.live.stream == "") {
            if (this.count > 15) {
              this.count = 0;
              this.status = 0;
            } else {
              this.count = this.count + 1;
              this.handleStart(1, rtmp_url);
            }
          } else {
            this.count = 0;
            this.handleStart(2, rtmp_url);
          }
        } else if (task == 2) {
          if (this.$root.obs.pid > 0) {
            await ipcUtil.stopObs(this.$root.obs.pid);
          }
          this.handleStart(3, rtmp_url);
        } else if (task == 3) {
          if (this.$root.obs.pid > 0) {
            if (this.count > 50) {
              this.handleStart(2, rtmp_url);
            } else {
              this.count = this.count + 1;
              this.handleStart(3, rtmp_url);
            }
          } else {
            await this.setLiveCode();
            this.count = 0;
            this.handleStart(4, rtmp_url);
          }
        } else if (task == 4) {
          await ipcUtil.startObs(this.$root.obs.path);
          this.handleStart(5, rtmp_url);
        } else if (task == 5) {
          setTimeout(async () => {
            await this.start();
            this.status = 2;
            /* if (this.$root.isBeginToShow) {
              window.ipc.send('changeIcon', { name: 'logoL.png' });
            } */
          }, 5000);
        } else if (task == 10) {
          if (this.$root.websocket.connect == false) {
            if (this.count == 25) {
              feedback.msgWarning("OBS 未连接");
              this.live.rtmp = "";
              this.live.stream = "";
              if (streamCode != null) {
                let url = streamCode.split("stream");
                this.live.rtmp = url[0];
                this.live.stream = "stream" + url[1];
              }
              ipcUtil.log(
                `[GetLiveCode] rtmp: "${this.live.rtmp}", stream: "${this.live.stream}"`
              );
            }
            if (this.count > 50) {
              this.handleStart(2, rtmp_url);
            } else {
              this.count = this.count + 1;
              this.handleStart(10, rtmp_url);
            }
          } else {
            this.count = 0;
            this.handleStart(11, rtmp_url);
          }
        } else if (task == 11) {
          this.live.rtmp = "";
          this.live.stream = "";
          if (streamCode != null) {
            let url = streamCode.split("stream");
            this.live.rtmp = url[0];
            this.live.stream = "stream" + url[1];
          }
          ipcUtil.log(
            `[GetLiveCode] rtmp: "${this.live.rtmp}", stream: "${this.live.stream}"`
          );
          if (this.live.rtmp == "" || this.live.stream == "") {
            if (this.count > 15) {
              this.count = 0;
              this.status = 0;
            } else {
              this.count = this.count + 1;
              this.handleStart(11, rtmp_url);
            }
          } else {
            this.count = 0;
            this.handleStart(12, rtmp_url);
          }
        } else if (task == 12) {
          this.$root.rtmp.streamServiceSettings.server = this.live.rtmp;
          this.$root.rtmp.streamServiceSettings.key = this.live.stream;
          // ipcUtil.log('[task] ', JSON.stringify(this.$root.rtmp));
          await this.$root.obsHandle.call(
            "SetStreamServiceSettings",
            this.$root.rtmp
          );
          await this.$root.obsHandle.call("StartStream");
          this.status = 2;
          if (this.$root.isBeginToShow) {
            window.ipc.send("changeIcon", { name: "logoL.png" });
          }
        }
      }, 100);
    },

    // v2 一键打开软件被点击
    async handleOpenAllChange() {
      if (!this.open) {
        try {
          if (this.$root.obs.pid.length == 0) {
            await ipcUtil.startObs(this.$root.obs.path);
          }
          if (this.$root.douyin.pid == -1) {
            await ipcUtil.startDouyin(this.$root.douyin.path);
          }
        } catch (error) {}

        setTimeout(() => {
          this.open = true;
        }, 3000);
        return true;
      }
    },

    // v2 未安装OBS
    withoutObs() {
      this.$refs.uninstall.type = "obs";
      this.$refs.uninstall.visible = true;
    },
    withoutDouyin() {
      this.$refs.uninstall.type = "douyin";
      this.$refs.uninstall.visible = true;
    },

    stop() {
      ipcUtil.log("775");
      this.status = 0;
      this.canStart = false;
    },

    async handleLeaveClick(task) {
      if (this.spareStatus == 1) {
        this.spareStatus = 0;
        this.status = 9;
        return;
      }
      if (task == 0) {
        this.handleLeaveClick(1);
      }
      ipcUtil.log("790");
      this.status = 0;
      this.spareTitle = "获取推流";
      this.updateLabel();
    },

    copy(text) {
      navigator.clipboard.writeText(text);
      this.$message.success("复制成功");
    },

    /***************************************************************************************************************
     *
     * 工具类函数
     *
     **************************************************************************************************************/
    // 是否安装OBS
    async hasObs() {
      this.getZoom();
      let res = await window.ipc.invoke("hasObs");
      ipcUtil.log(
        `[HasObs] version: "${res.version}", path: "${res.path}", config: "${res.config}"`
      );
      if (res.name) {
        this.obs.name = res.name;
        this.obs.version = res.version;
        this.obs.path = res.path;
        this.obs.config = res.config;
      }
    },
    // 打开OBS
    async startObs() {
      if (this.$root.obs.path == "") {
        await this.hasObs();
      }
      await window.ipc.invoke("startObs", { path: this.$root.obs.path });
      await this.getObsStatus();
    },
    // OBS运行状态
    async getObsStatus() {
      let res = await window.ipc.invoke("V2_OBS_GetObsStatus", {
        path: this.$status.obs.path,
      });
      this.obs.pid = res;
    },
    // 关闭OBS
    async stopObs() {
      if (this.obs.pid.length == 0) {
        await this.getObsStatus();
      }
      if (this.obs.pid.length > 0) {
        await window.ipc.invoke("stopObs", { pid: this.obs.pid });
        this.obs.pid = [];
      }
    },
    // 是否安装直播伴侣
    async hasDouyin() {
      let res = await window.ipc.invoke("hasDouyin");
      ipcUtil.log(
        `[HasDouyin] version: "${res.version}", path: "${res.path}", config: "${res.config}"`
      );
      if (res.name) {
        this.douyin.name = res.name;
        this.douyin.version = res.version;
        this.douyin.path = res.path;
        this.douyin.config = res.config;
      }
    },
    // 打开直播伴侣
    async startDouyin() {
      if (this.douyin.path == "") {
        await this.hasDouyin();
      }
      await window.ipc.invoke("startDouyin", { path: this.douyin.path });
    },
    // 直播伴侣运行状态
    async getDouyinStatus() {
      let res = await window.ipc.invoke("getDouyinStatus");
      this.douyin.pid = res[0];
    },
    // 关闭直播伴侣
    async stopDouyin() {
      if (this.douyin.pid <= 0) {
        await this.getDouyinStatus();
      }
      if (this.douyin.pid != -1) {
        await window.ipc.invoke("stopDouyin", { pid: this.douyin.pid });
        this.douyin.pid = -1;
      }
    },

    async getLiveCode() {
      let res = await window.ipc.invoke("getLiveCode", {
        config: this.$status.douyin.config,
      });
      this.live.rtmp = res.rtmp;
      this.live.stream = res.stream;
    },
    // 开始直播
    async startLive() {
      await window.ipc.invoke("startLive");
    },
    // 设置推流码
    async setLiveCode() {
      await window.ipc.invoke("setLiveCode", {
        rtmp: this.live.rtmp,
        stream: this.live.stream,
        config: this.$root.obs.config,
      });
    },
    // 备用开播
    async backupStartBroadcasting() {
      this.title = "设置开播中";
      // 设置推流码
      // 开始直播
      await this.handleStart(0);
      this.spareStatus = 1;
    },
    // 开始直播
    async start() {
      await window.ipc.invoke("start");
    },
    // 查找并点击图片
    // async clickImage(name, winname, needClick = true) {
    //   return await window.ipc.invoke('clickImage', {
    //     name: name,
    //     winname: winname,
    //     needClick: needClick ? 'yes' : 'no',
    //   });
    // },
    // 设置缩放
    getZoom() {
      let ratio = 1,
        screen = window.screen,
        ua = navigator.userAgent.toLowerCase();
      if (window.devicePixelRatio !== undefined) {
        ratio = window.devicePixelRatio;
      } else if (~ua.indexOf("msie")) {
        if (screen.deviceXDPI && screen.logicalXDPI) {
          ratio = screen.deviceXDPI / screen.logicalXDPI;
        }
      } else if (
        window.outerWidth !== undefined &&
        window.innerWidth !== undefined
      ) {
        ratio = window.outerWidth / window.innerWidth;
      }
      // 设置缩放
      window.ipc.invoke("setConfig", { zoom: ratio * 100 });
    },
    // 假的input获得焦点
    async falseInput(e) {
      this.isFocus = true;
      // 注销所有快捷键
      ipcUtil.unregisterAll();
      this.$refs.falseInput.focus();
    },
    //快捷键获取焦点
    shortcutKeysFocus() {
      window.shortcutKeysCall = null;
      document.onkeydown = this.focus;
    },
    // 获得焦点
    focus(e) {
      // ctrl键
      let ck = e.ctrlKey;
      // Shift键
      let sf = e.shiftKey;
      let key = keyboardProcessing(e);
      if (!this.shortcutKeys.includes(key)) {
        if (key !== "Control" && key !== "Shift" && key !== "Process") {
          if (ck && sf) {
            this.shortcutKeys = ["Control", "Shift", key];
          } else if (ck) {
            this.shortcutKeys = ["Control", key];
          } else if (sf) {
            this.shortcutKeys = ["Shift", key];
          } else {
            this.shortcutKeys = [key];
          }
        } else {
          if (e.code.split("Key")[1]) {
            if (ck && sf) {
              this.shortcutKeys = ["Control", "Shift", e.code.split("Key")[1]];
            } else if (ck) {
              this.shortcutKeys = ["Control", e.code.split("Key")[1]];
            } else if (sf) {
              this.shortcutKeys = ["Shift", e.code.split("Key")[1]];
            } else {
              this.shortcutKeys = [e.code.split("Key")[1]];
            }
          }
        }
      }
      localStorage.setItem("shortcutKeys", this.shortcutKeys.join("+"));
    },
    // 失去焦点
    async shortcutKeysBlur() {
      this.isFocus = false;
      // 假的input也失去焦点
      document.onkeydown = null;
      await ipcUtil.registerKeys({
        keys: this.shortcutKeys.join("+"),
        isJson: true,
      });
      window.shortcutKeysCall = lodash.throttle(this.shortcutKeyCallback, 5000);
    },
    shortcutKeyCallback() {
      setTimeout(() => {
        this.handleStart(0);
      }, 3000);
    },
    // 清除事件
    shortcutKeysClear() {
      this.shortcutKeys = [];
      // 注销所有快捷键
      ipcUtil.unregisterAll();
      localStorage.removeItem("shortcutKeys");
    },
    // 点击备用方案
    spare() {
      this.spareShow = !this.spareShow;
      if (this.spareShow) {
        this.spareTitle = "获取推流";
        this.status = 0;
      } else {
        this.spareTitle = "自动推流";
        if (this.$root.mediasdk.status == true) {
          // 截流成功
          this.status = 3;
        } else {
          this.status = 0;
        }
      }
    },
    // 备用方案
    async alternativePlan() {
      console.log("[ 备用 ] >");
      if (this.spareTitle == "获取推流码中") {
        return;
      }
      this.spareTitle = "获取推流码中";
      try {
        await this.$root.checkDouyin();
        // 获取推流码
        this.live.rtmp = "";
        this.live.stream = "";
        if (this.$root.douyin.rtmp_url != null) {
          let url = this.$root.douyin.rtmp_url.split("stream");
          this.live.rtmp = url[0];
          this.live.stream = "stream" + url[1];
        }
        if (this.live.rtmp) {
          //设置推流码
          this.status = 9;

          this.spareTitle = "自动推流";
          this.title = "获取推流码成功";
        } else {
          this.spareTitle = "请开启直播";
          setTimeout(() => {
            this.spareTitle = "获取推流";
          }, 1000);
        }

        // this.judge();
      } catch (error) {
        this.spareTitle = "自动推流";
      }
    },
    // 客服被点击
    handlepaly() {
      if (this.$root.store.isTourist) {
        feedback.msgWarning("游客不能使用");
        return;
      }
      this.customerServiceDisabled = false;
      this.isChatShow = !this.isChatShow;
      this.$refs.debug.panel = false;
    },

    handleCustomerServiceHide() {
      this.customerServiceDisabled = true;
    },
    // 切换开启自动推流
    switchChange() {
      localStorage.setItem("shortcutKeysShow", this.shortcutKeysShow);
    },
    // 初始化ws
    initWs() {
      if (this.userInfo.id) {
        const getTotalNumberThrottle = lodash.throttle(
          this.$root.getTotalNumber,
          2000
        );

        this.$root.ws = new WebSocket(
          process.env.VUE_APP_API_WS + this.userInfo.id
        );
        this.$root.ws.onopen = () => {
          console.log("聊天通道已连接");
        };
        // 错误
        this.$root.ws.onclose = (e) => {
          // 重新请求
          setTimeout(() => {
            this.initWs();
          }, 100 + Math.floor(Math.random() * 5000));
        };
        // 接受到消息
        this.$root.ws.onmessage = async (res) => {
          // 收到消息发送给聊天窗口
          const data = JSON.parse(res.data);
          // 监听是否免费客服在线
          if (data.messageType == 3) {
            this.$bus.$emit("customerService", data.status);
            return;
          }
          ipcUtil.onmessage(data);
          getTotalNumberThrottle();
          let chatNotify = null;
          if (data.messageType == 1) {
            console.log(data, "data");
            window.ipc.send("openTip", {
              nickname: data.nickname,
              message: data.message,
              avatar: data.avatar,
            });
          } else if (data.messageType == 2) {
            window.ipc.send("openTip", {
              nickname: data.nickname,
              message: "[图片]",
              avatar: data.avatar,
            });
          }
          this.chatNotifyList.push(chatNotify);
        };
        // 发送消息
        window.ipc.on("sendWs", (e, data) => {
          getTotalNumberThrottle();
          this.$root.ws.send(JSON.stringify(data));
        });
      } else {
        requestAnimationFrame(this.initWs);
      }
    },

    // 改变启动延迟时间
    delayChang(e) {
      localStorage.setItem("delay", e);
    },
    // 推流窗口打开
    async openPushFlow() {
      const res = await userObsStreamList({
        type: this.openPush.type,
      });
      if (res.data.code == 200) {
        this.openPush.list = res.data.data.lists;
      }
      console.log("openPushFlow", res);
    },
    changeOpenFlow(type) {
      this.openPush.type = type;
      this.openPushFlow();
    },
    importObs(streamCode) {
      this.handleStart(0, streamCode);
      this.openPushFlowVisible = false;
    },
    async obs() {
      /*  console.log(await this.$root.obsHandle.call('CreateSceneItem',{
        sourceName:'源调试',
        sceneName:'场景'
      })); */
      /* console.log(await this.$root.obsHandle.call('GetInputSettings',{
        inputName: '发光测试'
      })); */
      /*  await this.$root.obsHandle.call('CreateInput', {
        sceneName: '场景',
        inputKind: 'image_source',
        inputName: '发光测试',
        
        inputSettings: {
          file: 'D:\\yuantiaoshi-hc\\image\\猫咪.GIF',
        },
      }); */
    },
  },
  beforeDestroy() {
    clearTimeout(this.time);
  },
};
</script>

<style>
.home-select {
  width: 100px;
  border-radius: 20px;
  overflow: hidden;
}

</style>

<style scoped lang="scss">
::v-deep .PushFlowVisible{
  .el-dialog__header {
    display: none;
  }
  .el-dialog {
    background: rgba($color: #000000, $alpha: 0) !important;
  }
  .el-dialog__body {
    // height: 250px;
    width: 691px;
    border-radius: 9px;
    padding: 16px;
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
        font-size: 24px;
        // cursor: pointer;
        // position: absolute;
        // right: 0px;
      }
    }
  }
}
.box {
  .typeChange {
    display: flex;
    font-size: 14px;
    font-weight: 600;
    div {
      margin: 0 8px;
      cursor: pointer;
      width: 40px;
      text-align: center;
      border-radius: 8px;
      height: 24px;
      line-height: 24px;
    }
    .action {
      background: #409eff;
    }
  }
  .table {
    height: 300px;
    background: var(--secondLevel);
    border-radius: 16px;
    margin-top: 8px;
    overflow: hidden;
    overflow-y: scroll;

    &::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
    &::-webkit-scrollbar-thumb {
      background: linear-gradient(to bottom right, #b2b2b2 0%, #b2b2b2 100%);
      border-radius: 8px;
    }
    &::-webkit-scrollbar-button {
      opacity: 0;
    }
    .tableItem {
      width: 100%;
      padding: 0 8px;
      height: 80px;
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      .venue {
        width: 50px;
      }

      .pushFlow {
        width: 450px;
        text-align: center;
        .item {
          margin-top: 10px;

          .label {
            display: inline-block;
            font-size: 14px;
            line-height: 28px;
          }

          .el-input {
            display: inline-block;
            width: calc(100% - 130px);
          }
          /deep/ .el-input__inner {
            color: #000 !important;
          }

          .el-button {
            margin-left: 10px;
          }
        }
      }
      .importObs {
        width: 80px;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-top: 16px;
        .time {
          width: 70px;
          margin-top: 16px;
        }
      }
    }
  }
}
.prompt {
  position: absolute;
  font-size: 12px;
  right: 70px;
  bottom: 3px;
  color: #000;
  width: 160px;
  text-align: left;
}

.customerService {
  font-size: 14px;
  cursor: pointer;

  img {
    width: 30px;
    height: 30px;
  }

  .notice {
    position: absolute;
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    background: red;
    border-radius: 10px;
    top: -2px;
    left: -2px;
    color: #fff;
    z-index: 10004;
  }
}

.customerServicePanel {
  height: 500px;
  width: 400px;
}

.isFocus {
  border: 2px solid #000 !important;
  box-sizing: border-box;
}

::v-deep .el-scrollbar__view {
  overflow: hidden;
}

//开关
::v-deep .el-switch__core {
  width: 40px !important;
  height: 20px !important;

  &::after {
    height: 18px;
    width: 18px;
    top: 0px;
  }
}

.more {
  display: block;
  font-size: 22px;
  margin-top: 20px;
  font-weight: 600;
  text-align: center;
  color: var(--fc);
}

.home {
  padding: 0 44px;
  width: 960px;
  box-sizing: border-box;
  background: var(--bgc);

  .homeHeader {
    display: flex;
    // margin: 0 15px;
    justify-content: space-between;
  }
}

.start0 {
  background-color: #fdc4b3;
}

.start3 {
  background-color: #fcf4b5;
}
.start4 {
  background-color: #e6e681;
}

.start1 {
  background-color: #fcf4b5;
}

.start2 {
  background-color: #b4feb3;
}

.start {
  position: relative;
  display: inline-block;
  width: 510px;
  height: 296px;
  text-align: center;
  vertical-align: top;
  border: 1px solid #909399;
  border-radius: 20px;
  box-sizing: border-box;

  .error {
    position: absolute;
    top: 9px;
    left: 10px;
    cursor: pointer;

    i {
      display: block;
      font-size: 40px;
    }

    span {
      position: relative;
      top: -4px;
      font-size: 12px;
    }
  }

  .block {
    position: absolute;
    top: 16px;
    width: 160px;
    text-align: left;

    .status {
      display: block;
      font-size: 15px;
      font-weight: 600;
      color: #000;
    }

    .version {
      font-size: 12px;
      color: #895d52;
    }
  }

  .obs {
    left: 110px;
  }

  .douyin {
    left: 280px;
  }

  .control {
    cursor: pointer;
    position: relative;
    top: 62px;
    display: inline-block;
    height: 148px;
    // width: 264px;
    width: 298px;
    line-height: 138px;
    font-size: 48px;
    border: 3px solid #521a0e;
    box-sizing: border-box;
    border-radius: 20px;
    color: #000;
    font-weight: 500;

    .ps {
      position: absolute;
      bottom: 16px;
      left: 0px;
      width: 100%;
      line-height: 14px;
      font-size: 14px;
      color: #986b5b;
    }

    &:hover {
      border: 3px solid #a0cfff;
      color: #a0cfff;
    }
  }
  .panel1 {
    position: relative;
    top: 50px;
    display: inline-block;
    height: 210px;
    width: 90%;

    .title {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 30px;
    }

    .item {
      margin-top: 10px;

      .label {
        display: inline-block;
        font-size: 14px;
        line-height: 28px;
      }

      .el-input {
        display: inline-block;
        width: calc(100% - 130px);
      }

      .el-button {
        margin-left: 10px;
      }
    }

    .bottom {
      margin-top: 30px;
      border-radius: 8px;
    }
  }
  .panel {
    position: relative;
    top: 10px;
    display: inline-block;
    height: 210px;
    width: 90%;

    .title {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 30px;
    }

    .item {
      margin-top: 10px;

      .label {
        display: inline-block;
        font-size: 14px;
        line-height: 28px;
      }

      .el-input {
        display: inline-block;
        width: calc(100% - 130px);
      }

      .el-button {
        margin-left: 10px;
      }
    }

    .bottom {
      margin-top: 30px;
      border-radius: 8px;
    }
  }

  .setting {
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 10px;
    user-select: none;
    font-size: 12px;

    img {
      height: 40px;
    }

    span {
      display: block;
    }
  }

  // 快捷键
  .shortcutKeys {
    position: absolute;
    bottom: 10px;
    left: 10px;
    width: 180px;
    display: flex;
    font-weight: 700;
    flex-direction: column;
    align-items: flex-start;
    color: #000;
    .icon-wenhao1 {
      margin-bottom: 8px;
    }
    .delay {
      display: flex;
      width: 200px;
      align-content: center;
      span {
        font-size: 13px;
        display: inline-block;
        width: 60px;
        line-height: 30px;
        margin-left: 18px;
        margin-right: 8px;
      }
      /deep/ .el-input__inner {
        width: 100px;
        height: 30px !important;
        border-radius: 8px;
        // border:1px solid #000;
      }
      /deep/ .el-select__caret {
        color: #000 !important;
      }
    }
    .ps {
      font-size: 10px;
      color: #966658;
      text-align: left;
      font-weight: 500;
      margin: 4px 0 0 8px;
    }

    .shortcutKeysSwitch {
      margin-bottom: 4px;
      width: 100%;
      height: 20px;

      /deep/ .el-switch__label {
        width: 60px;
        text-align: right;

        span {
          font-size: 13px !important;
        }
      }
    }

    .automaticPushFlow {
      display: flex;
      font-size: 13px;

      /deep/ .is-disabled {
        input {
          background-color: #dcdfe6 !important;
        }
      }

      /deep/ .el-input {
        border-radius: 16px;
        overflow: hidden;
        width: 120px;
        border: 2px solid #fdc4b3;
        box-sizing: border-box;
        /* input{
          ime-mode:disabled
        } */

        .el-input__inner {
          height: 28px;
          border: none;
          width: 120px;
        }
      }

      /* /deep/ .el-switch__label{
        font-size: 14px;
      } */
      .label {
        width: 60px;
        margin-right: 8px;
        line-height: 32px;
        text-align: right;
      }
    }

    /deep/ .el-switch__label {
      color: #000 !important;
      font-weight: 700;
    }
  }

  /deep/ .el-switch__label {
    color: #000 !important;
    font-weight: 700;
  }
}

.open {
  position: absolute;
  bottom: 10px;
  right: 26px;
  padding: 5px 5px 5px 8px;
  /deep/ .el-button--mini {
    margin-bottom: 8px;
    border-radius: 8px;
  }
  /deep/ .el-switch__label {
    color: #303133 !important;

    span {
      font-size: 16px !important;
    }
  }
}
</style>
