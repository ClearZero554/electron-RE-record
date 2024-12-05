<template>
  <span>
    <video id="remote_video_element_id" ref="myVideo"></video>
    <video id="local_video_element_id" ref="callUserVideo"></video>
  </span>
</template>

<script>
import {callPlusClient } from "@/utils/rongIMLib";
import { getUserList } from "@/api/chat";
export default {
  name: "homeSpeech", //这个组件专门用来操作语音通话
  data() {
    return {
      speech: {
        //语音
        incomingCall: false,
        callId: null,
        callDuration: 0,
        callUser: null,
      },
    };
  },
  computed: {
    userInfo() {
      return this.$root.userInfo;
    },
  },
  mounted() {
    this.initIm(); //初始化语音
    this.hear(); //监听
  },
  beforeDestroy() {
    window.ipc.removeAll("answer");
    window.ipc.removeAll("hangUp");
    window.ipc.removeAll("changeMicrophone");
    window.ipc.removeAll("changeOutput");
    window.ipc.removeAll("initSpeech");
  },
  methods: {
    hear() {
      window.ipc.on("answer", this.answer);
      window.ipc.on("hangUp", this.hangUp);
      window.ipc.on("changeMicrophone", this.changeMicrophone);
      window.ipc.on("changeOutput", this.changeOutput);
      window.ipc.on("initSpeech", (e, data) => {
        console.log(data, "data");
        this.speech.callUser = data;
        if (
          this.speech.callUser.callId == "undefined" ||
          !this.speech.callUser.callId
        ) {
          // 拨打
          this.call();
        }
      });
    },
    // 初始化电话
    async initIm() {
      if (this.userInfo.id) {
        console.log(this.userInfo, "111111");
        RongIMLib.connect(this.userInfo.voiceToken).then(({ code, data }) => {
          // console.log(data, "data");
          if (code === RongIMLib.ErrorCode.SUCCESS) {
            console.log("connect success", data?.userId);
            this.initSpeech();
            return;
          }
          console.log(`connect error: ${code}`);
        });
      } else {
        requestAnimationFrame(this.initIm);
      }
    },
    // 初始化语音
    async initSpeech() {
      const that = this;
      // 注册 callPlus 业务层监听事件
      callPlusClient.setCallPlusEventListener({
        /**
         * 呼入通知
         * 收到呼入时，可选择接听或挂断通话
         * @param session 通话实例
         * @param extra  透传呼叫方发起呼叫时携带的附加信息
         */
        async onReceivedCall(session, extra) {
          /* if (that.speech.incomingCall) {
            // 说明正在通话,直接挂断对方
            const { code } = await callPlusClient.hangup(session.getCallId());
            console.log(`挂断通话结果, code: ${code}`);
            return;
          } */
          const res = await getUserList();
          if (res.data.code == 200) {
            that.speech.callUser = res.data.data.lists.find(
              (item) => item.fromUserId == session.getInviterUserId()
            );
          }
          that.speech.incomingCall = true;
          that.speech.callUser.callId = session.getCallId();
          console.log("[ 打来的人 ] >", that.speech.callUser);
          window.ipc.send("openSpeech", {
            ...that.speech.callUser,
            w: 350,
            h: 500,
          });
        },
        /**
         * 收到某个人的音频或视频可播放
         * 业务层可调 playMedia(userId, mediaType) 播放
         * 请务必根据用户 ID 和媒体类型对流进行判断，如果是本地采集的音频流，请不要在本端播放，避免造成回声或啸叫问题。
         *
         * @param userId 用户 id
         * @param mediaType 媒体类型
         */
        onUserMediaAvailable(userId, mediaType) {
          /**
           * 播放
           */
          callPlusClient.playMedia(userId, mediaType);
          window.ipc.send("receivedCallStart",{callStartTime:+new Date()})
        },
        /**
         * 通话计时开始
         */
        onReceivedCallStart(info) {
          console.log(`通话计时开始, startTime: ${info}`);
          
          /* that.speech.callDuration = Math.floor(
            (+new Date() - info.callStartTime) / 1000
          );
          setInterval(() => {
            callDuration++;
          }, 1000); */
        },
        /**
         * 通话结束（群组通话时，客户端挂断不代表通话结束）
         * @param session 通话实例
         * @param reason 通话结束原因
         */
        onCallEnded(session, reason) {
          console.log(
            `通话结束, callId: ${session.getCallId()}, reason: ${reason}`
          );
          that.speech.incomingCall = false;
          window.ipc.send("window-close", { child: 4 });
          feedback.msgSuccess("通话结束或用户忙");
        },
      });
    },
    // 接通
    async answer() {
      callPlusClient.setVideoView([
        {
          userId: this.speech.callUser.fromUserId,
          videoElement: document.getElementById("local_video_element_id"),
        },
        {
          userId: this.userInfo.id,
          videoElement: document.getElementById("remote_video_element_id"),
        },
      ]);
      const { code } = await callPlusClient.accept(this.speech.callUser.callId);
      // this.textType = "通话中...";
      console.log(`接听通话结果, code: ${code}`);
    },
    // 拒绝
    async hangUp() {
      console.log("挂断~");
      const { code } = await callPlusClient.hangup(this.speech.callUser.callId);
      console.log(`挂断通话结果, code: ${code}`);
    },
    // 切换麦克风设备
    async changeMicrophone(e, { deviceId }) {
      console.log("[ deviceId ] >", deviceId);
      // 切换融云的麦克风采集设备
      const res= await callPlusClient.switchMicrophone(deviceId)
      console.log(res,'res');
    },
    changeOutput(e, { deviceId }) {
      console.log(deviceId, "deviceId");
      console.log(this.$refs.callUserVideo,this.$refs.myVideo);
      // this.$refs.callUserVideo.setSinkId(deviceId);
      // this.$refs.myVideo.setSinkId(deviceId);
    },
    // 拨打
    call() {
      callPlusClient.setVideoView([
        {
          userId: this.speech.callUser.fromUserId,
          videoElement: document.getElementById("local_video_element_id"),
        },
        {
          userId: this.userInfo.id,
          videoElement: document.getElementById("remote_video_element_id"),
        },
      ]);
      callPlusClient.startCall([this.speech.callUser.fromUserId], 0, 0);
    },
  },
};
</script>

<style lang="scss" scoped>
span{
  width: 0;
  height: 0;
  position: absolute;
}
#remote_video_element_id,
#local_video_element_id {
  width: 0 !important;
  height: 0 !important;
}
</style>