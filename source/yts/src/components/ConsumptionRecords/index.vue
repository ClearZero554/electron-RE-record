<template>
  <el-dialog
    :append-to-body="true"
    width="50%"
    :title="isInvoice ? '申请开票' : '消费记录'"
    @open="open"
    @close="close"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <div class="header">
      <div class="title">{{ isInvoice ? "申请开票" : "消费记录" }}</div>
      <iconpark-icon
        name="close-small"
        class="close-small"
        @click="visible = false"
      ></iconpark-icon>
    </div>
    <div class="box" v-if="!isInvoice">
      <div class="item" v-for="item in list" :key="item.orderId">
        <div class="type">
          <Icon
            fontName="icon-huiyuanjifen"
            v-if="item.orderType == 1"
            color="#ffc600"
          ></Icon>
          <Icon
            fontName="icon-sucaiku"
            v-if="item.orderType == 2"
            color="#f85959"
          ></Icon>
          <Icon fontName="icon-kefu" v-if="item.orderType == 3"></Icon>
          <Icon
            fontName="icon-jinbi"
            v-if="item.orderType == 4"
            color="#ffc600"
          ></Icon>
        </div>
        <div class="details">
          <div>
            <div class="title" v-if="item.orderType != 2">
              {{ item.name }}
            </div>
            <div class="title" v-else>{{ item.articleName }}</div>
            <div class="timeBox">
              <div class="time">{{ item.createTime }}</div>
              <div class="time" @click="invoiceIssuance(item)" v-if="item.inviolable==1">申请开票</div>
            </div>
          </div>
          <div class="money">
            {{ item.changeAmount }}
            <span>{{ item.payWay == 2 ? "元" : "金币" }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="box" v-else>
      <div class="boxList">
        <div class="boxItem">
          <div class="lab">订单编号:</div>
          <div class="text">{{ invoiceIssuanceObj.paySn }}</div>
        </div>
        <div class="boxItem">
          <div class="lab">开票金额:</div>
          <div class="text">
            ￥{{ Math.abs(invoiceIssuanceObj.changeAmount) }}
          </div>
        </div>
        <div class="hx"></div>
        <div class="boxItem">
          <div class="lab">发票类型:</div>
          <div class="text">增值税普通发票</div>
        </div>
        <div class="boxItem">
          <div class="lab">抬头类型:</div>
          <div class="text">
            <el-radio-group v-model="headingType">
              <el-radio :label="1">个人</el-radio>
              <el-radio :label="2">企业</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="boxItem">
          <div class="lab">发票抬头:</div>
          <div class="text">
            <el-input
              v-model="form.invoiceTitle"
              placeholder="请输入开票人抬头"
              size="mini"
            ></el-input>
          </div>
        </div>
     
        <div class="boxItem" v-show="headingType == 2">
          <div class="lab">税号:</div>
          <div class="text">
            <el-input
              v-model="form.taxId"
              placeholder="请输入您的税号"
              size="mini"
            ></el-input>
          </div>
        </div>
           <div class="boxItem">
          <div class="lab">邮箱地址:</div>
          <div class="text">
            <el-input
              v-model="form.mobile"
              placeholder="请输入您的邮箱"
              size="mini"
            ></el-input>
          </div>
        </div>
      </div>
      <div class="tip">
        温馨提示:您的发票通过申请后会通过邮箱发送给您，请耐心等待。请确保填写正确的发票抬头
        和收票地址信息，开票后如若有疑问，可联系客服。
      </div>
      <div class="hx"></div>
      <div class="button" @click="submit">提交申请</div>
    </div>

    <!-- <div v-else class="box">
      <div class="fromItem">
        <div class="lab">联系电话</div>
        <div class="content">
          <el-input
            size="small"
            v-model="form.mobile"
            placeholder="请输入联系电话"
          ></el-input>
        </div>
      </div>
      <div class="fromItem">
        <div class="lab">发票抬头</div>
        <div class="content">
          <el-input
            size="small"
            v-model="form.invoiceTitle"
            placeholder="请输入发票抬头"
          ></el-input>
        </div>
      </div>
      <div class="fromItem">
        <div class="lab">税号</div>
        <div class="content">
          <el-input
            size="small"
            v-model="form.taxId"
            placeholder="请输入税号"
          ></el-input>
        </div>
      </div>
    </div> -->
    <!-- <div slot="footer" class="dialog-footer" v-if="isInvoice">
      <el-button type="primary" @click="next" v-if="!isShowForm"
        >下一步</el-button
      >
      <el-button type="primary" @click="submit" v-else>提交</el-button>
    </div> -->
  </el-dialog>
</template>

<script>
import {
  consumptionRecordsList,
  notInvoiceList,
  applyInvoice,
} from "@/api/pay";
import { getDay } from "@/utils";
import feedback from "@/utils/feedback";
export default {
  name: "consumptionRecords",
  data() {
    return {
      visible: false,
      list: [],
      isInvoice: false,
      headingType: 1, //抬头类型
      invoiceIssuanceObj: {},
      form: {
        orderIds: "",
        invoiceTitle: "", //发票抬头
        taxId: "", //税号
        mobile: "", //手机号
      },
    };
  },
  methods: {
    async open() {
      const res = this.isInvoice
        ? await notInvoiceList()
        : await consumptionRecordsList();
      if (res.data.code == 200) {
        console.log("[ res.data ] >", res.data);
        this.list = res.data.data.map((item) => {
          return {
            ...item,
            name:
              item.orderType == 4
                ? `充值(${-item.changeAmount}金币)`
                : item.orderType == 3
                ? "客服咨询"
                : item.orderType == 6
                ? "推荐收益"
                : item.name,
            createTime: getDay(item.time * 1000),
          };
        });
      }
    },
    close() {
      Object.assign(this.$data, this.$options.data());
    },
    // 提交
    async submit() {
      this.form.orderIds = this.invoiceIssuanceObj.orderId;
      this.form.invoiceType=this.headingType
      const res = await applyInvoice(this.form);
      if (res.data.code == 200) {
        this.visible = false;
      }
    },
    invoiceIssuance(item) {
      console.log(item, "item");
      this.isInvoice = true;
      this.invoiceIssuanceObj = item;
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
  height: 390px;
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
}
.box {
  height: 314px;
  background: var(--tgn);
  border-radius: 9px;
  overflow-y: scroll;
  margin-top: 16px;
  padding-top: 10px;
  box-sizing: border-box;
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
  .boxList{
    height: 205px;
  }
  .item {
    height: 50px;
    display: flex;
    align-items: center;
    padding: 4px;
    // background: #FFFFFF;
    background: var(--tgb);
    margin-bottom: 8px;
    margin-left: 4px;
    border-radius: 9px;
    .type {
      height: 25px;
      width: 25px;
      margin-left: 8px;
      text-align: center;
      line-height: 25px;
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
      margin-left: 8px;
      width: 90%;
      height: 100%;
      box-sizing: border-box;
      align-items: center;
      display: flex;
      justify-content: space-between;

      // border-bottom: 1px solid var(--tgb);
      .title {
        font-size: 12px;
        margin-bottom: 4px;
        font-weight: 700;
      }
      .time {
        font-size: 8px;
        // color: #666666;
      }
      .timeBox {
        display: flex;
        align-items: center;
        .time {
          margin-right: 8px;
          cursor: pointer;
        }
      }
      .money {
        font-size: 12px;
        font-weight: 700;
        margin-right: 8px;
        line-height: 39px;
      }
    }
  }
  .boxItem {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    .lab {
      font-weight: 700;
      font-size: 12px;
      margin-left: 8px;
      width: 60px;
    }
    .text {
      font-size: 12px;
    }
    /deep/ .el-radio__label {
      font-size: 12px;
    }
  }
  .tip {
    margin-top: 18px;
    font-size: 10px;
    width: 450px;
    margin-left: 8px;
  }
  .hx {
    height: 1px;
    width: 450px;
    background: #d9d9d9;
    margin: 8px 0;
    margin-left: 8px;
  }
  .button {
    width: 72px;
    height: 24px;
    background: #0d99ff;
    color: #fff;
    border-radius: 3px;
    font-size: 12px;
    text-align: center;
    line-height: 24px;
    margin: 8px auto;
    cursor: pointer;
  }
}
.fromItem {
  width: 100%;
  margin-top: 8px;
  display: flex;
  align-items: center;
  .lab {
    width: 80px;
    text-align: right;
    margin-right: 8px;
  }
  .content {
    width: 240px;
    height: 40px;

    position: relative;
    /deep/ .el-textarea__inner {
      position: absolute;
      left: 360px;
      top: -165px;
      width: 485px;
    }
    /deep/ .el-upload {
      background-color: var(--virtualization);
    }
  }
}
</style>
