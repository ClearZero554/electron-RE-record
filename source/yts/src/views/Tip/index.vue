<template>
  <div class="tipBox">
    <div class="header">
      <Icon fontName="icon-guanbi" @click="close"></Icon>
    </div>
    <div class="msg">
      <img :src="query.avatar" alt="" />
      <div class="text">
        <div class="nickname">{{ query.nickname }}</div>
        <div class="message">消息:{{ query.message }}</div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: {},
    };
  },
  mounted() {
    console.log(this.$route.query);
    this.query = this.$route.query;
    window.ipc.on('initTip',(event,data)=>{
      this.query=data
    })
  },
  methods:{
    close(){
      this.query={}
      window.ipc.send("tipClose")
    }
  }
};
</script>

<style lang="scss" scoped>
.tipBox {
  width: 300px;
  height: 100px;
  background: #000;
  border-radius: 16px;
  color: #fff;
  .header {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    font-size: 16px;
    height: 20px;
    /deep/ .icon-guanbi {
      margin-right: 12px;
      margin-top: 4px;
      font-size: 16px;
      cursor: pointer;
    }
  }
  .msg {
    display: flex;
    margin-top: 8px;
    img {
      width: 50px;
      height: 50px;
      border-radius: 16px;
      margin-left: 8px;
    }

    .text {
      margin-left: 8px;
      width: 220px;
      .nickname {
        font-size: 10px;
      }
      .message {
        font-size: 14px;
        margin-top: 6px;
      }
    }
  }
}
</style>
