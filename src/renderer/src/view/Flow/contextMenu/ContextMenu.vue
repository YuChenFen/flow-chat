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
    <teleport defer to="#BrowserWindow">
        <NodeDrawer
            v-model:node-drawer="nodeDrawer"
            :node-from="nodeFrom"
            @close="addNode"
        ></NodeDrawer>
        <EdgeDrawer
            v-model:edge-drawer="edgeDrawer"
            :edge-from="edgeFrom"
            @close="addEdge"
        ></EdgeDrawer>
        <CategoryDrawer
            v-model:category-drawer="categoryDrawer"
            v-model:current-category-name="currentCategoryName"
            :category-from="categoryFrom"
            :is-change-category-name="isChangeCategoryName"
            @close="onCloseCategory"
        ></CategoryDrawer>
    </teleport>
</template>

<script setup>
import NodeDrawer from '../drawer/NodeDrawer.vue'
import EdgeDrawer from '../drawer/EdgeDrawer.vue'
import CategoryDrawer from '../drawer/CategoryDrawer.vue'
import { nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import ContextMenuView from '../../../components/ContextMenuView/ContextMenuView.vue'
import Chart from '../chart.js'
defineProps({
    x: {
        type: Number,
        required: true
    },
    y: {
        type: Number,
        required: true
    },
    tx: {
        type: Number,
        required: false
    },
    ty: {
        type: Number,
        required: false
    }
})
let chartInstance
nextTick(() => {
    chartInstance = new Chart()
})
const emits = defineEmits(['update:x', 'update:y'])
const isChangeCategoryName = ref(false)
const currentCategoryName = ref('')
const nodeDrawer = ref(false)
const edgeDrawer = ref(false)
const categoryDrawer = ref(false)
const nodeFrom = reactive({})
const edgeFrom = reactive({})
const categoryFrom = reactive({})
const dataArray = [
    {
        label: '添加节点'
    },
    {
        label: '添加关系'
    },
    {
        label: '类别',
        list: [
            {
                label: '添加类别'
            },
            {
                label: '修改类别'
            }
        ]
    }
]
function onClick(item) {
    close()
    if (item.label === '添加节点') {
        chartInstance.resetForm(nodeFrom, 'node')
        nodeDrawer.value = true
    } else if (item.label === '添加关系') {
        chartInstance.resetForm(edgeFrom, 'edge')
        edgeDrawer.value = true
    } else if (item.label === '添加类别') {
        chartInstance.resetForm(categoryFrom, 'category')
        isChangeCategoryName.value = false
        categoryDrawer.value = true
    } else if (item.label === '修改类别') {
        chartInstance.resetForm(categoryFrom, 'category')
        currentCategoryName.value = ''
        isChangeCategoryName.value = true
        categoryDrawer.value = true
    }
}

function addNode() {
    // echarts 调用后关系线位置错误
    // const { x, y } = chartInstance.convertFromPixel(props.tx, props.ty)
    // nodeFrom.x = props.tx
    // nodeFrom.y = props.ty
    chartInstance.addNode({ ...nodeFrom })
}
function addEdge() {
    chartInstance.addEdge({ ...edgeFrom })
}
function onCloseCategory() {
    if (isChangeCategoryName.value) {
        if (/^\s*$/.test(categoryFrom.name)) {
            chartInstance.removeCategory({ name: currentCategoryName.value })
        } else {
            chartInstance.updateCategory({ name: currentCategoryName.value }, { ...categoryFrom })
        }
    } else {
        chartInstance.addCategory({ ...categoryFrom })
    }
}

function close() {
    emits('update:x', -1)
    emits('update:y', -1)
}

// 快捷键
function keyboard(event) {
    const { ctrlKey, keyCode } = event
    if (ctrlKey) {
        switch (keyCode) {
            case 78:
                if (!nodeDrawer.value) {
                    chartInstance.resetForm(nodeFrom, 'node')
                    nodeDrawer.value = true
                }
                break
            case 69:
                if (!edgeDrawer.value) {
                    chartInstance.resetForm(edgeFrom, 'edge')
                    edgeDrawer.value = true
                }
                break
        }
    }
}
onMounted(() => {
    window.addEventListener('keydown', keyboard)
})
onBeforeUnmount(() => {
    window.removeEventListener('keydown', keyboard)
})
</script>

<style scoped></style>
