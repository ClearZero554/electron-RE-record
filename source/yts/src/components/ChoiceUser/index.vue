<template>
  <el-dialog
    append-to-body
    width="55%"
    title="账号选择"
    @open="open"
    @close="close"
    :visible.sync="visible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <div class="header">
      <div>选择账号</div>
      <iconpark-icon
        name="close-small"
        class="close-small"
        @click="visible = false"
      ></iconpark-icon>
    </div>
    <div class="box">
      <div
        class="item"
        v-for="item in userList"
        :key="item.id"
        @click="choice(item)"
        :class="choiceItem.id == item.id && 'action'"
      >
        <div class="type">
          <el-avatar :src="item.avatar"></el-avatar>
        </div>
        <div class="details">
          <div>
            <div class="title">
              {{ item.nickname }}
              
              <Icon
                fontName="icon-huiyuanjifen"
                :color="item.isMember == 1 && '#FFC600'"
              ></Icon>
              <div class="days">剩余会员时间:{{ item.days }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <el-button type="primary" @click="submit">确认</el-button>
    </div>
    <!-- <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">确认</el-button>
    </span> -->
  </el-dialog>
</template>

<script>
import { logByUserId } from "@/api/login";
import ipcUtil from "@/ipc";
export default {
  name: "choiceUser",
  props: ["userList"],
  data() {
    return {
      visible: false,
      choiceItem: {},
    };
  },
  methods: {
    open() {
      console.log(this.userList, "userList");
    },
    close() {},
    choice(item) {
      this.choiceItem = item;
    },
    async submit() {
      const res = await logByUserId({ id: this.choiceItem.id });
      ipcUtil.log("账号选择", res);
      if (res.data.code == 200) {
        await ipcUtil.setStore("token", res.data.data.token);
        await this.$root.getUserInfo();
        this.visible = false;
        this.$emit("closeLogin");
        window.ipc.send("window-close", { child: 3 });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.days{
  font-size: 12px;
}
::v-deep .el-dialog__header {
  display: none;
}
::v-deep .el-dialog {
  background: rgba($color: #000000, $alpha: 0) !important;
  width: 600px;
}
::v-deep .el-dialog__body {
  color: #000;
  background: #fff;
  height: 340px;
  width: 600px;
  border-radius: 9px;
  padding: 10px;
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
.footer {
  position: absolute;
  right: -40px;
  bottom: 20px;
}
.box {
  height: 200px;
  background: var(--secondLevel);
  border-radius: 16px;
  overflow-y: scroll;
  padding: 8px;
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
  .action {
    background: var(--action);
  }
  .item {
    height: 50px;
    display: flex;
    align-items: center;
    padding: 4px;
    border-radius: 16px;
    cursor: pointer;
    .type {
      height: 50px;
      width: 50px;
      text-align: center;
      line-height: 50px;
      .icon-huiyuanjifen {
        color: #ffc600;
      }
      .icon-sucaiku {
        color: #f85959;
      }
      .icon-jinbi {
        color: #ffc600;
      }
    }
    .details {
      margin-left: 32px;
      width: 80%;
      height: 100%;
      box-sizing: border-box;
      align-items: center;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid var(--tgb);
      .title {
        font-size: 16px;
        margin-bottom: 4px;
        font-weight: 600;
      }
      .time {
        font-size: 12px;
      }
      .money {
        font-size: 20px;
        font-weight: 600;
        margin-right: 8px;
        line-height: 39px;
      }
    }
  }
}
</style>