<template>
    <div class="flow-container user-select-none">
        <div id="echart-container">
            <teleport to="body">
                <ContextMenu
                    v-model:x="contextmenuX"
                    v-model:y="contextmenuY"
                    :tx="contextmenuTX"
                    :ty="contextmenuTY"
                >
                </ContextMenu>
                <NodeContextMenu
                    v-model:x="nodeContextmenuX"
                    v-model:y="nodeContextmenuY"
                    :current-node="currentNode"
                ></NodeContextMenu>
                <EdgeContextMenu
                    v-model:x="edgeContextmenuX"
                    v-model:y="edgeContextmenuY"
                    :current-edge="currentEdge"
                ></EdgeContextMenu>
            </teleport>
            <teleport defer to="#BrowserWindow">
                <NodeDrawer
                    v-model:node-drawer="nodeDrawer"
                    :node-from="nodeFrom"
                    @close="nodeDrawerClose"
                ></NodeDrawer>
                <EdgeDrawer
                    v-model:edge-drawer="edgeDrawer"
                    :edge-from="edgeFrom"
                    @close="edgeDrawerClose"
                ></EdgeDrawer>
            </teleport>
        </div>
        <div class="search-container">
            <el-input v-model="filterValue" placeholder="请输入筛选条件" @keypress.enter="filter" />
            <el-button type="primary" @click="filter">搜索</el-button>
        </div>
    </div>
</template>

<script setup>
import Chart from './chart.js'
import NodeDrawer from './drawer/NodeDrawer.vue'
import EdgeDrawer from './drawer/EdgeDrawer.vue'
import ContextMenu from './contextMenu/ContextMenu.vue'
import NodeContextMenu from './contextMenu/NodeContextMenu.vue'
import EdgeContextMenu from './contextMenu/EdgeContextMenu.vue'
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useFlowStore } from '../../store/flowStore.js'
const contextmenuX = ref(-1)
const contextmenuY = ref(-1)
const contextmenuTX = ref(-1)
const contextmenuTY = ref(-1)
const nodeContextmenuX = ref(-1)
const nodeContextmenuY = ref(-1)
const edgeContextmenuX = ref(-1)
const edgeContextmenuY = ref(-1)
let chartInstance
const { getOption, setOption } = useFlowStore()
const filterValue = ref('')
const nodeDrawer = ref(false)
const edgeDrawer = ref(false)
const nodeFrom = reactive({})
const edgeFrom = reactive({})
const currentNode = ref({})
const currentEdge = ref({})

onMounted(() => {
    chartInstance = new Chart('echart-container', true)
    const option = getOption()
    if (option) {
        chartInstance.fromJson(option)
    }
    chartInstance.chart.on('dblclick', chartdbClick)
    chartInstance.chart.on('contextmenu', chartContextmenu)
    chartInstance.chart.getZr().on('contextmenu', onContextmenu)
})

function chartdbClick(e) {
    if (e.dataType === 'node') {
        modifyNode(e)
    } else if (e.dataType === 'edge') {
        modifyEdge(e)
    }
    // console.log(e)
}
function chartContextmenu(e) {
    console.log(e)
    if (e.dataType === 'node') {
        nodeContextmenuX.value = e.event.event.x
        nodeContextmenuY.value = e.event.event.y
        currentNode.value = e.data
    } else if (e.dataType === 'edge') {
        edgeContextmenuX.value = e.event.event.x
        edgeContextmenuY.value = e.event.event.y
        currentEdge.value = e.data
    }
}
function modifyNode(e) {
    nodeDrawer.value = true
    chartInstance.resetForm(nodeFrom, 'node', e.data)
    currentNode.value = e.data
}
function modifyEdge(e) {
    edgeDrawer.value = true
    chartInstance.resetForm(edgeFrom, 'edge', e.data)
    currentEdge.value = e.data
}
function onContextmenu({ event, target }) {
    event.preventDefault()
    if (!target) {
        contextmenuX.value = event.x
        contextmenuY.value = event.y
        contextmenuTX.value = event.zrX
        contextmenuTY.value = event.zrY
    }
}

function nodeDrawerClose() {
    chartInstance.updateNode(currentNode.value, { ...nodeFrom })
}
function edgeDrawerClose() {
    chartInstance.updateEdge(currentEdge.value, { ...edgeFrom })
}

function filter() {
    let option = chartInstance.getOption()
    let set = new Set()
    let node = option.series[0].data
    let edge = option.series[0].links
    const searchSet = new Set(
        node.filter((x) => x.name.indexOf(filterValue.value) !== -1).map((x) => x.name)
    )
    for (let i of searchSet) {
        set.add(i)
    }
    edge.filter((x) => searchSet.has(x.source) || searchSet.has(x.target)).forEach((x) => {
        set.add(x.source)
        set.add(x.target)
    })

    option.series[0].data.forEach((x) => {
        if (set.has(x.name)) {
            if (x.category === -1) {
                x.category = x.tempCategory
            }
            delete x.tempCategory
        } else {
            if (x.category !== -1) {
                x.tempCategory = x.category
            }
            x.category = -1
        }
    })
    chartInstance.setOption(option)
}

onBeforeUnmount(() => {
    setOption(chartInstance.toJson())
    chartInstance.chart.off('dblclick')
    chartInstance.chart.off('contextmenu')
    chartInstance.chart.getZr().off('contextmenu')
    chartInstance.destroy()
})
</script>

<style scoped>
.flow-container,
#echart-container {
    width: 100%;
    height: 100%;
    position: relative;
}
.flow-container {
    background-size: 25px 25px;
    background-position: center center;
    background-image: linear-gradient(to right, #cbd5e1 0.5px, transparent 0.5px),
        linear-gradient(to bottom, #cbd5e1 0.5px, transparent 0.5px);
    /* -webkit-mask-image: linear-gradient(
            to bottom,
            transparent,
            #fff 50px calc(100% - 50px),
            transparent
        ),
        linear-gradient(to right, transparent, #fff 50px calc(100% - 50px), transparent);
    mask-image: linear-gradient(to bottom, transparent, #fff 50px calc(100% - 50px), transparent),
        linear-gradient(to right, transparent, #fff 50px calc(100% - 50px), transparent);
    mask-composite: intersect;
    -webkit-mask-composite: source-in, xor; */
}
.item-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .item {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .mx-1 {
            width: 6rem;
        }
    }
}
.search-container {
    position: absolute;
    bottom: 0;
    right: 0;
    margin: 5px;
    display: flex;
    gap: 10px;
}
</style>
