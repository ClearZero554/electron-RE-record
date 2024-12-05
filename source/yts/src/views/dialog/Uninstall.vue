<template>
    <el-dialog append-to-body width="50%" title="" :visible.sync="visible">
        <div class="panel">
            <p v-if="type == 'obs'">电脑上没有检测到OBS</p>
            <p v-else>电脑上没有检测到直播伴侣</p>
            <p>请安装后重试</p>
            <el-button @click="() => visible = false">no</el-button>
            <el-button @click="() => visible = false">yes</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            type: 'obs',
            visible: false
        }
    }
}
</script>

<style scoped lang="scss">
.panel {
    text-align: center;
    padding-top: 20px;
    padding-bottom: 40px;

    p {
        font-size: 16px;
        font-weight: 700;
    }

    .el-button {
        width: 80px;
        background-color: #b4feb3;

        &:hover {
            color: #606266;
        }
    }

    .el-button:last-child {
        margin-left: 40px;
        background-color: #ffc2b6;
    }
}
</style>