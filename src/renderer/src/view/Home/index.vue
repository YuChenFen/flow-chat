<template>
    <div class="home">
        <div class="alert-container">
            <el-alert
                title="当前使用的程序为测试版本，可能会有各种不可言明的 Bug"
                type="warning"
                show-icon
                :closable="false"
                class="alert"
            />
        </div>
        <h3 class="welcome">欢迎使用Flow Chat</h3>
        <div style="display: flex; justify-content: space-between; gap: 25px; margin-bottom: 50px">
            <div style="flex: 1">
                <h4 class="font-weight-bold" style="margin-bottom: 10px">接口情况</h4>
                <ol class="interface-list">
                    <li>
                        <el-text class="interface-name">
                            <span
                                class="interface-dot"
                                :class="ollamaInterface ? 'yes' : 'no'"
                            ></span>
                            ollama
                        </el-text>
                    </li>
                    <li>
                        <el-text class="interface-name">
                            <span
                                class="interface-dot"
                                :class="siliconflowInterface ? 'yes' : 'no'"
                            ></span>
                            siliconflow
                        </el-text>
                    </li>
                    <li>
                        <el-text class="interface-name">
                            <span
                                class="interface-dot"
                                :class="zhipuaiInterface ? 'yes' : 'no'"
                            ></span>
                            智谱AI
                        </el-text>
                    </li>
                </ol>
            </div>
        </div>
    </div>
</template>
<script setup>
import Ollama from '@renderer/assets/js/llm/ollama'
import Siliconflow from '@renderer/assets/js/llm/siliconflow'
import ZhiPuAi from '@renderer/assets/js/llm/zhipuai'
import { onMounted, ref } from 'vue'

const ollamaInterface = ref(false)
const siliconflowInterface = ref(false)
const zhipuaiInterface = ref(false)

onMounted(async () => {
    testOllama()
    testSiliconflow()
    testZhipuai()
})

async function testOllama() {
    try {
        await fetch(Ollama.url)
        ollamaInterface.value = true
    } catch (e) {
        ollamaInterface.value = false
    }
}
async function testSiliconflow() {
    try {
        await fetch(Siliconflow.url)
        siliconflowInterface.value = true
    } catch (e) {
        siliconflowInterface.value = false
    }
}
async function testZhipuai() {
    try {
        await fetch(ZhiPuAi.url)
        zhipuaiInterface.value = true
    } catch (e) {
        zhipuaiInterface.value = false
    }
}
</script>

<style scoped>
.home {
    height: 100%;
    padding: 10px;
    overflow: auto;

    .alert-container {
        .alert {
            border: 1px solid #cdcdcd;
            user-select: none;
        }
    }

    .welcome {
        margin: 15px 0 300px 0;
        font-weight: 900;
    }
}
.font-weight-bold {
    font-weight: bold;
}

.interface-list {
    display: flex;
    flex-direction: column;

    li {
        margin: 5px 0;
        padding-left: 25px;
        list-style-type: none;
        box-shadow: rgba(17, 17, 26, 0.1) 0px 1px 0px;
        /* border: 1px solid #cdcdcd; */

        .interface-dot {
            display: inline-block;
            width: 0.7rem;
            height: 0.7rem;
            border-radius: 50%;
            margin-right: 10px;
        }
        .interface-dot.yes {
            background-color: #00d400;
        }
        .interface-dot.no {
            background-color: #d40000;
        }
        .interface-name {
            font-size: 1.1rem;
        }
    }
}

.cell-item {
    display: flex;
    align-items: center;
    gap: 5px;
}
::-webkit-scrollbar {
    width: 0px;
}
</style>
