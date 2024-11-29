<template>
    <el-tabs v-model="editableTabsValue" type="border-card" class="tabs user-select-none">
        <el-tab-pane key="用户" label="用户" name="用户" class="tab-content">
            <User></User>
        </el-tab-pane>
        <el-tab-pane key="图表" label="图表" name="图表" class="tab-content">
            <!-- <p>图表设置</p>
            <br />
            <p>- 基础样式模板</p> -->
            <Chart></Chart>
        </el-tab-pane>
        <el-tab-pane key="模型" label="模型" name="模型" class="tab-content">
            <!-- <p>模型设置</p>
            <br />
            <p>- api地址（现使用ollama作为使用地址）</p>
            <p>- 模型</p>
            <p>- 各个部分的提示词模板</p> -->
            <Model></Model>
        </el-tab-pane>
    </el-tabs>
</template>
<script setup>
import { ref } from 'vue'
import User from './frame/User.vue'
import Chart from './frame/Chart.vue'
import Model from './frame/Model.vue'

const editableTabsValue = ref('用户')
</script>

<style scoped>
.tabs {
    height: 100%;
}
.tab-content {
    height: 100%;
}
</style>
