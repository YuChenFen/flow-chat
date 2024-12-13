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
                <div class="interface-card-container">
                    <div
                        v-for="item in llmInterface"
                        :key="item.name"
                        class="interface-card"
                        @click="openWeb(item.web)"
                    >
                        <div class="interface-card-title">
                            <el-image
                                style="width: 1rem; height: 1rem"
                                :src="item.icon"
                                fit="contain"
                            />
                            <span>{{ item.name }}</span>
                        </div>
                        <el-icon :color="item.active ? '#67c23a' : '#f56c6c'">
                            <SuccessFilled v-if="item.active" />
                            <CircleCloseFilled v-else />
                        </el-icon>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import Ollama from '@renderer/assets/js/llm/ollama'
import Siliconflow from '@renderer/assets/js/llm/siliconflow'
import ZhiPuAi from '@renderer/assets/js/llm/zhipuai'
import { onMounted, ref } from 'vue'

const llmInterface = ref([
    {
        name: 'ollama',
        icon: 'https://ollama.com/public/ollama.png',
        web: 'https://ollama.com/',
        url: Ollama.url,
        active: false
    },
    {
        name: 'siliconflow',
        icon: 'https://framerusercontent.com/images/4li2PjWxZJmoGkzXRMJWU1rJmI.svg',
        web: 'https://siliconflow.cn/zh-cn/',
        url: Siliconflow.url,
        active: false
    },
    {
        name: 'zhipuai',
        icon: 'https://bigmodel.cn/img/icons/favicon-32x32.png',
        web: 'https://bigmodel.cn/',
        url: ZhiPuAi.url,
        active: false
    }
])

onMounted(async () => {
    for (let i = 0; i < llmInterface.value.length; i++) {
        try {
            await fetch(llmInterface.value[i].url)
            llmInterface.value[i].active = true
        } catch (e) {
            llmInterface.value[i].active = false
        }
    }
})

function openWeb(url) {
    window.open(url)
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

.interface-card-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
    user-select: none;

    .interface-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: rgba(60, 64, 67, 0.15) 0px 0px 0px 1px;
        gap: 10px;
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
            box-shadow: rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
            transform: translateY(-2px);
            background-color: #f6f6f6;
        }

        .interface-card-title {
            display: flex;
            align-items: center;
            gap: 8px;
        }
    }
}

::-webkit-scrollbar {
    width: 0px;
}
</style>
