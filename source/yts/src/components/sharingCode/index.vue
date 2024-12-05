<template>
  <el-dialog
    :title="'分享码(' + form.count + '个)'"
    :visible.sync="dialogVisible"
    :modal="false"
    width="75%"
    @open="open"
    
  >
   <div class="header">
      <div class="info">
        分享码列表
      </div>
      <iconpark-icon
        name="close-small"
        class="close-small"
        @click="dialogVisible = false"
      ></iconpark-icon>
    </div>
    <div class="form">
      <span>状态:</span>
      <div :class="form.status == 1 ? 'primary' : ''" @click="change('1')">
        有效未使用
      </div>
      <div :class="form.status == 2 ? 'primary' : ''" @click="change('2')">
        已使用
      </div>
      <div :class="form.status == 3 ? 'primary' : ''" @click="change('3')">
        过期
      </div>
      <span>时间:</span>
      <div :class="form.type == null ? 'primary' : ''" @click="changeTime(null)">
        全部
      </div>
      <div :class="form.type == 1 ? 'primary' : ''" @click="changeTime('1')">
        本月
      </div>
      <div :class="form.type == 2 ? 'primary' : ''" @click="changeTime('2')">
        本季度
      </div>
    </div>
    <el-table :data="list" style="width: 100%" ref="table">
      <el-table-column
        prop="expirationTime"
        label="到期时间"
        width="100"
        v-if="form.status != 2"
        :key="Math.random()"
      >
      </el-table-column>
      <el-table-column
        prop="receiverName"
        label="使用人"
        width="100"
        v-if="form.status == 2"
        :key="Math.random()"
      >
      </el-table-column>
      <el-table-column
        label="使用人头像"
        width="100"
        v-if="form.status == 2"
        :key="Math.random()"
      >
        <template slot-scope="scope">
          <el-avatar :size="size" :src="scope.row.receiverAvatar"></el-avatar>
        </template>
      </el-table-column>

      <el-table-column
        prop="code"
        label="分享码"
        min-width="180"
        :key="Math.random()"
      >
      </el-table-column>

      <el-table-column
        label="操作"
        width="100"
        v-if="form.status == 1"
        :key="Math.random()"
      >
        <template slot-scope="scope">
          <el-button @click="copy(scope.row.code)" type="primary" size="small"
            >复制</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="110"
        :key="Math.random()"
      >
      </el-table-column>
      <el-table-column
        prop="useTime"
        label="使用时间"
        width="100"
        v-if="form.status == 2"
        :key="Math.random()"
      >
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="form.count > 10"
      layout="prev, pager, next"
      class="text-center"
      :total="form.count"
      :page-size="form.pageSize"
      @current-change="(e) => currentChange(e)"
    ></el-pagination>
  </el-dialog>
</template>

<script>
import { membershipCode } from "@/api/article";
export default {
  name: "sharingCode",
  data() {
    return {
      dialogVisible: false,
      list: [],
      form: {
        status: "1",
        time: null,
        pageNo: 1,
        pageSize: 10,
        count: 0,
        type: null,
      },
    };
  },
  methods: {
    async open() {
      const res = await membershipCode(this.form);
      if (res.data.code == 200) {
        this.form.count = res.data.data.count;
        this.list = res.data.data.lists.map((item) => {
          return {
            ...item,
            status:
              item.status == 1
                ? "有效未使用"
                : item.status == 2
                ? "已使用"
                : "过期",
          };
        });
      }
    },
    change(e) {
      this.form.status = e;
      this.open();
      this.$nextTick(() => {
        //在数据加载完，重新渲染表格
        this.$refs["table"].doLayout();
      });
    },
    changeTime(e) {
      this.form.type = e;
      this.open();
    },
    copy(text) {
      navigator.clipboard.writeText(text);
      this.$message.success("复制成功");
    },
    currentChange(e) {
      this.form.pageNo = e;
      this.open();
    },
  },
};
</script>

<style lang="scss" scoped>
.form {
  margin-bottom: 8px;
  border-bottom: 1px solid #b2b2b2;
  display: flex;
  .primary{
    border-bottom: 2px solid #409eff;
  }
  div{
    width: 60px;
    font-size: 12px;
    margin-right: 24px;
    text-align: center;
    cursor: pointer;
  }
  span{
    display: inline-block;
    margin-right: 40px;
    font-size: 14px;
    font-weight: 700;
  }
}
::v-deep .el-dialog__header {
  display: none;
}
::v-deep .el-dialog {
  background: rgba($color: #000000, $alpha: 0) !important;
}
::v-deep .el-dialog__body {
  // height: 250px;
  width: 760px;
  border-radius: 9px;
  padding: 10px;
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
      font-size: 40px;
      cursor: pointer;
      position: absolute;
      right: 0px;
    }
  }
}
::v-deep .el-button--small {
  border-radius: 3px;
  width: 44px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #D9D9D9;
  border: none;
  color: #000;
}

::v-deep .is-scrolling-none,
::v-deep .is-scrolling-left {
  height: 350px !important;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom right, #b2b2b2 0%, #b2b2b2 100%);
    border-radius: 8px;
  }
}
::v-deep .text-center {
  text-align: center;
  display: block;
  height: 35px;
  line-height: 35px;
  position: absolute;
  bottom: 8px;
  left: -35px;
  width: calc(100% + 80px);
  .active {
    color: #409eff !important;
  }
  .btn-prev,
  .el-pager li,
  .btn-next {
    font-size: 22px;
    background-color: rgba(0, 0, 0, 0);
    height: 32px;
    width: 30px;
    line-height: 32px;
    background-size: 80% 80%;

    .number {
      font-weight: 700;
    }

    i {
      &::before {
        font-size: 16px;
      }
    }
  }
  .el-pager li {
    color: var(--fc);
  }
  .btn-prev {
    // background-image: url("@/assets/img/left.png");
    color: var(--fc);
  }
  .btn-next {
    color: var(--fc);
    // background-image: url("@/assets/img/ri.png");
  }
}
.box {
  width: 100%;
  height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px;
  box-sizing: border-box;
  background: var(--secondLevel);
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
    height: 60px;
    width: 100%;
    margin-bottom: 8px;
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
      width: 50px;
      height: 50px;
      margin: 5px 0 0 8px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .info {
      width: 350px;
      height: 60px;
      margin-left: 8px;
      position: relative;
      .createTime {
        position: absolute;
        right: 5px;
        top: 12px;
      }
      .name {
        margin-top: 8px;
        font-weight: 600;
        font-size: 16px;
      }
      .message {
        width: 100%;
        margin-top: 4px;
        height: 40px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2; /* 这里设置显示的行数 */
      }
    }
    .cover {
      width: 86px;
      height: 100%;

      /deep/ .el-image {
        width: 100%;
        height: 100%;
        border-radius: 8px;
      }
    }
  }
}
</style>
