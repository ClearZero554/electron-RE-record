<template>
  <el-dialog
    width="60%"
    :visible.sync="visible"
    append-to-body
    @close="close"
    @open="handleOpen"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="dialog">
      <div>购买《{{ info.title }}》需要{{ info.price }}金币</div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">确定购买</el-button>
    </span>
    <Recharge ref="recharge"></Recharge>
  </el-dialog>
</template>

<script>
import { byMoney } from "@/api/pay";
import feedback from "@/utils/feedback";
import Recharge from "@/components/Recharge/index.vue";
export default {
  name: "virtualCurrency",
  props: ["isDownload", "info"],
  components: { Recharge },
  data() {
    return {
      visible: false,
    };
  },
  computed: {
    userInfo() {
      return this.$root.userInfo;
    },
  },
  methods: {
    handleOpen() {},
    close() {},
    async submit() {
     /*  if (this.info.price > this.userInfo.money) {
        feedback.msgWarning("您的源币不足~");
        this.$refs.recharge.visible = true;
        
      } */
      const res = await byMoney({
        articleId: this.info.id,
        money: this.info.price,
      });
      console.log(res.data, "res.data");
      if (res.data.code == 200) {
        feedback.msgSuccess("支付成功");
        if (this.isDownload) {
          this.$emit("handleInstall");
        } else {
          this.$emit("handleDownload");
        }
        await this.$root.getUserInfo();
        this.$emit("getDetail", this.info.id);
        this.visible = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog {
  height: 80px;
  font-size: 20px;
}
</style>