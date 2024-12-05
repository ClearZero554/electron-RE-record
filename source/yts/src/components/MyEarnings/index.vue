<template>
  <el-dialog title="" :visible.sync="dialogVisible" width="90%" @open="open">
    <div class="header">
      <div class="title">我的收益</div>
      <iconpark-icon
        name="close-small"
        class="close-small"
        @click="dialogVisible = false"
      ></iconpark-icon>
    </div>
    <div style="display: flex">
      <div class="left">
        <div :class="timeType == 1 ? 'action' : ''" @click="bloggerEarnings(1)">
          全部
        </div>
        <div :class="timeType == 2 ? 'action' : ''" @click="bloggerEarnings(2)">
          本月
        </div>
        <div :class="timeType == 3 ? 'action' : ''" @click="bloggerEarnings(3)">
          本周
        </div>
        <div :class="timeType == 4 ? 'action' : ''" @click="bloggerEarnings(4)">
          今天
        </div>
        <div :class="timeType == 5 ? 'action' : ''" @click="bloggerEarnings(5)">
          选择时间
        </div>
      </div>
      <div class="right">
        <div class="info">
          <div style="opacity: 0;">销售量</div>
          <div class="infoItem">
            <div>个人收益</div>
            <div>{{ article.realEarnings||0 }}</div>
          </div>
          <div style="opacity: 0;">平台抽成</div>
        </div>
        <div class="info">
          <div class="infoItem">
            <div>销售量</div>
            <div>{{ article.earnings||0 }}</div>
          </div>
          <div class="infoItem">
            <div>销售收益</div>
            <div>{{ article.orderCout||0 }}</div>
          </div>
          
          <div class="infoItem">
            <div>平台抽成</div>
            <div>{{ article.rack||0 }}</div>
          </div>
        </div>
        <div class="selectTime" v-if="timeType == 5">
          <span class="label">选择查询收益时间:</span>
          <el-date-picker
            v-model="value"
            type="date"
            placeholder="选择日期"
            @change="pickerChange"
          >
          </el-date-picker>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { articleBloggerEarnings } from "@/api/chat";
export default {
  name: "MyEarnings",
  data() {
    return {
      dialogVisible: false,
      timeType: 1,
      article: {},
      value: null,
    };
  },
  methods: {
    async bloggerEarnings(type) {
      this.timeType = type;
      if (type == 5) {
        return;
      }
      const res = await articleBloggerEarnings({ type });
      console.log(res,'res');
      if (res && res.data.code == 200) {
        this.article = res.data.data||{};
      }
    },
    open() {
      this.bloggerEarnings(1);
    },
    async pickerChange(e) {
      const res = await articleBloggerEarnings({
        type: this.timeType,
        date: moment(e).format("YYYY-MM-DD"),
      });
      if (res && res.data.code == 200) {
        this.article = res.data.data;
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
  height: 340px;
  width: 872px;
  border-radius: 9px;
  padding: 0;
  box-sizing: border-box;
  background: linear-gradient(
    to right,
    var(--tgLeft) 0%,
    var(--tgLeft) 126px,
    var(--tgRight) 126px,
    var(--tgRight) 100%
  ) !important;
  .header {
    display: flex;
    justify-content: space-between;
    position: relative;
    padding: 16px;
    box-sizing: border-box;
    .close-small {
      cursor: pointer;
      position: absolute;
      right: 16px;
    }
    .title {
      font-size: 14px;
      font-weight: 700;
    }
  }
  .left {
    width: 126px;
    height: 100%;
    div {
      width: 126px;
      height: 30px;
      margin-top: 12px;
      text-align: center;
      cursor: pointer;
      line-height: 30px;
      font-weight: 700;
    }
    .action {
      background: #409eff;
      color: #fff;
    }
  }
  .right {
    margin-left: 149px;
  }
  .info {
    display: flex;
    width: 500px;
    justify-content: space-between;
    margin-bottom: 32px;
  }
  .selectTime {
    height: 100px;
  }
  .label {
    display: inline-block;
    width: 150px;
    text-align: right;
  }
  .infoItem {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 18px;
    div {
      margin-bottom: 8px;
      &:nth-child(2) {
        font-weight: 600;
        color: #f56c6c;
      }
    }
  }
  /deep/ .el-input--suffix {
    width: 264px !important;
  }
}
</style>
