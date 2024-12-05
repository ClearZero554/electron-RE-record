<template>
  <el-dialog
    append-to-body
    :show-close="false"
    custom-class="vip"
    @close="close"
    :visible.sync="visible"
    @open="handleOpen"
    width="50%"
  >
    <div class="header">
      <div class="info">
        <img :src="userInfo.avatar" alt="" class="avatar" />
        <div class="text">
          <div style="display: flex">
            <div class="nickName">{{ userInfo.nickname }}</div>
            <div class="vipType" >
              <VipBox :time="false"></VipBox>
            </div>
            
          </div>
          <div class="money">
            剩余会员：
            <span class="memberExpirationTime">{{
              userInfo.memberExpirationTime
            }}</span>
            现有金币：
            <span style="color: #efc313">{{ userInfo.money }}</span>
          </div>
        </div>
      </div>
      <iconpark-icon
        name="close-small"
        class="close-small"
        @click="visible = false"
      ></iconpark-icon>
    </div>
    <div style="display: flex">
      <div class="main" :class="isVip ? '' : 'mainAction'">
        <div class="type">
          <div
            class="vipRecharge"
            :class="isVip ? 'action' : ''"
            @click="change(true)"
          >
            会员充值
          </div>
          <div
            class="goldCoinsRecharge"
            :class="isVip ? '' : 'goldBoxAction'"
            @click="change(false)"
          >
            金币充值
          </div>
        </div>
        <div class="rechargeOptions">
          <template v-if="isVip">
            <div
              class="rechargeOptionsItem"
              :class="moneyType.id == item.id ? 'action' : ''"
              v-for="item in list"
              :key="item.id"
              @click="vipChange(item)"
            >
              <!-- <div class="market">{{ item.tip }}</div> -->
              <div class="mainInformation">
                <div class="vipType">{{ item.name }}</div>
                <div class="money">
                  <span class="symbol">￥</span> <span>{{ item.price }}</span>
                </div>
              </div>
              <div class="bottom">{{ item.promotion }}</div>
            </div>
          </template>

          <!-- 金币充值 -->
          <template v-else>
            <div
              class="rechargeOptionsItem goldBox"
              :class="moneyType.id == item.id ? 'goldBoxAction' : ''"
              v-for="item in list"
              :key="item.id"
              @click="durationChange(item)"
            >
              <!-- <div class="market">{{ item.tip }}</div> -->
              <div class="goldCoinsBox">
                <div class="goldCoins">
                  <img src="@/assets/goldCoins.png" alt="" />
                </div>
                <div class="money">
                  <span>{{ item.duration }}金币</span>
                </div>
              </div>
              <div class="bottom">￥{{ item.price }}</div>
            </div>
          </template>
        </div>
        <div class="tip" @click="$refs.protocol.visible = true">
          ·购买视为同意<span style="color: #0d99ff">《源调试会员协议》</span>
        </div>
      </div>
      <div class="qrCode">
        <div class="totalPrice">
          <span class="symbol">￥</span> <span>{{ moneyType.price }}</span>
        </div>
        <!-- <div class="saveMoney">已省 ￥9</div> -->
        <div class="code">
          <el-popover
            placement="top-start"
            width="180"
            trigger="hover"
            offset="50"
            @show="show"
            @hide="hide"
          >
            <div>
              <div class="qrCodeUrlPro" ref="qrCodeUrlPro"></div>
            </div>
            <div class="qrCodeUrl" ref="qrCodeUrl" slot="reference"></div>
          </el-popover>
        </div>
        <div
          class="wx"
          :class="isWx ? 'wxAction' : ''"
          @click="handleClick('wx')"
        >
          <img src="@/assets/wechat.png" alt="" />
          <span>微信支付</span>
        </div>
        <div
          class="zfb"
          :class="isWx ? '' : 'zfbAction'"
          @click="handleClick('zfb')"
        >
          <img src="@/assets/alipay.png" alt="" />
          <span>支付宝支付</span>
        </div>
      </div>
    </div>
    <protocol ref="protocol"></protocol>
  </el-dialog>
</template>

<script>
import {
  preWxPay,
  preAliPay,
  orderBySn,
  listByType,
  rechargePrecreate,
  rechargeNotifyUrl,
} from "@/api/pay";
import Protocol from "@/views/dialog/Protocol.vue";
import QRCode from "qrcodejs2";
import feedback from "@/utils/feedback";
import { debounce } from "lodash";
import { priceInquiry } from "@/api/index";
import VipBox from "@/components/VipBox";
export default {
  components: {
    Protocol,VipBox
  },
  data() {
    return {
      visible: false,
      checked: false,
      info: {},
      key: 0,
      paycode: require("@/assets/qrcode.png"),
      isWx: true,
      type: 1,
      list: [],
      isVip: true, //是否为充值vip的页面
      moneyType: {},
      qrCode: "", //二维码链接
    };
  },
  computed: {
    userInfo() {
      console.log(this.$root.userInfo);
      return this.$root.userInfo;
    },
  },
  watch: {
    type(val) {
      this.handleClick(this.isWx ? "wx" : "zfb");
    },
  },
  methods: {
    handleClick: debounce(
      function (type) {
        if (type == "wx") {
          this.handleClickWx();
        } else {
          this.handleClickAli();
        }
      },
      500,
      false
    ),
    handleClickWx() {
      this.isWx = true;
      if (this.$refs.qrCodeUrl) {
        this.$refs.qrCodeUrl.innerHTML = "";
      }
      clearInterval(this.loop);
      preWxPay({
        memberShipPackageId: this.moneyType.id,
      }).then((res) => {
        this.qrCode = res.data.data.qrCode;
        new QRCode(this.$refs.qrCodeUrl, {
          text: res.data.data.qrCode, // 需要转换为二维码的内容
          width: 50,
          height: 50,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H,
        });
        this.pollingOrderStatus(res.data.data.outTradeNo);
      });
    },
    handleClickAli() {
      this.isWx = false;
      if (this.$refs.qrCodeUrl) {
        this.$refs.qrCodeUrl.innerHTML = "";
      }
      clearInterval(this.loop);
      preAliPay({
        memberShipPackageId: this.moneyType.id,
      }).then((res) => {
        this.qrCode = res.data.data.qrCode;
        new QRCode(this.$refs.qrCodeUrl, {
          text: res.data.data.qrCode, // 需要转换为二维码的内容
          width: 50,
          height: 50,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H,
        });
        this.pollingOrderStatus(res.data.data.outTradeNo);
      });
    },

    durationHandleClickWx() {
      this.isWx = true;
      if (this.$refs.qrCodeUrl) {
        this.$refs.qrCodeUrl.innerHTML = "";
      }
      clearInterval(this.loop);
      rechargePrecreate({
        money: this.moneyType.price,
        memberShipPackageId: this.moneyType.id == -1 ? null : this.moneyType.id,
      }).then((res) => {
        this.qrCode = res.data.data.qrCode;
        new QRCode(this.$refs.qrCodeUrl, {
          text: res.data.data.qrCode, // 需要转换为二维码的内容
          width: 50,
          height: 50,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H,
        });
        this.pollingOrderStatus(res.data.data.outTradeNo);
      });
    },
    durationHandleClickAli() {
      this.isWx = false;
      if (this.$refs.qrCodeUrl) {
        this.$refs.qrCodeUrl.innerHTML = "";
      }
      clearInterval(this.loop);
      rechargeNotifyUrl({
        money: this.moneyType.price,
        memberShipPackageId: this.moneyType.id == -1 ? null : this.moneyType.id,
      }).then((res) => {
        this.qrCode = res.data.data.qrCode;
        new QRCode(this.$refs.qrCodeUrl, {
          text: res.data.data.qrCode, // 需要转换为二维码的内容
          width: 50,
          height: 50,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H,
        });
        this.pollingOrderStatus(res.data.data.outTradeNo);
      });
    },
    // 轮询订单状态
    pollingOrderStatus(orderSn) {
      clearInterval(this.loop);
      let count = 0;
      this.loop = setInterval(async () => {
        count += 1;
        const res = await orderBySn({ sn: orderSn });
        if (res.data.code == 200) {
          if (res.data.data.payStatus == 1) {
            // 支付成功
            clearInterval(this.loop);
            feedback.msgSuccess("支付成功");
            // 更新会员状态
            await this.$root.getUserInfo();
            this.visible = false;
          }
        }

        if (count >= 120) {
          // 2分钟超时
          clearInterval(this.loop);
          if (this.isVip) {
            if (this.isWx) {
              this.handleClickWx();
            } else {
              this.handleClickAli();
            }
          } else {
            if (this.isWx) {
              this.durationHandleClickWx();
            } else {
              this.durationHandleClickAli();
            }
          }
        }
      }, 1000);
    },
    async handleOpen() {
      const res = await priceInquiry();
      console.log(res.data.data, "res.data.data");
      this.list = res.data.data.map((item) => {
        return {
          id: item.id,
          name: item.name,
          price: item.price,
          tip: item.id == 1 ? "推荐" : item.id == 2 ? "热销" : "超值",
          promotion: item.id == 1 ? "推荐" : item.id == 2 ? "热销" : "优惠",
        };
      });
      this.moneyType = this.list[0];
      this.handleClickWx();
    },
    handleProtocol() {
      this.$refs.protocol.visible = true;
    },
    vipChange(item) {
      this.moneyType = item;
      this.handleClick(this.isWx ? "wx" : "zfb");
    },
    // 切换会员充值还是金币充值
    async change(type) {
      this.isVip = type;
      if (this.isVip) {
        this.handleOpen();
      } else {
        const res = await listByType({ type: 3 });
        if (res.data.code == 200) {
          this.list = res.data.data.map((item) => {
            return {
              tip: "推荐",
              ...item,
            };
          });
          this.durationChange(this.list[0]);
        }
      }
    },
    // 切换金币充值类型
    durationChange(item) {
      this.moneyType = item;

      if (this.isWx) {
        this.durationHandleClickWx();
      } else {
        this.durationHandleClickAli();
      }
    },
    close() {
      console.log(11111);
      clearInterval(this.loop);
      // 更新会员状态
      this.$root.getUserInfo();
      Object.assign(this.$data, this.$options.data());
    },
    show() {
      console.log("[ this.qrCode ] >", this.qrCode);
      new QRCode(this.$refs.qrCodeUrlPro, {
        text: this.qrCode, // 需要转换为二维码的内容
        width: 180,
        height: 180,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
    },
    hide() {
      this.$refs.qrCodeUrlPro.innerHTML = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.wxAction {
  background: rgba(161, 252, 163, 0.6);
}
.zfbAction {
  background: rgba(131, 179, 252, 0.6);
}
::v-deep .el-popover {
  background: #fff !important;
}

::v-deep .el-dialog__body {
  height: 350px;
  width: 495px;
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
    .close-small {
      font-size: 40px;
      cursor: pointer;
      position: absolute;
      right: 0px;
    }
    .info {
      display: flex;
      margin-top: 34px;
      margin-left: 22px;
      .avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
      }
      .text {
        margin-left: 8px;
        .nickName {
          font-size: 16px;
          font-weight: 700;
          // color: #000000;
          margin-right: 12px;
        }
      }
    }
  }

  .main {
    width: 309px;
    height: 190px;
    margin-left: 22px;
    // background-image: url("@/assets/Frame 103.png");
    background-image:var(--vipBj);
    background-repeat: no-repeat;
    background-position: center;
    background-size: 102% 105%;
    border-radius: 16px;
    margin-top: 32px;
    overflow: hidden;
    box-shadow: 2px 2px 6px #ccc;
    
    .type {
      display: flex;
      div {
        width: 50%;
        height: 32px;
        line-height: 32px;
        text-align: center;
        font-weight: 600;
        cursor: pointer;
      }
      .action {
        color: #0d99ff;
      }
      .goldBoxAction {
        color: #ecd612;
      }
    }
    .rechargeOptions {
      width: 283px;
      height: 115px;
      margin-left: 13px;
      margin-top: 12px;
      display: flex;
      justify-content: space-between;
      .rechargeOptionsItem {
        width: 86px;
        height: 115px;
        // border: 1px solid #aad4ff;
        background: #fff;
        border-radius: 6px;
        position: relative;
        box-sizing: border-box;
        overflow: hidden;
        cursor: pointer;

        .market {
          width: 24px;
          height: 15px;
          background: #aad4ff;
          font-size: 10px;
          color: #fff;
          position: absolute;
          right: 0;
          top: 0;
          text-align: center;
          border-bottom-left-radius: 3px;
        }
        .goldCoinsBox {
          position: absolute;
          top: 10px;
          left: 13px;
          .goldCoins {
            img {
              width: 60px;
              height: 46px;
            }
          }
          .money {
            margin-top: 2px;
            font-weight: 600;
            font-size: 14px;
            color: #000000;
            margin-left: 8px;
          }
        }
        .mainInformation {
          position: absolute;
          top: 25px;
          left: 20px;

          .vipType {
            font-weight: 600;
            color: #000000;
            font-size: 12px;
            text-align: center;
            width: 48px;
          }
          .money {
            margin-top: 2px;
            font-weight: 700;
            font-size: 20px;
            color: #000000;
            .symbol {
              font-size: 11px;
            }
          }
        }
        .bottom {
          position: absolute;
          bottom: 0;
          width: 86px;
          background: #aad4ff;
          text-align: center;
          height: 20px;
          font-size: 12px;
          // color: #fff;
          line-height: 20px;
        }
      }
      .goldBox {
        .market {
          background: #fbe945;
        }
        .bottom {
          background: #fbe945;
          color: #000000;
        }
      }
      .action {
        background: #aad4ff;
        .market {
          background: #0d99ff;
        }
        .bottom {
          background: #0d99ff;
        }
      }
      .goldBoxAction {
        background: #ffffd9;
        .market {
          background: #efc313;
        }
        .bottom {
          background: #efc313;
        }
      }
    }
  }
  .mainAction {
    background-image: var(--vipActionBj);
  }
  .qrCode {
    height: 190px;
    width: 89px;
    margin-top: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 35px;
    .totalPrice {
      font-size: 22px;
      // color: #000000;
      font-weight: 600;
      .symbol {
        font-size: 11px;
      }
    }
    .saveMoney {
      background: #0d99ff;
      color: #fff;
      font-size: 11px;
      text-align: center;
      padding: 4px 0;
      border-radius: 4px;
      width: 60px;
      height: 16px;
      line-height: 16px;
    }
    .code {
      width: 85px;
      height: 85px;
      // background: #0d99ff;
      margin-top: 4px;
      border-radius: 3px;
      display: flex;
      justify-content: center;
      align-items: center;
      .qrCodeUrl {
        width: 85px;
        height: 85px;
        background: #fff;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .wx,
    .zfb {
      margin-top: 8px;
      width: 87px;
      height: 30px;
      border: 1px solid #d1e5f9;
      border-radius: 8px;
      font-size: 10px;
      display: flex;
      padding: 0 4px;
      box-sizing: border-box;
      align-items: center;
      // color: #000000;
      cursor: pointer;
      span {
        margin-left: 4px;
      }
      img {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        margin-right: 2px;
      }
    }
    .wx {
      border: 2px solid #71de58;
    }
    .zfb {
      border: 2px solid #8da9e3;
    }
    .wxAction {
      background: #c6fdc8;
      color: #000000;
    }
    .zfbAction {
      background: #b4d1fd;
      color: #000000;
    }
  }
}
::v-deep .el-dialog__header {
  display: none;
}
::v-deep .el-dialog {
  background: rgba($color: #000000, $alpha: 0) !important;
}
</style>