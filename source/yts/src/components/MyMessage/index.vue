<template>
  <el-dialog title="" :visible.sync="dialogVisible" width="50%" @open="open">
    <div class="header">
      <div class="title">全部消息</div>
      <iconpark-icon
        name="close-small"
        class="close-small"
        @click="dialogVisible = false"
      ></iconpark-icon>
    </div>
    <div class="typeBox">
      <div class="badgeBox">
        <div
          class="badge"
          :class="type == 1 ? 'action' : ''"
          @click="changeType(1)"
        >
          <div class="tip" v-if="unreadCountList[0]>0">{{ unreadCountList[0] }}</div>
          评论
        </div>
        <div
          class="badge"
          :class="type == 2 ? 'action' : ''"
          @click="changeType(2)"
        >
          <div class="tip" v-if="unreadCountList[1]>0">{{ unreadCountList[1] }}</div>
          @我
        </div>
      </div>
    </div>
    <div class="box">
      <div
        class="messageItem"
        v-for="item in list"
        :key="item.articleCommentId"
        @click="clickMessageItem(item)"
      >
        <div class="read" v-if="item.isRead == 0"></div>
        <div class="avatar">
          <img :src="item.fromUserAvatar" alt="" />
        </div>
        <div class="info">
          <div class="nameBox">
            <span class="name">{{ item.fromUserNickname }}</span>
            <span class="createTime">{{ item.createTime }}</span>
            <div class="tip" v-if="item.isRead == 0"></div>
          </div>
          <div class="message">
            {{ item.type == 1 ? "评论" : "回复" }}: {{ item.message }}
          </div>
        </div>
        <div class="cover">
          <el-image :src="item.image" fit="cover"></el-image>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { remindList, remindUnreadCountList } from "@/api/article";
export default {
  name: "myMessage",
  data() {
    return {
      dialogVisible: false,
      list: [],
      title: "",
      type: 1, //1 评论 2 @
      unreadCountList: [],
    };
  },

  methods: {
    async getRemindUnreadCountList() {
      const res = await remindUnreadCountList();
      console.log("[ res ] >", res);
      if (res.data.code == 200) {
        this.unreadCountList = res.data.data;
      }
    },
    async open() {
      await this.getRemindUnreadCountList();
      const res = await remindList({ type: this.type });
      console.log(res.data, "res.data");
      if (res.data.code == 200) {
        this.list = res.data.data.lists;
        this.title = "全部消息";
        setTimeout(() => {
          this.$emit("remindUnreadCount");
          this.$bus.$emit("remindUnreadCount");
        }, 1000);
      }
    },
    changeType(type) {
      this.type = type;
      this.open();
    },
    clickMessageItem(item) {
      if (item.cid == 9) {
        this.$router.push(
          `/details/${item.articleId}?isFont=1&articleCommentId=${item.articleCommentId}`
        );
      } else {
        this.$router.push(
          `/details/${item.articleId}?&articleCommentId=${item.articleCommentId}`
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__header {
  display: none;
}
::v-deep .el-dialog {
  background: rgba($color: #000000, $alpha: 0) !important;
}
::v-deep .el-dialog__body {
  height: 360px;
  width: 500px;
  border-radius: 9px;
  padding: 16px;
  box-sizing: border-box;
  .header {
    display: flex;
    justify-content: space-between;
    position: relative;
    .close-small {
      cursor: pointer;
      position: absolute;
      right: 0px;
    }
    .title {
      font-size: 14px;
      font-weight: 700;
    }
  }
  .typeBox {
    width: 100%;
    margin-top: 6px;
    .badgeBox {
      display: flex;
    }
    .badge {
      margin-right: 16px;
      font-size: 12px;
      cursor: pointer;
      position: relative;
      .tip{
        position: absolute;
        right: -14px;
        top: -7px;
        width: 16px;
        height: 16px;
        line-height: 16px;
        font-size: 10px;
        background: #F85959;
        color: #fff;
        border-radius: 50%;
        text-align: center;
      }
    }
    .action {
      color: var(--action);
    }
  }
}
.box {
  width: 100%;
  height: 279px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px;
  margin-top: 8px;
  box-sizing: border-box;
  background: var(--tgn);
  border-radius: 16px;
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
  .messageItem {
    height: 48px;
    width: 422px;
    background: var(--tgb);
    margin-bottom: 8px;
    border-radius: 9px;
    display: flex;
    cursor: pointer;
    position: relative;
    .read {
      position: absolute;
      left: 8px;
      top: 8px;
      width: 10px;
      height: 10px;
      background: red;
      border-radius: 50%;
    }
    .avatar {
      width: 36px;
      height: 36px;
      margin: 6px 8px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .info {
      width: 290px;
      height: 60px;
      margin-left: 8px;
      position: relative;

      .createTime {
        /* position: absolute;
        right: 5px;
        top: 12px; */
        font-size: 8px;
        // color: #666;
      }
      .nameBox {
        display: flex;
        align-items: center;
        margin-top: 8px;
        .tip {
          width: 10px;
          height: 10px;
          background: #f85959;
          border-radius: 50%;
          margin-left: 12px;
          margin-bottom: 4px;
        }
      }
      .name {
        // margin-top: 8px;
        font-weight: 700;

        font-size: 12px;
        width: 100px;
        display: inline-block;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 1; /* 这里设置显示的行数 */
      }
      .message {
        width: 100%;
        margin-top: 4px;
        font-size: 8px;
        // color: #666666;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2; /* 这里设置显示的行数 */
      }
    }
    .cover {
      width: 57px;
      height: 40px;
      margin: 4px 8px;
      /deep/ .el-image {
        width: 100%;
        height: 100%;
        border-radius: 9px;
      }
    }
  }
}
</style>
