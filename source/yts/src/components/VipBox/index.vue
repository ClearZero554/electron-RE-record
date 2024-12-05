<template>
  <div class="expire" :class="userInfo.isMember != 1?'expire1':''">
    <iconpark-icon name="vip-one" class="icon"></iconpark-icon>
    <div class="days" v-if="!time">VIP</div>
    <div class="days" v-else-if="userInfo.isMember == 1">会员剩余:{{ userInfo.days }}天</div>
    <div class="days" v-else-if="userInfo.isNewUserIn24h == 1">会员剩余:试用1天</div>
    <div class="days" v-else>会员剩余:未开通</div>
  </div>
</template>

<script>
export default {
  props: {
    time: {
      default:true
    }
  },
  computed: {
    userInfo() {
      return this.$root.userInfo;
    },
  },
};
</script>

<style lang='scss' scoped>
.expire1{
  -webkit-app-region: drag;
}

.expire {
  display: flex;
  align-items: center;
  font-size: 10px;
  position: relative;
  background: #ffffd9;
  height: 16px;
  padding-right:4px ;
  border-radius: 3px;
  cursor: pointer;
  .icon {
    background: #fbe945;
    height: 16px;
    width: 16px;
    font-size: 16px;
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 3px;
    color: #fff;
  }
  .days {
    color: #000;
    font-size: 10px;
    line-height: 16px;

    margin-left: 22px;
  }
}
</style>