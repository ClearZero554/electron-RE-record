<template>
  <el-dialog
    width="70%"
    title="退款申请描述"
    :visible.sync="visible"
    custom-class="dialog"
    append-to-body
    top="15vh"
    @close="close"
    @open="handleOpen"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div>
      <el-input type="textarea" :rows="3" v-model.trim="input"></el-input>
      <div>退款后，稍后有工作人员和您联系</div>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="confirm">退款</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { refund } from "@/api/chat";
export default {
  name: "commentAfterSales",
  data() {
    return {
      visible: false,
      input: null,
      id: null,
    };
  },
  methods: {
    async confirm() {
      const res = await refund({ id: this.id, refundReason: this.input });
      console.log(res,'res');
      if (res.data.code == 200) {
        this.visible = false;
        this.$emit("changeWindow");
      }
    },
    close() {
      this.input = null;
      this.id = null;
    },
    handleOpen() {},
  },
};
</script>

<style lang="scss" scoped>
</style>