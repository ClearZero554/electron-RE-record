<template>
  <div class="carousel">
    <div class="tip">
      <!-- <div class="sx"></div> -->
      <div class="spot">·</div>
      <div class="tipText" v-if="userInfo.days>0">
        源调试：{{ userInfo.days > 7 ? "暂无通知..." : "会员即将到期" }}
      </div>
      <div class="tipText" v-else>
        源调试:您尚未开通会员，点击<span style="color:red" @click="openVip">(充值会员)</span>
      </div>
    </div>
    <div class="textBox">
      <!-- <div class="sx"></div> -->
      <!-- <div class="spot"></div> -->
      <div ref="textBox" class="box">
        <div class="text" ref="text">
          · {{ textI }}
        </div>
      </div>
    </div>
    <Vip ref="vip"></Vip>
  </div>
</template>

<script>
import { updateLogs } from "@/api/index";
import { debounce } from "lodash";
import Vip from "@/views/dialog/Vip.vue";
export default {
  name: "carousel",
  components:{Vip},
  data() {
    return {
      timer: null,
      textI: null,
    };
  },
  mounted() {
    this.getText();
  },
  computed: {
    userInfo() {
      console.log("[  ] >", this.$root.userInfo);
      return this.$root.userInfo;
    },
  },
  methods: {
    init: debounce(function () {
      try {
        if (this.$refs.text) {
          const offsetWidth = this.$refs.text && this.$refs.text.offsetWidth;
          const textBoxOffsetWidth =
            this.$refs.textBox && this.$refs.textBox.offsetWidth;
          const left = this.$refs.text && this.$refs.text.style.left;
          const e = left && left.split("px")[0];
          if (left === "") {
            this.$refs.text.style.left = textBoxOffsetWidth + "px";
          } else if (e - 0 + offsetWidth < 0) {
            setTimeout(() => {
              this.$refs.text.style.left = textBoxOffsetWidth + "px";
              this.init();
            }, 10000);
            return;
          } else {
            this.$refs.text.style.left = Number(e) - 1 + "px";
          }
        }
        requestAnimationFrame(this.init);
      } catch (error) {
        console.log("[ error ] >", error);
        requestAnimationFrame(this.init);
      }
    }, 50),
    async getText() {
      const res = await updateLogs(10);
      if (res.data.data?.dictRemark) {
        this.textI = res.data.data.dictRemark;
        setTimeout(() => {
          this.init();
        }, 2000);
      }
    },
    openVip(){
       this.$refs.vip.visible = true;
    }
  },
};
</script>

<style lang="scss" scoped>
.carousel {
  height: 38px;
  width: 100%;
  display: flex;
  align-items: center;
  .sx {
    height: 20px;
    width: 4px;

    border-radius: 13px;
  }
 /*  .spot {
    
    font-size: 16px;
  } */
  .tip {
    width: 355px;
    color: #0d99ff;
    // margin-left: 16px;
    font-weight: 700;
    display: flex;
    align-items: center;
    .sx {
      background: #0d99ff;
    }
    .tipText {
      font-size: 13px;
      cursor: pointer;
    }
  }
  .textBox {
    width: 510px;
    height: 18px;
    box-sizing: border-box;
    color: var(--fc);
    border-radius: 8px;
    display: flex;
    padding: 0 8px;
    margin-right:8px;
    .sx {
      background: #333333;
    }
    .box {
      overflow: hidden;
      width: 490px;
      position: relative;
    }
    .text {
      font-size: 13px;
      padding: 0 16px;
      left: 9999px;
      font-weight: 600;
      position: absolute;
      white-space: nowrap;
    }
  }
}
</style>