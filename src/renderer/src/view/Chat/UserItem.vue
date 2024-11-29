<template>
    <div
        class="chat-item"
        :class="{
            active: currentChat === chat
        }"
        @click="changeChat"
    >
        <el-badge
            :max="99"
            :value="chat.messages.filter((e) => e.unread).length"
            :hidden="chat.messages.filter((e) => e.unread).length === 0"
        >
            <el-avatar shape="square" :size="40" fit="cover" :src="chat.avatar" />
        </el-badge>
        <div class="chat-content">
            <el-text style="font-weight: bold">{{ chat.name }}</el-text>
            <el-text>{{ chat.type }}</el-text>
        </div>
    </div>
</template>

<script setup>
const currentChat = defineModel('currentChat')
const props = defineProps({
    chat: Object
})
const changeChat = () => {
    currentChat.value = props.chat
}
</script>

<style scoped>
.chat-item {
    padding: 0.5rem 0.5rem;
    border-bottom: 1px solid #ccc;
    user-select: none;
    cursor: pointer;
    border-left: 3px solid #0099ff00;
    transition: all 0.2s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;

    &:hover {
        background-color: #bfbfbf4c;
    }

    .chat-content {
        display: flex;
        flex-direction: column;
        gap: 4px;

        & :deep(span) {
            max-width: 5rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            align-self: start;
            font-size: 0.8rem;
        }
    }
}
.chat-item.active {
    background-color: #ecf5ffb9;
    border-left-color: #0099ff;
}
</style>
