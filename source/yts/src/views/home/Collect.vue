<template>
  <div class="collect">
    <div class="close" @click="handleClose">
      <i class="el-icon-close"></i>
    </div>
    <div v-if="collectList.length == 0" class="empty">
      <span>暂时没有收藏</span>
    </div>
    <el-scrollbar v-else class="content">
      <vuedraggable
        v-model="collectList"
        animation="1000"
        @end="complete"
        ghostClass="ghostClass"
        filter=".unmover"
      >
        <transition-group class="box">
            <div
              class="boxItem"
              v-for="item in collectList"
              :key="item.articleId"
              @click="handleClickItems(item.articleId)"
            >
              <div class="closeItem" @click.stop="cancelCollection(item)">
                <i class="el-icon-close"></i>
              </div>
              <span class="title">{{ item.title }}</span>
              <el-image fit="cover" :src="item.image" :draggable="false"></el-image>
            </div>
        </transition-group>
      </vuedraggable>
    </el-scrollbar>
  </div>
</template>

<script>
import { collectList, collectCancel,collectResort } from "@/api/article";
import feedback from "@/utils/feedback";
import ipcUtil from "@/ipc";
import vuedraggable from "vuedraggable";
export default {
  components: { vuedraggable },
  watch: {
    "$parent.$parent.visible": {
      handler(newValue, oldValue) {
        if (newValue) {
          let token = ipcUtil.getStore("token");
          console.log(token);
          if (token) {
            this.init();
            this.$parent.$parent.zindex = 9999;
          } else {
            this.$parent.$parent.visible = false;
            this.$parent.$parent.zindex = 10;
            this.$parent.$parent.$refs.login.visible = true;
          }
        } else {
          this.$parent.$parent.zindex = 10;
        }
      },
    },
  },
  data() {
    return {
      collectList: [],
    };
  },
  methods: {
    init() {
      collectList({ pageSize: 1000 }).then((res) => {
        if (res.data.code == 200) {
          this.collectList = res.data.data.lists;
        }
      });
    },
    handleClose() {
      this.$parent.$parent.visible = false;
    },
    handleClickItems(id) {
      if (this.$parent.$parent.key == "detail") {
        this.$parent.$parent.getDetail(id);
        this.$parent.$parent.visible = false;
        this.$parent.$parent.zindex = 10;
      } else {
        this.$router.push(`/details/${id}`);
      }
    },
    // 取消收藏
    cancelCollection(item) {
      collectCancel({ articleId: item.articleId }).then((res) => {
        if (res.data.code == 200) {
          this.$notify({
            title: "成功",
            message: "取消收藏成功",
            type: "success",
          });
          this.init();
        } else {
          this.$notify.error({
            title: "失败",
            message: "取消收藏失败",
          });
        }
      });
    },
    // 拖动结束
   async complete() {
      const data = this.collectList.map((item, index) => {
        return {
          id:item.id,
          sortNo: index,
        };
      });
      await collectResort(data)
    }
  },
};
</script>

<style lang="scss" scoped>
.ghostClass {
  opacity: 0 !important;
}
.collect {
  height: 380px;
  width: 460px;

  .close {
    position: absolute;
    width: 32px;
    height: 32px;
    top: 5px;
    left: 5px;
    font-size: 18px;
    line-height: 32px;
    text-align: center;
    cursor: pointer;
    z-index: 20;

    &:hover {
      background-color: #eee;
      border-radius: 5px;
    }
  }

  .empty {
    span {
      height: 380px;
      width: 460px;
      display: block;
      line-height: 380px;
      text-align: center;
      font-size: 24px;
    }
  }
}
::v-deep .content {
  height: 364px;
  .box {
    margin-top: 12px;
    display: flex;
    flex-wrap: wrap;
    .boxItem {
      width: 206px;
      height: 162px;
      border-radius: 26px;
      overflow: hidden;
      box-sizing: border-box;
      position: relative;
      margin: 0 8px;
      .el-image {
        height: 162px;
        width: 205px;
        border: 1px #303133 solid;
        border-radius: 18px;
      }
      .title {
        position: absolute;
        top: 8px;
        left: 10px;
        max-width: calc(100% - 50px);
        z-index: 2;
        padding: 3px 10px;
        color: #fff;
        background-color: #333;
        font-size: 12px;
        border-radius: 15px;
        opacity: 0;
        z-index: 999;
      }
      &:hover .title {
        opacity: 1;
        transition: all 200ms linear;
      }
      .closeItem {
        position: absolute;
        width: 32px;
        height: 32px;
        right: 2px;
        font-size: 18px;
        line-height: 32px;
        text-align: center;
        cursor: pointer;
        z-index: 20;
        background-color: #eee;
        border-radius: 16px;
      }
    }
  }
}
/* ::v-deep .content {
  height: 364px;
  .box {
    margin-top: 12px;
    display: flex;
    flex-wrap: wrap;
    .boxItem {
      position: relative;
      margin: 0 8px;
      .el-image {
        height: 162px;
        width: 205px;
        border: 1px #303133 solid;
        border-radius: 18px;
      }
      .closeItem {
        position: absolute;
        width: 32px;
        height: 32px;
        right: 2px;
        font-size: 18px;
        line-height: 32px;
        text-align: center;
        cursor: pointer;
        z-index: 20;
        background-color: #eee;
        border-radius: 16px;

        &:hover {
        }
      }
    }
  }
} */
</style>