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
import config from '../../../assets/js/config.js'
const props = defineProps({
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
            },
            {
                label: '整体类别大小',
                list: [
                    {
                        label: '放大'
                    },
                    {
                        label: '缩小'
                    }
                ]
            }
        ]
    },
    {
        label: '收起全部节点'
    }
]

if (config.chart.layout === 'force') {
    dataArray.push({
        label: '更多选项',
        list: [
            {
                label: '设置固定坐标'
            }
        ]
    })
}
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
    } else if (item.label === '收起全部节点') {
        const option = chartInstance.getOption()
        const set = new Set()
        const edges = option.series[0].links
        edges.forEach((edge) => {
            if (!set.has(edge.target)) {
                set.add(edge.target)
            }
        })
        option.series[0].data.forEach((node) => {
            if (set.has(node.name)) {
                if (node.category !== -1) {
                    node.tempCategory = node.category
                }
                node.category = -1
            } else {
                if (node.category === -1) {
                    node.category = node.tempCategory
                }
                delete node.tempCategory
            }
        })
        chartInstance.setOption(option)
    } else if (item.label === '设置固定坐标') {
        const option = chartInstance.getOption()
        const layout = chartInstance.getLayout()
        layout.map((item, index) => {
            option.series[0].data[index].x = item[0]
            option.series[0].data[index].y = item[1]
        })
        chartInstance.setOption(option)
    } else if (item.label === '放大') {
        const option = chartInstance.getOption()
        option.series[0].categories.forEach((item) => {
            item.symbolSize = Math.floor(item.symbolSize * 2)
        })
        chartInstance.setOption(option)
    } else if (item.label === '缩小') {
        const option = chartInstance.getOption()
        option.series[0].categories.forEach((item) => {
            item.symbolSize = Math.floor(item.symbolSize / 2)
        })
        chartInstance.setOption(option)
    }
}

function addNode() {
    // echarts 调用后关系线位置错误
    if (config.chart.layout === 'none') {
        const { x, y } = chartInstance.convertFromPixel(props.tx, props.ty)
        nodeFrom.x = x
        nodeFrom.y = y
    }
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
