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
import { ElMessageBox } from 'element-plus'
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
    currentEdge: {
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
        label: '删除关系'
    },
    {
        label: '查看内容'
    }
]
function onClick(item) {
    if (item.label === '删除关系') {
        chartInstance.removeEdge(props.currentEdge)
    } else if (item.label === '查看内容') {
        ElMessageBox({
            title: `${props.currentEdge.source}---${props.currentEdge.name}--->${props.currentEdge.target}`,
            message: () => {
                return h(MdPreview, {
                    text: props.currentEdge.content,
                    style: 'max-height: 60vh'
                })
            },
            customStyle: 'max-width: 60vw',
            dangerouslyUseHTMLString: true,
            showConfirmButton: false
        })
    }
    close()
}

function close() {
    emits('update:x', -1)
    emits('update:y', -1)
}
</script>

<style scoped></style>
