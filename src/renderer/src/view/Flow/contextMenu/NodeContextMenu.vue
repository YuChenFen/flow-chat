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
import { h, nextTick } from 'vue'
import ContextMenuView from '../../../components/ContextMenuView/ContextMenuView.vue'
import Chart from '../chart.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import MdPreview from '@renderer/components/MdPreview.vue'
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
        label: '内容',
        list: [
            {
                label: '展开'
            },
            {
                label: '收起'
            }
        ]
    },
    {
        label: 'AI 扩展'
    }
]
function onClick(item) {
    if (item.label === '删除节点') {
        chartInstance.removeNode(props.currentNode)
    } else if (item.label === '查看内容') {
        ElMessageBox({
            title: props.currentNode.name,
            message: () => {
                return h(MdPreview, {
                    text: props.currentNode.content,
                    style: 'max-height: 60vh'
                })
            },
            customStyle: 'max-width: 60vw',
            dangerouslyUseHTMLString: true,
            showConfirmButton: false
        })
    } else if (item.label === '展开') {
        let option = chartInstance.getOption()
        const set = new Set()
        const nodeName = props.currentNode.name
        const edges = option.series[0].links
        edges.forEach((edge) => {
            if (edge.source === nodeName && !set.has(edge.target)) {
                set.add(edge.target)
            }
        })
        if (set.size === 0) {
            ElMessage({
                message: '没有可以展开的节点',
                type: 'warning',
                offset: 46,
                duration: 1000
            })
            return
        }
        option.series[0].data.forEach((node) => {
            if (set.has(node.name)) {
                if (node.category === -1) {
                    node.category = node.tempCategory
                }
                delete node.tempCategory
            }
        })
        chartInstance.setOption(option)
    } else if (item.label === '收起') {
        let option = chartInstance.getOption()
        const set = new Set()
        const nodeName = props.currentNode.name
        const edges = option.series[0].links
        edges.forEach((edge) => {
            if (edge.source === nodeName && !set.has(edge.target)) {
                set.add(edge.target)
            }
        })
        if (set.size === 0) {
            ElMessage({
                message: '该节点无子节点',
                type: 'warning',
                offset: 46,
                duration: 1000
            })
            return
        }
        option.series[0].data.forEach((node) => {
            if (set.has(node.name)) {
                if (node.category !== -1) {
                    node.tempCategory = node.category
                }
                node.category = -1
            }
        })
        chartInstance.setOption(option)
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
