<template>
  <el-dialog
    :append-to-body="true"
    width="50%"
    title="金币充值"
    top="40px"
    @open="open"
    @close="close"
    :visible.sync="visible"
  >
    <div class="charge">现有金币:{{ userInfo.money }}</div>
    <div class="recharge">
      <span>金币可用来购买付费服务</span>
      <div class="moneyBox">
        <div
          class="moneyItem"
          v-for="item in list"
          :key="item.id"
          @click="moneyChange(item)"
          :class="moneyType.id == item.id ? 'action' : ''"
        >
          <img src="@/assets/金币.png" alt="" />
          <div>{{ item.duration }}金币</div>
          <div class="price">{{ item.price }}元</div>
        </div>
        <!-- <div
          class="moneyItem"
          @click="moneyChange({ id: -1, price: null })"
          :class="moneyType.id == -1 ? 'action' : ''"
        >
          <img src="@/assets/金币.png" alt="" />
          <div class="custom" v-if="moneyType.id == -1">
            <el-input
              v-model="moneyType.price"
              size="mini"
              class="input"
            ></el-input>
            <div @click.stop="confirm" class="confirm">确定</div>
          </div>
          <div class="price" v-else><div></div>自定义</div>
        </div> -->
      </div>
    </div>
    <div class="pay">
      <!-- <div class="des">{{`充值${moneyType.price}元获得${moneyType.duration}金币` }}</div> -->
      <div class="wxpay-code" ref="qrCodeUrl"></div>
      <div class="buttons">
        <div class="tip">
          <div class="duration">
            购买金币:{{
              moneyType.id == -1 ? moneyType.price : moneyType.duration
            }}
          </div>
          <div>
            支付金额:<span class="price">{{ moneyType.price }}</span
            >元
          </div>
          <div style="display: flex">
            <div
              class="wechat button"
              @click="handleClick('wx')"
              :class="isWx ? 'wxAction' : ''"
            >
              <img src="../../assets/wechat.png" />
              <span>微信</span>
            </div>
            <div
              class="alipay button"
              @click="handleClick('zfb')"
              :class="isWx ? '' : 'zfbAction'"
            >
              <img src="../../assets/alipay.png" />
              <span>支付宝</span>
            </div>
          </div>
          <div class="sure">
            购买视为同意<span class="cursor" @click="handleProtocol"
              >《源调试会员协议》</span
            >
          </div>
        </div>
      </div>
    </div>

    <!--  <span slot="footer" class="dialog-footer">
      <el-button type="primary" class="button" @click="submit">确认</el-button>
    </span> -->
    <protocol ref="protocol"></protocol>
  </el-dialog>
</template>

<script>
import {
  listByType,
  rechargePrecreate,
  orderBySn,
  rechargeNotifyUrl,
} from "@/api/pay";
import feedback from "@/utils/feedback";
import QRCode from "qrcodejs2";
import Protocol from "@/views/dialog/Protocol.vue";
import { debounce, cloneDeep } from "lodash";
export default {
  name: "recharge", //收费
  components: {
    Protocol,
  },
  data() {
    return {
      visible: false,
      loop: null,
      isType: 0,
      duration: null,
      list: [],
      moneyType: {},
      isWx: true,
    };
  },
  computed: {
    userInfo() {
      return this.$root.userInfo;
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
    submit() {
      this.handleClickWx();
    },
    confirm() {
      this.handleClickWx();
    },
    async open() {
      if (this.$refs.qrCodeUrl) {
        this.$refs.qrCodeUrl.innerHTML = "";
      }
      this.isType = 0;
      const res = await listByType({ type: 3 });
      console.log("[ res.data.data ] >", res.data.data);
      if (res.data.code == 200) {
        this.list = res.data.data;
        this.moneyType = cloneDeep(this.list[0]);
        this.handleClickWx();
      }
    },
    // 关闭
    close() {
      clearInterval(this.loop);
    },
    handleClickWx() {
      this.isWx = true;
      if (this.$refs.qrCodeUrl) {
        this.$refs.qrCodeUrl.innerHTML = "";
        clearInterval(this.loop);
      }
      rechargePrecreate({
        money: this.moneyType.price,
        memberShipPackageId: this.moneyType.id == -1 ? null : this.moneyType.id,
      }).then((res) => {
        new QRCode(this.$refs.qrCodeUrl, {
          text: res.data.data.qrCode, // 需要转换为二维码的内容
          width: 100,
          height: 100,
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
        clearInterval(this.loop);
      }
      rechargeNotifyUrl({
        money: this.moneyType.price,
        memberShipPackageId: this.moneyType.id == -1 ? null : this.moneyType.id,
      }).then((res) => {
        new QRCode(this.$refs.qrCodeUrl, {
          text: res.data.data.qrCode, // 需要转换为二维码的内容
          width: 100,
          height: 100,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H,
        });
        this.pollingOrderStatus(res.data.data.outTradeNo);
      });
    },
    // 轮询订单状态
    pollingOrderStatus(orderSn) {
      let count = 0;
      this.loop = setInterval(async () => {
        count += 1;
        const res = await orderBySn({ sn: orderSn });
        if (res.data.code == 200) {
          if (res.data.data.payStatus == 1) {
            // 支付成功
            clearInterval(this.loop);
            feedback.msgSuccess("充值成功");
            this.$root.getUserInfo();
            this.visible = false;
          }
        }

        if (count >= 180) {
          // 3分钟超时
          clearInterval(this.loop);
          // 超时之后继续生成订单
          this.handleClickWx();
        }
      }, 1000);
    },
    moneyChange (item){
      this.moneyType = cloneDeep(item);
      if (item.id == -1) {
        return;
      }
      if (this.isWx) {
        this.handleClickWx();
      } else {
        this.handleClickAli();
      }
    },
    handleProtocol() {
      this.$refs.protocol.visible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.tip {
  margin-top: 16px;
  .price {
    font-size: 40px;
  }
  .duration {
    color: #fdc4b3;
  }
}
::v-deep .el-dialog__body {
  padding-top: 0px;
}
.charge {
  position: absolute;
  top: 20px;
  right: 100px;
  background: #76798f;
  padding: 0 4px;
  border-radius: 4px;
}
.wxAction {
  background: rgba(161, 252, 163, 0.6);
}
.zfbAction {
  background: rgba(131, 179, 252, 0.6);
}
.recharge {
  height: 180px;
  position: relative;
  .moneyBox {
    height: 150px;
    margin-top: 16px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .action {
      border: 2px solid var(--action);
    }
    .moneyItem {
      width: 128px;
      height: 120px;
      box-sizing: border-box;
      padding: 4px;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: var(--secondLevel);
      border-radius: 8px;
      cursor: pointer;
      margin: 4px;
      img {
        width: 60%;
      }
      .price {
        background: #76798f;
        width: 80px;
        border-radius: 8px;
        text-align: center;
        .input {
          /deep/ input {
            background: #76798f;
            color: #fff;
            height: 100%;
          }
        }
      }
      .custom {
        width: 100px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        .input {
          width: 60px;
        }
        .confirm {
          width: 35px;
          height: 28px;
          line-height: 28px;
          background: #008ffc;
          border-radius: 8px;
          margin-left: 5px;
          text-align: center;
          font-size: 14px;
        }
      }
      .hx {
        border: 1px solid var(--tgb);
        width: 40px;
        margin-top: 2px;
      }
    }
  }
  .tip {
    position: absolute;
    right: -7px;
    top: 20px;
    width: 65px;
    height: 120px;
    background: var(--secondLevel);
    border-radius: 8px;
    padding: 4px;
    text-indent: 1em;
  }
  .button {
    position: absolute;
    right: 10px;
    bottom: 10px;

    width: 100px;
  }
}
.pay {
  display: flex;
  justify-content: space-around;
  .des {
    position: absolute;
    top: 60px;
  }
  /deep/ .wxpay-code {
    display: inline-block;
    width: 150px;
    height: 150px;
    margin-right: 16px;
    margin-top: 12px;
    vertical-align: top;
    border: 2px solid #008ffc;
    border-radius: 16px;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .buttons {
    position: relative;
    display: inline-block;
    text-align: left;
    top: 4px;
    // display: flex;

    .way {
      font-size: 12px;
    }

    .sure {
      margin-top: 8px;
      // margin-left: 28px;
      font-size: 10px;

      .cursor {
        color: #008ffc;
        cursor: pointer;
      }
    }

    .button {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 2px solid #969696;
      width: 70px;
      height: 25px;
      // padding: 1px 0px;
      border-radius: 8px;
      margin-top: 7px;
      line-height: 25px;
      cursor: pointer;
      margin-left: 4px;
      font-size: 12px;

      img {
        height: 20px;
        width: 20px;
        vertical-align: middle;
        // margin-right: 5px;
      }

      span {
        vertical-align: middle;
      }
    }

    .wechat {
      border-color: #04fc00;
    }

    .alipay {
      border-color: #008ffc;
    }
  }
}
</style>
