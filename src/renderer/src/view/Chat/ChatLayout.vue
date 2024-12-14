<template>
    <div ref="messagesRef" class="messages">
        <div v-for="(message, index) in currentChat.messages" :key="index" :class="message.role">
            <el-avatar v-if="message.role === 'user'" class="head-portrait" :src="userAvatar">
                <img src="/src/assets/image/empty-user.png" />
            </el-avatar>
            <el-avatar v-else class="head-portrait" :src="currentChat.avatar">
                <img src="/src/assets/image/AI.png" />
            </el-avatar>
            <span class="content">
                <MdPreview :text="message.content"></MdPreview>
            </span>
        </div>
        <div v-if="chatMassage" class="assistant">
            <el-avatar class="head-portrait" :src="currentChat.avatar">
                <img src="/src/assets/image/AI.png" />
            </el-avatar>
            <span class="content">
                <MdPreview :text="chatMassage"></MdPreview>
            </span>
        </div>
        <div v-if="isLoading && chatMassage === ''" class="assistant">
            <el-avatar class="head-portrait" :src="currentChat.avatar">
                <img src="/src/assets/image/AI.png" />
            </el-avatar>
            <div
                class="content"
                style="display: flex; align-items: center; gap: 10px; padding: 0.55rem 1rem"
            >
                <span class="loader"></span>
                <span>加载中...</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { nextTick, onMounted, onUpdated, ref } from 'vue'
import { getUserInfo } from '../../api/user'
import MdPreview from '@renderer/components/MdPreview.vue'

const currentChat = defineModel('currentChat')
defineProps({
    messages: {
        type: Array
    },
    chatMassage: {
        type: String
    },
    isLoading: {
        type: Boolean
    }
})
onMounted(() => {
    toBottom()
    read()
})
onUpdated(() => {
    toBottom()
    read()
})
const messagesRef = ref(null)
const userAvatar = ref(null)
function read() {
    for (let i = 0; i < currentChat.value.messages.length; i++) {
        if (currentChat.value.messages[i].unread) {
            delete currentChat.value.messages[i].unread
        }
    }
}
function toBottom() {
    nextTick(() => {
        if (messagesRef.value) {
            messagesRef.value.scrollTop = messagesRef.value.scrollHeight
        }
    })
}
getUserInfo().then((res) => {
    userAvatar.value = res.userAvatar
})
</script>

<style scoped>
.messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 10px;

    .user {
        display: grid;
        grid-template-columns: 40px 1fr 40px;
        grid-template-rows: 1fr;
        justify-items: end;
        gap: 10px;

        .head-portrait {
            grid-column: 3;
            grid-row: 1;
        }

        .content {
            background-color: #0099ff;
            color: #fff;
        }
        .content * {
            color: inherit;
        }
    }

    .assistant,
    .others {
        display: grid;
        grid-template-columns: 40px 1fr 40px;
        grid-template-rows: 1fr;
        justify-items: start;
        gap: 10px;

        .head-portrait {
            grid-column: 1;
            grid-row: 1;
        }

        .content {
            background-color: #ffffff;
            color: #000000;
        }
    }

    .head-portrait {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        user-select: none;
    }

    .content {
        grid-column: 2;
        grid-row: 1;
        padding: 0rem 1rem;
        border-radius: 10px;
        line-height: 1.5rem;
        max-width: 100%;
        overflow: auto;
    }

    &::-webkit-scrollbar {
        width: 0px;
    }
}

html.dark .messages {
    .user {
        .content {
            background-color: #06c;
            color: #fff;
        }
    }
    .assistant,
    .others {
        .content {
            background-color: #3b3b3b;

            :deep(*) {
                color: #f3f3f3 !important;
            }
        }
    }
}

.loader {
    width: 24px;
    height: 24px;
    display: inline-block;
    position: relative;
}
.loader::after,
.loader::before {
    content: '';
    box-sizing: border-box;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #000000;
    position: absolute;
    left: 0;
    top: 0;
    transform: scale(0);
    animation: animloader 2s linear infinite;
}
.loader::after {
    animation-delay: 1s;
}

@keyframes animloader {
    0% {
        transform: scale(0);
        opacity: 1;
    }
    100% {
        transform: scale(1);
        opacity: 0;
    }
}
</style>
