<template>
  <!-- 评论 -->
  <div class="comment" ref="detailsMain">
    <div class="box">
      <div class="commentRecord">
        <div class="commentItem" v-for="item in list" :key="item.id">
          <el-avatar :src="item.fromUserAvatar"></el-avatar>
          <div class="main">
            <div class="title">
              <div class="nickname">{{ item.fromUserNickname }}</div>
            </div>
            <div class="context">
              <div>{{ item.message }}</div>
              <div v-if="item.picture" @click="enlarge(item.picture)">
                <el-image :src="item.picture" alt=""></el-image>
              </div>
            </div>
            <div class="action">
              <span class="reply" @click="reply(item)">回复</span>
              <span class="del" @click="del(item)" v-if="item.isDeletable === 1"
                >删除</span
              >
              <span class="createTime">{{ item.createTime }}</span>
            </div>

            <!-- 子回复 -->
            <template>
              <div class="sonMain">
                <!-- 普通回复 -->
                <div
                  class="commentItemSon"
                  v-for="(e, i) in item.children"
                  :key="e.id"
                  v-show="i + 1 <= item.openNum"
                >
                  <el-avatar :src="e.fromUserAvatar"></el-avatar>
                  <div class="cMain">
                    <div class="title">
                      <div class="nickname">
                        {{ e.fromUserNickname }}
                        <span class="reply" v-if="e.receiveUserNickname"
                          >@{{ e.receiveUserNickname }}</span
                        >
                      </div>
                    </div>
                    <div class="context">
                      <div>{{ e.message }}</div>
                      <div v-if="e.picture" @click="enlarge(e.picture)">
                        <el-image :src="e.picture" alt=""></el-image>
                      </div>
                    </div>
                    <div class="action">
                      <span class="reply" @click="reply(item, e)">回复</span>
                      <span
                        class="del"
                        @click="del(item, e)"
                        v-if="e.isDeletable === 1"
                        >删除</span
                      >
                      <span class="createTime">{{ e.createTime }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <div
              v-if="
                item.children.length > 0 && item.openNum < item.children.length
              "
              class="open"
              @click="item.openNum += 2"
            >
              -- 展开{{ item.children.length - item.openNum }}条回复
            </div>
          </div>
        </div>
        <div v-if="list.length==0" class="commentBottom"></div>
        <div class="bottom"></div>
        <div v-if="!isScroll" class="noMore">暂无更多评论~</div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="45%">
      <el-image style="width: 100%; height: 100%" :src="url"></el-image>
    </el-dialog>
  </div>
</template>

<script>
import feedback from "@/utils/feedback";
import { addComment, listByArticleId, del } from "@/api/comment";
import { debounce } from "lodash";
import moment from "moment";
export default {
  name: "comment",
  props: ["info", "id", "firstComment"],
  data() {
    return {
      comment: "", //评论
      tenantMessageInfo: {
        smsSign: "",
        sonComment: "",
        pid: 0,
        receiveUserId: null,
      },
      page: {
        pageSize: 10,
        pageNo: 0,
        count: 0,
      },
      list: [],
      isScroll: true,
      isShow: false,
      dialogVisible: false,
      url: "",
    };
  },
  computed: {
    placeholder() {
      return `觉得${this.info.title}怎么样~`;
    },
    userInfo() {
      return this.$root.userInfo;
    },
  },
  mounted() {
    if (this.firstComment) {
      this.firstComment.openNum = 1;
      if (this.firstComment.children.length > 0) {
        this.firstComment.openNum = 1;
      } else {
        this.firstComment.openNum = 0;
      }
      this.list.push({
        ...this.firstComment,
      });
      this.page.count = this.firstComment.sum;
    }
    this.init();
    this.$refs.detailsMain &&
      this.$refs.detailsMain.addEventListener("scroll", (e) => {
        const clientHeight = this.$refs.detailsMain.clientHeight;
        const scrollTop = this.$refs.detailsMain.scrollTop;
        const scrollHeight = this.$refs.detailsMain.scrollHeight;
        if (clientHeight + scrollTop - scrollHeight > -1) {
          this.init();
        }
      });
  },
  methods: {
    init: debounce(
      async function () {
        this.page.pageNo = this.page.pageNo + 1;
        const data = {
          articleId: Number(this.id),
          ...this.page,
        };

        if (this.isScroll) {
          const res = await listByArticleId(data);
          if (res.data.code == 200 && res.data.data.lists.length > 0) {
            res.data.data.lists.forEach((item) => {
              if (item.children.length > 0) {
                item.openNum = 1;
              } else {
                item.openNum = 0;
              }
              if (item.id !== this.firstComment.id) {
                this.list.push(item);
              }
            });
            this.page.count = res.data.data.count;
          } else {
            this.isScroll = false;
            // feedback.msgSuccess('暂无更多评论~');
          }
        }
      },
      1000,
      false
    ),
    async submit(type, message, picture) {
      if (message=='') {
        return
      }
      const data = {
        articleId: this.info.id,
        pid: type == 0 ? type : this.tenantMessageInfo.pid,
        receiveUserId: this.tenantMessageInfo.receiveUserId,
        message: message,
        picture,
      };
      console.log(this.tenantMessageInfo, "data");
      const res = await addComment(data);
      if (res.data.code == 200) {
        this.comment = "";
        // 本地插入
        res.data.data.isDeletable = 1;
        this.addComment(res.data.data);
      } else {
        feedback.msgWarning(res.data.msg);
      }
    },
    // 回复
    reply(item, e) {
      this.tenantMessageInfo.smsSign = e
        ? e.fromUserNickname
        : item.fromUserNickname;
      this.tenantMessageInfo.pid = item.id;
      this.tenantMessageInfo.receiveUserId = e ? e.fromUserID : item.fromUserID;
      this.tenantMessageInfo.sonComment = "";
      this.$emit("reply", this.tenantMessageInfo);
    },
    enlarge(url) {
      this.url = url;
      this.dialogVisible = true;
    },

    // 回到顶部
    goTop() {
      this.$emit("goTop");
    },
    // 删除
    async del(item, e) {
      const data = {
        id: e ? e.id : item.id,
      };
      const res = await del(data);
      if (res.data.code == 200) {
        if (!e) {
          this.page.count--;
        }
        this.list = this.list.filter((c) => {
          if (e) {
            c.children = c.children.filter((el) => el.id != e.id);
            return true;
          } else {
            return c.id !== item.id;
          }
        });
      }
    },
    // 本地插入
    addComment(data) {
      data = {
        children: [],
        fromUserAvatar: this.userInfo.avatar,
        fromUserNickname: this.userInfo.nickname,
        ...data,
      };
      data.createTime = moment().format("MM/DD");
      if (data.pid == 0) {
        // 插入一级
        this.list.unshift(data);
      } else {
        this.list.forEach((item) => {
          if (item.id == data.pid) {
            data.receiveUserNickname = this.tenantMessageInfo.smsSign;
            item.children.push(data);
          }
        });
      }
    },
    // 失焦绑定
    commentInputBlur() {
      this.$bus.$emit("binding");
    },
    // 聚焦解绑
    commentInputFocus() {
      this.$bus.$emit("unbind");
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  height: 308px;
  // overflow: scroll;
  .parameter {
    background: var(--carousel);
    width: 430px;
    margin-left: 16px;
    max-height: 150px;
    font-size: 12px;
    border-radius: 16px;
    padding: 8px;
    box-sizing: border-box;
  }
  .seizeASeat {
    width: 430px;
    margin-left: 16px;
    max-height: 150px;
    font-size: 12px;
    border-radius: 16px;
    padding: 8px;
    box-sizing: border-box;
  }
}
.comment {
  width: 100%;
  color: var(--fc);
  height: 305px;
  overflow-y: scroll;
  /* 滚动条样式 */
  &::-webkit-scrollbar {
    width: 3px; /* 滚动条的宽度 */
  }
  /* 滚动条轨道样式 */
  &::-webkit-scrollbar-track {
    background: #f1f1f1; /* 滚动条轨道的背景色 */
  }
  /* 滚动条滑块样式 */
  &::-webkit-scrollbar-thumb {
    background: #888; /* 滚动条滑块的颜色 */
    border-radius: 10px; /* 滑块的圆角 */
  }
  /* 当滑块悬停时 */
  &::-webkit-scrollbar-thumb:hover {
    background: #555; /* 悬停时的颜色 */
  }
  .commentInputBox {
    position: fixed;
    bottom: 40px;
    z-index: 999;
    background: var(--bgc);
    /deep/ .el-textarea__inner {
      height: 54px !important;
    }
  }
  .goTop {
    position: fixed;
    right: 50px;
    text-align: center;
    bottom: 100px;
    width: 40px;
    height: 40px;
    font-size: 14px;
    background: var(--tgb);
    border-radius: 8px;
    cursor: pointer;
    padding: 4px;
    color: var(--fc);
    &:hover {
      background: var(--action);
    }
  }
  .count {
    font-size: 24px;
    // margin: 4px 0;
    margin-bottom: 4px;
    font-weight: 600;
  }
  .submit {
    height: 54px;
    font-size: 18px;
    border-radius: 8px;
  }
  .commentInput {
    width: 500px;
    margin-right: 16px;
    /deep/ .el-textarea__inner {
      border-radius: 16px;
    }
  }
  .commentRecord {
    width: 100%;
    .commentBottom{
      height: 150px;
    }
    .bottom {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 262px;
      height: 40px;
      border-bottom-right-radius: 16px;
      border-bottom-left-radius: 16px;
      background: rgba($color: #fff, $alpha: 0.5);
      backdrop-filter: blur(1px);
    }
    .noMore {
      width: 100%;
      font-size: 12px;
      color: var(--fz);
      text-align: center;
    }
    .commentItem {
      display: flex;
      min-height: 60px;
      // margin-bottom: 16px;
      .open {
        font-size: 9px;
        margin-top: 2px;
        color: #999;
        cursor: pointer;
      }
      .main {
        width: 180px;
        margin-left: 16px;
        // border-bottom: 2px solid #ccc;
        padding-bottom: 8px;

        .title {
          display: flex;
          justify-content: space-between;
          .nickname {
            font-weight: 700;
            color: var(--fc);
            font-size: 12px;
            /*  .reply {
              font-size: 6px;
              color: #409eff;
            } */
          }
        }
        .context {
          margin-top: 8px;
          div {
            font-size: 10px;
          }
          /deep/ .el-image {
            width: 42px;
            cursor: pointer;
          }
        }
        .reply {
          margin-top: 8px;
          font-size: 10px;
          color: #409eff;
          cursor: pointer;
          width: 30px;
        }
        .del {
          margin-top: 8px;
          margin-left: 8px;
          font-size: 10px;
          color: #9fafbc;
          cursor: pointer;
          width: 30px;
        }
        .action {
          position: relative;
          width: 100%;
          .createTime {
            font-size: 10px;
            color: var(--fc);
            position: absolute;
            right: 0px;
            bottom: 3px;
          }
        }
      }
      .sonMain {
        border-radius: 16px;
      }
      .commentItemSon {
        display: flex;
        margin-top: 16px;
        /deep/ .el-avatar {
          width: 25px;
          height: 25px;
        }
        .cMain {
          width: 150px;
          margin-left: 8px;
        }
      }
      .commentInput {
        display: flex;
        width: 100%;
        .commentSonInput {
          width: 120px;
          // margin-left: 16px;
        }
        .submit {
          margin-left: 8px;
        }
      }
    }
  }
}
</style>
