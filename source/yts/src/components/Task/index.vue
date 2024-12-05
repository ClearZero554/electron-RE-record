<template>
  <el-dialog
    :append-to-body="true"
    width="50%"
    title="任务列表"
    top="10%"
    @open="open"
    @close="close"
    :visible.sync="visible"
  >
  </el-dialog>
</template>

<script>
export default {
  name: 'task',
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    open() {},
    close() {},
  },
};
</script>

<style lang="scss" scoped>


</style>
