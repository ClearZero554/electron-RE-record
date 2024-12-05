<template>
  <el-dialog
    :append-to-body="true"
    width="40%"
    title="提示"
    top="20%"
    @open="open"
    @close="close"
    :visible.sync="visible"
  >
    <div class="dialog">
      <div class="title">余额不足</div>
      <div>还需要{{num}}金币才可以购买</div>
      <div class="buttons">
        <div class="cancel" @click="visible=false">取消</div>
        <div class="recharge" @click="recharge">充值</div>
      </div>
    </div>
    <Recharge ref="recharge"></Recharge>
  </el-dialog>
</template>

<script>
import Recharge from "@/components/Recharge/index.vue";
export default {
  data() {
    return {
      visible: false,
      num:null
    };
  },
  components: { Recharge },
  methods: {
    open() {},
    close() { },
    recharge() {
      this.$refs.recharge.visible = true
      this.visible=false
    }
  },
};
</script>

<style lang="scss" scoped>
 ::v-deep .el-dialog__body{
    padding-top: 0px;
  }
 ::v-deep .el-dialog__header{
    padding-top: 8px;
  }
.dialog{
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .title{
    font-size: 24px;
    margin-bottom: 16px;
    font-weight: 600;
  }
  .buttons{
    display: flex;
    margin-top: 16px;
    .cancel{
      background: #76798F;
      padding:4px 8px;
      width: 60px;
      text-align: center;
      border-radius: 8px;
      cursor: pointer;
      margin-right: 8px;
      height: 30px;
      line-height: 30px;
    }
    .recharge{
      background: #3DA7FE;
      padding:4px 8px;
      width: 150px;
      height: 30px;
      text-align: center;
      border-radius: 8px;
      cursor: pointer;
      line-height: 30px;
    }
  }
}
</style>