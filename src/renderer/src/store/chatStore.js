import { defineStore } from 'pinia'
import SSEEvents from '../api/sse'
import { queryUser } from '../api/user'
import { ref, watchEffect } from 'vue'
import { getUnreadMessage } from '../api/message'

export const useChatStore = defineStore('chat', () => {
    const chatList = ref([])
    const unreadMessageCount = ref(0)
    let currentChat
    const userAccount = sessionStorage.getItem('userAccount')

    SSEEvents.addEventListener('SSE: message', async (data) => {
        const { fromUserId, content } = data
        addUserMessage(fromUserId, content)
    })

    async function addUserMessage(fromUserId, content) {
        const chat = chatList.value.find((item) => item.id === fromUserId)
        if (chat) {
            chat.messages.push({
                role: 'others',
                content,
                unread: true
            })
        } else {
            const { userAvatar, userName } = await queryUser(
                ['userAvatar', 'userName'],
                `id=${fromUserId}`
            )
            chatList.value.push({
                id: fromUserId,
                name: userName,
                type: '用户',
                avatar: userAvatar,
                messages: [
                    {
                        role: 'others',
                        content,
                        unread: true
                    }
                ]
            })
        }
    }

    async function initChatList() {
        if (chatList.value.length === 0) {
            try {
                // eslint-disable-next-line no-unsafe-optional-chaining
                const { data } = await window.electronAPI?.readFile({
                    filePath: `./chat/${userAccount}.json`
                })
                chatList.value = JSON.parse(data)
            } catch (error) {
                console.log('读取聊天会话失败：char.json', error)
            }
        }
        const unreadMessage = await getUnreadMessage()
        if (unreadMessage.length > 0) {
            for (let i = 0; i < unreadMessage.length; i++) {
                const { fromUserId, content } = unreadMessage[i]
                await addUserMessage(fromUserId, content)
            }
        }
    }
    initChatList()
    async function updateUnreadMessageCount() {
        unreadMessageCount.value = 0
        for (let i = 0; i < chatList.value.length; i++) {
            unreadMessageCount.value += chatList.value[i].messages.filter(
                (item) => item.unread
            ).length
        }
    }

    function setChatList(list) {
        chatList.value = list
    }
    watchEffect(() => {
        window.electronAPI?.writeFile({
            filePath: `./chat/${userAccount}.json`,
            content: JSON.stringify(chatList.value)
        })
        updateUnreadMessageCount()
    })

    function getCurrentChat() {
        return currentChat
    }
    function setCurrentChat(chat) {
        currentChat = chat
    }

    return { chatList, unreadMessageCount, setChatList, getCurrentChat, setCurrentChat }
})
