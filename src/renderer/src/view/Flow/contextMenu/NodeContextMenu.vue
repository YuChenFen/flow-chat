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
import { nextTick } from 'vue'
import ContextMenuView from '../../../components/ContextMenuView/ContextMenuView.vue'
import Chart from '../chart.js'
import { ElMessageBox } from 'element-plus'
import { marked } from 'marked'
const props = defineProps({
    x: {
        type: Number,
        required: true
    },
    y: {
        type: Number,
        required: true
    },
    currentNode: {
        type: Object,
        required: true
    }
})
let chartInstance
nextTick(() => {
    chartInstance = new Chart()
})
const emits = defineEmits(['update:x', 'update:y'])
const dataArray = [
    {
        label: '删除节点'
    },
    {
        label: '查看内容'
    },
    {
        label: 'AI 扩展'
    }
]
function onClick(item) {
    if (item.label === '删除节点') {
        chartInstance.removeNode(props.currentNode)
    } else if (item.label === '查看内容') {
        const HTMLString = `<div class="markdown-body" style="max-height: 70vh;overflow: auto;">${marked.parse(props.currentNode.content)}<div>`
        ElMessageBox.alert(HTMLString, props.currentNode.name, {
            dangerouslyUseHTMLString: true,
            showConfirmButton: false
        })
    } else if (item.label === 'AI 扩展') {
        chartInstance.aiExtend(props.currentNode)
    }
    close()
}

function close() {
    emits('update:x', -1)
    emits('update:y', -1)
}
</script>

<style scoped></style>
