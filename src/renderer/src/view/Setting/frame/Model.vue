<template>
    <div class="container">
        <div class="anchor-container">
            <el-anchor
                :container="itemContainerRef"
                direction="vertical"
                type="default"
                @click="handleClick"
            >
                <el-anchor-link href="#基本设置-model" title="基本设置" />
                <el-anchor-link href="#聊天设置" title="聊天设置" />
                <el-anchor-link href="#ollama" title="ollama" />
                <el-anchor-link href="#siliconflow" title="siliconflow" />
                <el-anchor-link href="#智谱AI" title="智谱AI" />
            </el-anchor>
        </div>
        <div ref="itemContainerRef" class="item-container">
            <h3 id="基本设置-model">基本设置</h3>
            <div class="card">
                <el-text size="large" class="title">供应商名称</el-text>
                <el-text class="description">用于连接llm服务</el-text>
                <el-select
                    v-model="vendorName"
                    placeholder="请选择供应商"
                    style="width: 240px"
                    @change="modelStore.llm.setVendorName"
                >
                    <el-option
                        v-for="item in modelStore.llm.getVendorNameList()"
                        :key="item"
                        :label="item"
                        :value="item"
                    />
                    <template #empty>
                        <el-text type="danger">暂无模型</el-text>
                    </template>
                </el-select>
            </div>
            <h3 id="聊天设置">聊天设置</h3>
            <div class="card">
                <el-text size="large" class="title">向量数据库</el-text>
                <el-text class="description">在知识图谱问答时启用向量数据库过滤</el-text>
                <el-switch v-model="vectorDbEnable" @change="modelStore.llm.setVectorDbEnable" />
            </div>
            <h3 id="ollama">ollama</h3>
            <div class="card">
                <el-text size="large" class="title">api地址</el-text>
                <el-text class="description">用于连接ollama服务</el-text>
                <el-input
                    v-model="ollamaApiUrl"
                    style="width: 60%; min-width: 300px"
                    placeholder="请输入api地址"
                    @change="modelStore.ollama.setUrl"
                ></el-input>
            </div>
            <div class="card">
                <el-text size="large" class="title">模型</el-text>
                <el-text class="description">选择llm模型</el-text>
                <el-select
                    v-model="ollamaLlmModel"
                    placeholder="选择模型"
                    style="width: 240px"
                    @change="modelStore.ollama.setModel"
                >
                    <el-option
                        v-for="item in ollamaLlmModelList"
                        :key="item"
                        :label="item"
                        :value="item"
                    />
                    <template #empty>
                        <el-text type="danger">暂无模型</el-text>
                    </template>
                </el-select>
            </div>
            <h3 id="siliconflow">siliconflow</h3>
            <div class="card">
                <el-text size="large" class="title">api Key</el-text>
                <el-text class="description">用于连接siliconflow服务</el-text>
                <el-input
                    v-model="siliconflowApiKey"
                    style="width: 60%; min-width: 300px"
                    placeholder="请输入api key"
                    type="password"
                    show-password
                    @change="modelStore.siliconflow.setApiKey"
                ></el-input>
            </div>
            <div class="card">
                <el-text size="large" class="title">模型</el-text>
                <el-text class="description">选择siliconflow的对话模型</el-text>
                <el-select
                    v-model="siliconflowLlmModel"
                    placeholder="选择模型"
                    style="width: 240px"
                    @change="modelStore.siliconflow.setModel"
                >
                    <el-option
                        v-for="item in siliconflowLlmModelList"
                        :key="item"
                        :label="item"
                        :value="item"
                    />
                </el-select>
            </div>
            <h3 id="智谱AI">智谱AI</h3>
            <div class="card">
                <el-text size="large" class="title">api Key</el-text>
                <el-text class="description">用于连接智谱AI服务</el-text>
                <el-input
                    v-model="zhipuaiApiKey"
                    style="width: 60%; min-width: 300px"
                    placeholder="请输入api key"
                    type="password"
                    show-password
                    @change="modelStore.zhipuai.setApiKey"
                ></el-input>
            </div>
            <div class="card">
                <el-text size="large" class="title">模型</el-text>
                <el-text class="description">选择智谱AI的对话模型</el-text>
                <el-select
                    v-model="zhipuaiLlmModel"
                    placeholder="选择模型"
                    style="width: 240px"
                    @change="modelStore.zhipuai.setModel"
                >
                    <el-option
                        v-for="item in zhipuaiLlmModelList"
                        :key="item"
                        :label="item"
                        :value="item"
                    />
                </el-select>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useModelStore } from '@renderer/store/modelStore'

const modelStore = useModelStore()
const itemContainerRef = ref()
const vendorName = ref(modelStore.llm.getVendorName())
const vectorDbEnable = ref(modelStore.llm.getVectorDbEnable())
const ollamaApiUrl = ref(modelStore.ollama.getUrl())
const ollamaLlmModel = ref(modelStore.ollama.getModel())
const ollamaLlmModelList = ref([])
const siliconflowApiKey = ref(modelStore.siliconflow.getApiKey())
const siliconflowLlmModel = ref(modelStore.siliconflow.getModel())
const siliconflowLlmModelList = ref([])
const zhipuaiApiKey = ref(modelStore.zhipuai.getApiKey())
const zhipuaiLlmModel = ref(modelStore.zhipuai.getModel())
const zhipuaiLlmModelList = ref([])

onMounted(() => {
    ollamaGetModels()
    siliconflowGetModels()
    zhipuaiGetModels()
})

async function ollamaGetModels() {
    try {
        const { models } = await modelStore.ollama.getModels()
        ollamaLlmModelList.value = models
            .map((item) => item.name)
            .filter((item) => item.indexOf('embed') === -1)
    } catch (e) {
        console.log(e)
    }
}
async function siliconflowGetModels() {
    try {
        siliconflowLlmModelList.value = await modelStore.siliconflow.getModels()
    } catch (e) {
        console.log(e)
    }
}

async function zhipuaiGetModels() {
    try {
        zhipuaiLlmModelList.value = await modelStore.zhipuai.getModels()
    } catch (e) {
        console.log(e)
    }
}

const handleClick = (e) => {
    e.preventDefault()
}
</script>

<style scoped>
@import url(./style.css);
</style>
