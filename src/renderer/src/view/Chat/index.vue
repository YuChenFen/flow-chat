<template>
    <div style="width: 100%; height: 100%; display: flex">
        <div style="
                flex: 0 0 200px;
                border-right: 1px solid #ccc;
                display: flex;
                flex-direction: column;
            ">
            <div class="list-title" style="flex: 0 0 2.5rem">
                <el-text>对话列表</el-text>
                <el-button size="small" type="primary" plain @click="openAddChat">新建对话</el-button>
            </div>
            <div style="flex: 1; overflow: auto; padding-bottom: 100px">
                <UserItem v-for="(chat, index) in chatList" :key="index" v-model:current-chat="currentChat" :chat="chat"
                    @contextmenu="showChatItemContextMenu(chat, $event)">
                </UserItem>
            </div>
        </div>
        <div class="chat-container">
            <ChatLayout v-if="currentChat" v-model:current-chat="currentChat" :chat-massage="chatMassage"
                :is-loading="isLoading"></ChatLayout>
            <div v-else class="chat-container-empty">
                <svg style="width: 30%; height: 30%" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="2680" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <path d="M214.773 661.358l311.01-153.981 28.396 57.355-311.01 153.98z" fill="#B4C1F9" p-id="2681">
                    </path>
                    <path
                        d="M562.63 558.63l-45.26-45.26a30.9 30.9 0 0 0-5 6.52c6.15-11.15 94.82-190.91 152.92-309l57.42 28.24c-0.38 0.78-38.44 78.16-76.26 154.79-22.23 45-40 81-52.89 106.89-26.56 53.43-26.56 53.43-30.93 57.82z"
                        fill="#B4C1F9" p-id="2682"></path>
                    <path d="M517.412 558.684l45.168-45.342 258.993 258-45.168 45.342z" fill="#B4C1F9" p-id="2683">
                    </path>
                    <path d="M540.5 536.5m-180.5 0a180.5 180.5 0 1 0 361 0 180.5 180.5 0 1 0-361 0Z" fill="#7287FD"
                        p-id="2684"></path>
                    <path d="M693.5 225.5m-124.5 0a124.5 124.5 0 1 0 249 0 124.5 124.5 0 1 0-249 0Z" fill="#68D2C8"
                        p-id="2685"></path>
                    <path d="M799.5 795.5m-124.5 0a124.5 124.5 0 1 0 249 0 124.5 124.5 0 1 0-249 0Z" fill="#7287FD"
                        p-id="2686"></path>
                    <path d="M227.5 691.5m-124.5 0a124.5 124.5 0 1 0 249 0 124.5 124.5 0 1 0-249 0Z" fill="#FDC005"
                        p-id="2687"></path>
                </svg>
            </div>
            <div v-show="currentChat" class="input-container">
                <!-- <el-input
                    v-model="inputValue"
                    placeholder="请输入问题"
                    size="large"
                    @keypress.enter="send"
                />
                <el-button type="primary" size="large" @click="send">发送</el-button> -->
                <chatTextarea v-model="inputValue" placeholder="请输入问题" @keypress="
                    ($event) => {
                        if ($event.ctrlKey && $event.keyCode === 10) {
                            send()
                        }
                    }
                " @send="send"></chatTextarea>
            </div>
        </div>
        <teleport to="body">
            <ChatItemContextMenu v-model:x="chatItemContextMenuX" v-model:y="chatItemContextMenuY"
                v-model:chat-list="chatList" v-model:current-chat="currentChat" :select-chat="selectChatItem">
            </ChatItemContextMenu>
        </teleport>
    </div>
</template>
<script setup>
import { h, onBeforeUnmount, ref } from 'vue'
import LLM from '../../assets/js/llm'
import Tools from '../../assets/js/tools'
import { useChatStore } from '../../store/chatStore'
import Template from './template'
import { ElMessage, ElMessageBox } from 'element-plus'
import AddChatBox from './AddChatBox.vue'
import UserItem from './UserItem.vue'
import ChatLayout from './ChatLayout.vue'
import ChatItemContextMenu from './contextMenu/ChatItemContextMenu.vue'
import chatTextarea from '../../components/chatTextarea.vue'
import { storeToRefs } from 'pinia'
import { queryUser } from '../../api/user'
import { send as sendUser } from '../../api/sse'
import { retrieverQuery, retrieverRerank, retrieverTextQuery } from '../../api/message'
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
    const modelChartData = ref([])
    const modelTextData = ref([])
    const modelUserAccount = ref('')
    ElMessageBox({
        title: '新建对话',
        closeOnClickModal: false,
        message: h(AddChatBox, {
            modelName,
            modelType,
            modelChartData,
            modelTextData,
            modelUserAccount
        })
    }).then(async () => {
        let chat
        if (modelType.value === '用户') {
            try {
                // 判断是否包含英文字母
                if (/[a-zA-Z]/.test(modelUserAccount.value)) {
                    modelUserAccount.value = `"${modelUserAccount.value}"`
                }
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
            if (modelType.value === '知识图谱') {
                try {
                    let nodeArray = []
                    let edgeArray = []
                    for (let i = 0; i < modelChartData.value.length; i++) {
                        const data = JSON.parse(modelChartData.value[0].content)
                        nodeArray = [...nodeArray, ...data.node]
                        edgeArray = [...edgeArray, ...data.edge]
                    }
                    const INFO = chartToMarkdownTable(nodeArray, edgeArray)
                    chat.template = INFO
                } catch (e) {
                    ElMessage.error({
                        message: '解析JSON文件失败',
                        offset: 46
                    })
                    return
                }
            } else if (modelType.value === '文本文档') {
                let INFO = ''
                for (let i = 0; i < modelTextData.value.length; i++) {
                    INFO += modelTextData.value[i].content
                }
                chat.template = INFO
            }
        }
        chatList.value.push(chat)
        ElMessage.success({
            message: '创建成功',
            offset: 46
        })
    })
}
function chartToMarkdownTable(nodeArray, edgeArray) {
    let str = ''
    str += '| 节点名称 | 节点内容 |\n'
    nodeArray = nodeArray.map((node) => {
        node.name = node.name === '' ? '空' : node.name
        node.content = node.content === '' ? '空' : node.content
        return node
    })
    edgeArray = edgeArray.map((edge) => {
        edge.source = edge.source === '' ? '空' : edge.source
        edge.target = edge.target === '' ? '空' : edge.target
        edge.name = edge.name === '' ? '空' : edge.name
        edge.content = edge.content === '' ? '空' : edge.content
        return edge
    })
    nodeArray.forEach((node) => {
        str += `| ${node.name?.replaceAll('\n', '<br>')} | ${node.content?.replaceAll('\n', '<br>')} |\n`
    })
    str += '\n| 源节点 | 目标节点 | 关系名称 | 关系内容 |\n'
    edgeArray.forEach((edge) => {
        str += `| ${edge.source?.replaceAll('\n', '<br>')} | ${edge.target?.replaceAll('\n', '<br>')} | ${edge.name?.replaceAll('\n', '<br>')} | ${edge.content?.replaceAll('\n', '<br>')} |\n`
    })
    return str
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
    } else if (type === '知识图谱') {
        const query = messages[messages.length - 1].content
        let newTemplate = template
        if (config.llm.retriever.enable) {
            const relatedNode = await LLM.chat(Template.getNodeTemplate(query))
            let data = await retrieverQuery(
                template,
                relatedNode.split(','),
                100,
                config.llm.retriever.weight
            )
            console.log(data)
            if (config.llm.retriever.rerank.enable) {
                data.nodes_results = await retrieverRerank(data.nodes_results, query, 100)
                data.edges_results = await retrieverRerank(data.edges_results, query, 100)
            }
            newTemplate = `| 节点名称 | 节点内容 |\n| - | - |\n${data.nodes_results.join('\n')}\n\n| 源节点 | 目标节点 | 关系名称 | 关系内容 |\n| - | - | - | - |\n${data.edges_results.join('\n')}`
        }
        return Template.chartTemplate(newTemplate, query)
    } else if (type === '文本文档') {
        const query = messages[messages.length - 1].content
        let newTemplate = template
        if (config.llm.retriever.enable) {
            newTemplate = await retrieverTextQuery(
                template.replaceAll('\n\n', '\n'),
                query,
                100,
                config.llm.retriever.weight
            )
        }
        if (config.llm.retriever.enable) {
            newTemplate = await Tools.copyToClipboard(newTemplate)
        }
        return Template.textTemplate(newTemplate, query)
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
    background-image: linear-gradient(120deg, #fbf3ff 0%, #d8ebff 100%);

    .input-container {
        display: flex;
        gap: 10px;
        padding: 10px;
        height: calc(3rem + 20px);
        transition: height 0.2s ease-in-out;

        &:focus-within {
            height: calc(6rem + 20px);
        }
    }
}

html.dark .chat-container {
    background-image: linear-gradient(120deg, #2f2932 0%, #121c2d 100%);
}

.chat-container-empty {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    filter: grayscale(100%);
    opacity: 0.5;
}
</style>
