<template>
  <el-dialog
    append-to-body
    width="50%"
    title="帐户安全"
    :visible.sync="visible"
    @open="handleOpen"
    @close="close"
  >
    <div class="setting" v-if="type == 1">
      <div class="left">
        <div class="title">账号安全</div>
        <div class="lab">
          <div>绑定手机号</div>
          <div>绑定微信号</div>
        </div>
      </div>
      <div class="right">
        <iconpark-icon
          name="close-small"
          class="close-small"
          @click="visible = false"
        ></iconpark-icon>
        <div class="phone">
          <div>{{ phone }}</div>
          <el-button size="mini" class="button" @click="changePhone"
            >更换手机</el-button
          >
        </div>
        <div class="phone phone1">
          <div>{{ wechat }}</div>
          <!-- <el-button
            size="mini"
            type="danger"
            class="logout"
            @click="logout"
            v-if="userInfo.isDelete == 0"
            >注销账号</el-button
          >
          <el-button
            size="mini"
            type="primary"
            class="logout"
            @click="revoke"
            v-if="userInfo.isDelete == 2"
            >撤销注销</el-button
          > -->
        </div>
      </div>
    </div>
    <div v-else-if="type == 2" class="setting">
      <div class="important">申请注销前请看完以下内容</div>
      <div class="text">1.申请注销后,7天后账号将会永久删除</div>
      <div class="text">2.申请注销后,7天内可在安全中心界面选择撤销注销账号</div>
      <div class="text">3.注销成功后,账号内所有虚拟物品将无法找回</div>
      <div class="text">4.注销成功后,账号将无法找回</div>
      <el-button
        type="danger"
        class="accountCancellation"
        @click="accountCancellation"
        >申请注销</el-button
      >
    </div>
    <sms ref="sms" @handleOpen="handleOpen"></sms>
  </el-dialog>
</template>

<script>
import { userInfo } from "@/api/user";
import Sms from "@/views/dialog/Sms.vue";
import { logout, cancelDelete } from "@/api/index";
import feedback from "@/utils/feedback";
import ipcUtil from "@/ipc";
export default {
  components: { Sms },
  data() {
    return {
      visible: false,
      phone: "未绑定手机号",
      wechat: "未绑定微信账号",
      type: 1,
    };
  },
  computed: {
    userInfo() {
      return this.$root.userInfo;
    },
  },
  methods: {
    handleOpen() {
      userInfo().then((res) => {
        if (res.data.code == 200) {
          this.phone = res.data.data.mobile || "未绑定手机号";
          this.wechat = res.data.data.isBindMnp ? "已绑定" : "未绑定微信账号";
        }
      });
    },
    changePhone() {
      this.$refs.sms.smscode = null;
      this.$refs.sms.mobile = null;
      this.$refs.sms.count = 60;
      this.$refs.sms.smscodeLabel = "获取验证码";
      this.$refs.sms.visible = true;
    },
    // 注销账号
    logout() {
      this.type = 2;
    },
    close() {
      this.type = 1;
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
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  height: 188px;
  width: 495px;
  border-radius: 18px;
  padding: 0;
  overflow: hidden;
  background: linear-gradient(
    to right,
    var(--tgLeft) 0%,
    var(--tgLeft) 100px,
    var(--tgRight) 100px,
    var(--tgRight) 100%
  ) !important;
}
::v-deep .el-dialog__header {
  display: none;
}
::v-deep .el-dialog {
  background: rgba($color: #000000, $alpha: 0) !important;
}

.setting {
  display: flex;
  .left {
    width: 100px;
    height: 188px;
    .title {
      font-size: 14px;
      font-weight: 700;
      margin: 16px;
    }
    .lab {
      margin-top: 38px;
      margin-left: 20px;
      font-size: 12px;
      div {
        margin-bottom: 12px;
      }
    }
  }
  .right {
    position: relative;
    .close-small {
      font-size: 26px;
      position: absolute;
      left: 350px;
      top: 16px;
    }
    .phone {
      margin-top: 72px;
      display: flex;
      align-items: center;
      font-size: 12px;
      margin-left: 28px;
      width: 320px;
      justify-content: space-between;
    }
    .phone1{
      margin-top: 8px;
    }
    .logout,.button{
      width: 56px;
      height: 20px;
      font-size: 10px;
      display: flex;
      align-items: center;
      justify-content: center;

    }
  }
}
</style>