<template>
    <ContextMenuView
        v-if="x >= 0 && y >= 0"
        :x="x"
        :y="y"
        :data-array="dataArray"
        :click="onClick"
        :close="close"
    >
    </ContextMenuView>
</template>

<script setup>
import ContextMenuView from '@renderer/components/ContextMenuView/ContextMenuView.vue'
const chatList = defineModel('chat-list')
const currentChat = defineModel('current-chat')
const props = defineProps({
    x: {
        type: Number,
        required: true
    },
    y: {
        type: Number,
        required: true
    },
    selectChat: {
        required: true
    }
})
const emits = defineEmits(['update:x', 'update:y'])
const dataArray = [
    {
        label: '删除对话'
    }
]
function onClick(item) {
    close()
    if (item.label === '删除对话') {
        chatList.value.splice(chatList.value.indexOf(props.selectChat), 1)
        if (currentChat.value == props.selectChat) {
            currentChat.value = chatList.value[0]
        }
    }
}

function close() {
    emits('update:x', -1)
    emits('update:y', -1)
}
</script>

<style scoped></style>
