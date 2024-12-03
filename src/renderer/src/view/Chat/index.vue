<template>
    <div style="width: 100%; height: 100%; display: flex">
        <div
            style="
                flex: 0 0 200px;
                border-right: 1px solid #ccc;
                display: flex;
                flex-direction: column;
            "
        >
            <div class="list-title" style="flex: 0 0 2.5rem">
                <el-text>对话列表</el-text>
                <el-button size="small" type="primary" plain @click="openAddChat"
                    >新建对话</el-button
                >
            </div>
            <div style="flex: 1; overflow: auto; padding-bottom: 100px">
                <UserItem
                    v-for="(chat, index) in chatList"
                    :key="index"
                    v-model:current-chat="currentChat"
                    :chat="chat"
                    @contextmenu="showChatItemContextMenu(chat, $event)"
                >
                </UserItem>
            </div>
        </div>
        <div v-show="currentChat" class="chat-container">
            <ChatLayout
                v-if="currentChat"
                v-model:current-chat="currentChat"
                :chat-massage="chatMassage"
                :is-loading="isLoading"
            ></ChatLayout>
            <div class="input-container">
                <el-input
                    v-model="inputValue"
                    placeholder="请输入问题"
                    size="large"
                    @keypress.enter="send"
                />
                <el-button type="primary" size="large" @click="send">发送</el-button>
            </div>
        </div>
        <teleport to="body">
            <ChatItemContextMenu
                v-model:x="chatItemContextMenuX"
                v-model:y="chatItemContextMenuY"
                v-model:chat-list="chatList"
                v-model:current-chat="currentChat"
                :select-chat="selectChatItem"
            ></ChatItemContextMenu>
        </teleport>
    </div>
</template>
<script setup>
import { h, onBeforeUnmount, ref } from 'vue'
import LLM from '../../assets/js/llm'
import Tools from '../../assets/js/tools'
import { useChatStore } from '../../store/chatStore'
import Chart from '../Flow/chart'
import Template from './template'
import { ElMessage, ElMessageBox } from 'element-plus'
import AddChatBox from './AddChatBox.vue'
import UserItem from './UserItem.vue'
import ChatLayout from './ChatLayout.vue'
import ChatItemContextMenu from './contextMenu/ChatItemContextMenu.vue'
import { storeToRefs } from 'pinia'
import { queryUser } from '../../api/user'
import { send as sendUser } from '../../api/sse'
import { vdQuery } from '../../api/message'
import config from '../../assets/js/config'

const chatItemContextMenuX = ref(-1)
const chatItemContextMenuY = ref(-1)
const selectChatItem = ref(null)

const { setChatList, getCurrentChat, setCurrentChat } = useChatStore()

const { chatList } = storeToRefs(useChatStore())
// const chatList = ref([])
const currentChat = ref(getCurrentChat())
const inputValue = ref('')
// const messages = ref([])
const chatMassage = ref('')
const isLoading = ref(false)
// watch(
//     () => currentChat.value,
//     (newValue) => {
//         if (newValue) {
//             messages.value = newValue.messages
//         }
//     }
// )

async function send() {
    if (Tools.isAllSpaces(inputValue.value)) {
        return
    }
    if (currentChat.value.type === '用户') {
        currentChat.value.messages.push({
            role: 'user',
            content: inputValue.value
        })
        sendUser(currentChat.value.id, inputValue.value, 'text')
        inputValue.value = ''
    } else {
        await sendAI()
    }
}

onBeforeUnmount(() => {
    setChatList(chatList.value)
    setCurrentChat(currentChat.value)
})

function openAddChat() {
    const modelName = ref('')
    const modelType = ref('')
    const modelUserAccount = ref('')
    ElMessageBox({
        title: '新建对话',
        closeOnClickModal: false,
        message: h(AddChatBox, { modelName, modelType, modelUserAccount })
    }).then(async () => {
        let chat
        if (modelType.value === '用户') {
            try {
                const { id, userAvatar, userName } = await queryUser(
                    ['id', 'userAvatar', 'userName'],
                    `userAccount=${modelUserAccount.value}`
                )
                chat = {
                    id: id,
                    name: userName,
                    type: modelType.value,
                    avatar: userAvatar,
                    messages: []
                }
            } catch (e) {
                ElMessage.error({
                    message: '用户不存在，创建失败',
                    offset: 46
                })
                return
            }
        } else {
            if (modelName.value === '' || modelType.value === '') {
                ElMessage.error({
                    message: '名称或类型为空，创建失败',
                    offset: 46
                })
                return
            }
            chat = {
                name: modelName.value,
                type: modelType.value,
                avatar: '/src/assets/image/AI.png',
                messages: []
            }
            if (modelType.value === '结合当前知识图谱') {
                try {
                    const INFO = new Chart().toMackdownTable()
                    chat.template = INFO
                } catch (e) {
                    ElMessage.error({
                        message: '当前知识图谱为空，创建失败',
                        offset: 46
                    })
                    return
                }
            }
        }
        chatList.value.push(chat)
        ElMessage.success({
            message: '创建成功',
            offset: 46
        })
    })
}

function showChatItemContextMenu(chat, event) {
    event.preventDefault()
    selectChatItem.value = chat
    chatItemContextMenuX.value = event.clientX
    chatItemContextMenuY.value = event.clientY
}

async function getTemplate(type, messages, template) {
    if (type === '普通对话') {
        return messages
    } else if (type === '结合当前知识图谱') {
        const query = messages[messages.length - 1].content
        let newTemplate = template
        if (config.llm.vectorDbEnable) {
            newTemplate = await vdQuery(template, query)
        }
        return Template.chatTemplate(newTemplate, query)
    } else {
        return messages
    }
}

async function sendAI() {
    currentChat.value.messages.push({
        role: 'user',
        content: inputValue.value
    })
    isLoading.value = true
    inputValue.value = ''
    chatMassage.value = ''
    try {
        // let chatTemplate = Template.chatTemplate(
        //     INFO,
        //     messages.value[messages.value.length - 1].content
        // )
        // let chatTemplate = Template.entityExtraction(
        //     messages.value[messages.value.length - 1].content
        // )
        // let chatTemplate = messages.value
        let chatTemplate = await getTemplate(
            currentChat.value.type,
            currentChat.value.messages,
            currentChat.value.template
        )
        console.log(chatTemplate)
        let ans = await LLM.chatAsync(chatTemplate, (data) => {
            chatMassage.value += data
        })

        chatMassage.value = ''
        currentChat.value.messages.push({
            role: 'assistant',
            content: ans
        })
    } catch (e) {
        chatMassage.value = ''
        currentChat.value.messages.push({
            role: 'assistant',
            content: `[ERROR]: ${e}`
        })
    }
    isLoading.value = false
}
</script>

<style scoped>
.list-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0.2rem;
    border-bottom: 1px solid #ccc;
}

.chat-container {
    width: 100%;
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    background-image: linear-gradient(120deg, #fbf4ff7a 0%, #ddebff7a 100%);

    .input-container {
        display: flex;
        gap: 10px;
        padding: 10px;
    }
}
</style>
