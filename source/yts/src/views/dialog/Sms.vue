<template>
  <el-dialog
    append-to-body
    width="50%"
    title="更换手机号"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="setting">
      <div class="left">
        <div class="title">更换手机号</div>
        <div class="lab">
          <div>手机号</div>
          <div>验证码</div>
        </div>
      </div>
      <div class="right">
        <iconpark-icon
          name="close-small"
          class="close-small"
          @click="visible = false"
        ></iconpark-icon>
        <div class="phone">
          <el-input v-model="mobile" placeholder="请输入手机号"></el-input>
        </div>
        <div class="phone phone1">
          <el-input v-model="smscode"></el-input>
          <el-button
            size="mini"
            type="primary"
            class="logout"
            @click="handleGetSmscode"
            >{{ smscodeLabel }}</el-button
          >
        </div>
        <div class="submit">
          <el-button
            size="mini"
            type="primary"
            @click="modifyPhone"
            >修改</el-button
          >
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { verifyMobile } from "@/utils/tools";
import feedback from "@/utils/feedback";
import { sendSms, modify } from "@/api/index";

export default {
  data() {
    return {
      visible: false,
      mobile: null,
      smscode: null,
      smscodeLabel: "获取验证码",
      count: 60,
    };
  },
  mounted() {
    Object.assign(this.$data, this.$options.data());
  },
  methods: {
    // 点击获取验证码
    handleGetSmscode() {
      if (this.count != 60) return;
      else if (!verifyMobile(this.mobile))
        return feedback.msgWarning("请输入正确的手机号");
      else {
        sendSms({ mobile: this.mobile, scene: 103 }).then((res) => {
          if (res.data.code == 200) {
            this.smscodeLabel = this.count + "秒";
            let countdown = setInterval(() => {
              this.count--;
              this.smscodeLabel = this.count + "秒";
              if (this.count <= 0) {
                this.smscodeLabel = "获取验证码";
                this.count = 60;
                clearInterval(countdown);
              }
            }, 1000);
          } else if (res.data.code == 300) {
            return feedback.msgWarning(res.data.msg);
          }
        });
      }
    },
    async modifyPhone() {
      const data = {
        mobile: this.mobile,
        code: this.smscode,
      };
      const res = await modify(data);
      if (res.data.code == 200) {
        this.$root.getUserInfo();
        Object.assign(this.$data, this.$options.data());
      } else {
        feedback.msgWarning(res.data.msg);
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
    background: var(--tgn);
    .title {
      font-size: 14px;
      font-weight: 700;
      margin: 14px;
    }
    .lab {
      margin-top: 38px;
      margin-left: 20px;
      font-size: 12px;
      div {
        margin-bottom: 18px;
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
      cursor: pointer;
    }
    .phone {
      margin-top: 68px;
      display: flex;
      align-items: center;
      font-size: 12px;
      margin-left: 28px;
      width: 320px;
      // justify-content: space-between;
    }
    .phone1 {
      margin-top: 8px;
      .logout {
        width: 66px;
        height: 20px;
        margin-left: 16px;
      }
      /deep/ .el-input__inner,
      .el-input {
        height: 24px !important;
        width: 84px;
        border-radius: 3px;
      }
    }
    .logout,
    .button {
      width: 56px;
      height: 24px;
      font-size: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .submit{
      display: flex;
      justify-content: flex-end;
    }
  }
}

::v-deep .el-input__inner {
  height: 24px !important;
  border-radius: 3px;
}
</style>