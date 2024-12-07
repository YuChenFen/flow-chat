<template>
    <div>
        <div class="item">
            <el-text class="mx-1">会话类型</el-text>
            <el-select v-model="modelType" placeholder="请选择会话类型">
                <el-option label="普通对话" value="普通对话"></el-option>
                <el-option label="知识图谱" value="知识图谱"></el-option>
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
        <div v-if="modelType === '知识图谱'">
            <div class="item">
                <el-text class="mx-1">上传文件</el-text>
                <div style="width: 100%">
                    <el-upload :http-request="uploadContent" :show-file-list="false">
                        <template #trigger>
                            <el-button type="primary">JSON 文件</el-button>
                        </template>
                    </el-upload>
                </div>
            </div>
            <div style="width: 100%; overflow-x: auto; display: flex; gap: 5px; user-select: none">
                <el-tag
                    v-for="(file, index) in modelChartData"
                    :key="index"
                    size="large"
                    closable
                    @close="modelChartData.splice(index, 1)"
                >
                    {{ file.name }}
                </el-tag>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useAttrs } from 'vue'

const { modelName, modelType, modelChartData, modelUserAccount } = useAttrs()

function uploadContent(file) {
    const reader = new FileReader()
    reader.onload = (e) => {
        modelChartData.value.push({
            name: file.file.name,
            content: e.target.result
        })
    }
    reader.readAsText(file.file)
}
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
