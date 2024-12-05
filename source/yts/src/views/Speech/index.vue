<template>
  <div class="speech">
    <div class="header">
      <div class="drag"></div>
      <div class="buttons">
        <span class="button" @click="handleMin"
          ><i class="el-icon-minus"></i
        ></span>
        <span class="button" @click="handleClose"
          ><i class="el-icon-close"></i
        ></span>
      </div>
    </div>
    <div class="main">
      <div class="userInfo">
        <img :src="receiveUser.avatar" alt="" />
        <div>{{ receiveUser.nickname }}</div>
        <div>{{stateType}}</div>
      </div>
      <div class="operation">
        <div class="buts" v-if="!isAnswer">
          <el-button
            type="danger"
            icon="el-icon-switch-button"
            @click="hangUp"
            circle
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-phone"
            circle
            @click="answer"
          ></el-button>
        </div>
        <div class="buts" v-else>
          <el-button
            type="danger"
            icon="el-icon-switch-button"
            @click="hangUp"
            circle
          ></el-button>
          <Icon
            fontName="icon-yuyin"
            @mouseover="speechMouseover"
            @mouseout="speechMouseout"
          ></Icon>

          <!--  <Icon
            fontName="icon-yangshengqi"
            @mouseover="outputMouseover"
            @mouseout="outputMouseout"
          ></Icon> -->
        </div>
        <!-- 选择麦克风设备-->
        <div
          class="output"
          v-if="state.speechShow"
          @mouseover="speechMouseover"
          @mouseout="speechMouseout"
        >
          <div
            v-for="item in microphones"
            :key="item.deviceId"
            class="playerItem"
            :class="state.selectMicrophone == item.deviceId && 'action'"
            v-show="item.deviceId != 'communications'"
            @click="changeMicrophone(item)"
          >
            {{ item.deviceId == "default" ? "默认" : item.label }}
          </div>
        </div>
        <!-- 选择播放设备 -->
        <!-- <div
          class="output"
          v-if="state.outputShow"
          @mouseover="outputMouseover"
          @mouseout="outputMouseout"
        >
          <div
            v-for="item in speakers"
            :key="item.deviceId"
            class="playerItem"
            :class="state.selectOutput == item.deviceId && 'action'"
            v-show="item.deviceId != 'communications'"
            @click="changeOutput(item)"
          >
            {{ item.deviceId == "default" ? "默认" : item.label }}
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "speech", //语音
  data() {
    return {
      receiveUser: {}, //对方信息
      isAnswer: true, //是否接听
      microphones: [], //麦克风
      speakers: [], //输出设备
      callStartTime: 0,
      stateType:'正在呼出...',
      timer:null,
      state: {
        //状态
        speechShow: false, //是否显示选择麦克风的弹框
        speechTimer: null, //麦克风的定时器
        selectMicrophone: null, //选择麦克风设备id
        outputShow: false,
        outputTimer: null,
        selectOutput: null, //选择麦克风设备id
      },
    };
  },
  computed: {
    userInfo() {
      return this.$root.userInfo;
    },
  },
  mounted() {
    // 通过有没有callId分别是拨打还是接听
    this.receiveUser = this.$route.query;
    this.isShowAnswer();
    window.ipc.on("initSpeech", (e, data) => {
      this.receiveUser = data;
      this.isShowAnswer();
    });
    window.ipc.on("receivedCallStart", (e, data) => {
      this.stateType="已接通..."
    });
    this.init();
  },

  methods: {
    // 判断是否是接听还是拨打
    isShowAnswer() {
      if (this.receiveUser.callId != "") {
        this.stateType="呼入中..."
        // 接听
        this.isAnswer = false;
      } else {
        this.stateType="正在呼出..."
        // 拨打
        this.isAnswer = true;
      }
    },
    // 拨打
    call() {
      this.isAnswer = true;
      this.stateType = "正在呼出...";
    },
    // 初始化音频播放器
    async init() {
      this.microphones = await window.RCRTC.device.getMicrophones();
      this.state.selectMicrophone = this.microphones[0].deviceId;
      this.speakers = await window.RCRTC.device.getSpeakers();
      this.state.selectOutput = this.speakers[0].deviceId;
    },
    // 关闭窗口
    handleClose() {
      // 挂断电话
      window.ipc.send("hangUp");
      window.ipc.send("window-close", { child: 4 });
    },
    handleMin() {
      window.ipc.send("window-min", { child: 4 });
    },
    // 接通
    answer() {
      window.ipc.send("answer");
      this.isAnswer = true;
    },
    // 挂断
    async hangUp() {
      // 挂断电话
      window.ipc.send("hangUp");
      // 关闭窗口
      window.ipc.send("window-close", { child: 4 });
      this.isAnswer = false;
    },
    speechMouseover(e) {
      clearTimeout(this.speechTimer);
      this.state.speechShow = true;
    },
    speechMouseout(e) {
      // 如果800毫秒进入了选择框内则不让其消失
      this.speechTimer = setTimeout(() => {
        this.state.speechShow = false;
      }, 300);
    },
    // 切换麦克风设备
    async changeMicrophone(item) {
      this.state.selectMicrophone = item.deviceId;
      // 切换融云的麦克风采集设备
      window.ipc.send("changeMicrophone", { deviceId: item.deviceId });
      // 关闭选择弹框
      this.state.speechShow = false;
    },
    outputMouseover(e) {
      clearTimeout(this.outputTimer);
      this.state.outputShow = true;
    },
    outputMouseout(e) {
      // 如果800毫秒进入了选择框内则不让其消失
      this.outputTimer = setTimeout(() => {
        this.state.outputShow = false;
      }, 300);
    },
    // 切换输出设备
    async changeOutput(item) {
      this.state.selectOutput = item.deviceId;
      window.ipc.send("changeOutput", { deviceId: item.deviceId });
      // 关闭选择弹框
      this.state.outputShow = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.speech {
  width: 350px;
  height: 500px;
  border-radius: 16px;
  background: var(--bgc);
  color: var(--fc);
  border: 2px solid #000;
  box-sizing: border-box;
  .header {
    height: 28px;
    width: 100%;

    display: flex;
    .drag {
      display: inline-block;
      height: 28px;
      width: calc(100% - 80px);
      -webkit-app-region: drag;
    }
    .buttons {
      display: inline-block;
      .button {
        display: inline-block;
        width: 40px;
        height: 20px;
        padding: 3px 0 5px;
        text-align: center;
        vertical-align: top;
        font-size: 22px;
        cursor: pointer;
        &:hover {
          color: #a0cfff;
        }
      }
    }
  }
  .main {
    width: 100%;
    height: 462px;
    .userInfo {
      width: 100%;
      height: 300px;
      padding-top: 70px;
      display: flex;
      flex-direction: column;
      align-items: center;
      -webkit-app-region: drag;
      img {
        width: 120px;
        height: 120px;
        margin-bottom: 16px;
        border-radius: 8px;
      }
    }
    .operation {
      position: relative;
      .buts {
        width: 350px;
        height: 50px;
        display: flex;
        justify-content: space-around;
        /deep/ .el-button,
        .iconfont {
          width: 50px;
          height: 50px;
          font-size: 20px;
          cursor: pointer;
        }
        .iconfont {
          text-align: center;
          line-height: 50px;
          background: #ffffff;
          color: #000;
          border-radius: 50%;
        }
      }
      .player,
      .output {
        position: absolute;
        top: -150px;
        left: 10px;
        width: 200px;
        height: 140px;
        -webkit-app-region: no-drag;
        background: #2c2c2c;
        padding: 8px;
        border-radius: 8px;
        box-sizing: border-box;
        overflow: auto;
        &::-webkit-scrollbar {
          display: none;
        }
        .playerItem {
          width: 184px;
          height: 25px;
          line-height: 25px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          cursor: pointer;
          border-radius: 4px;
          &:hover {
            background: #1a1a1a;
          }
        }
        .action {
          background: #1a1a1a;
        }
      }
      .output {
        left: 140px;
      }
    }
  }
}
</style>