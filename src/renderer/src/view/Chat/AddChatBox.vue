<template>
    <div>
        <div class="item">
            <el-text class="mx-1">会话类型</el-text>
            <el-select v-model="modelType" placeholder="请选择会话类型">
                <el-option label="普通对话" value="普通对话"></el-option>
                <el-option label="结合当前知识图谱" value="结合当前知识图谱"></el-option>
                <el-option label="用户" value="用户"></el-option>
            </el-select>
        </div>
        <div v-if="modelType !== '用户'" class="item">
            <el-text class="mx-1">会话名称</el-text>
            <el-input v-model="modelName" placeholder="请输入会话名称" clearable></el-input>
        </div>
        <div v-if="modelType === '用户'" class="item">
            <el-text class="mx-1">用户账号</el-text>
            <el-input v-model="modelUserAccount" placeholder="请输入用户账号" clearable></el-input>
        </div>
    </div>
</template>

<script setup>
import { useAttrs } from 'vue'

const { modelName, modelType, modelUserAccount } = useAttrs()
</script>

<style scoped>
.item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;

    .mx-1 {
        width: 6rem;
        margin: auto 0;
    }
}
</style>
