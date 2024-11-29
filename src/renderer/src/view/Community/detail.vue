<template>
    <div class="detail">
        <header>
            <div class="left">
                <el-icon class="back" size="22px" @click="back"><Back /></el-icon>
                <el-text class="title">{{ data.description }}</el-text>
            </div>
            <div class="right">
                <el-button type="primary" icon="Edit" @click="toEdit">转到编辑器</el-button>
            </div>
        </header>
        <main>
            <div id="detail-chart"></div>
            <div class="detail-info"></div>
        </main>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ChartTemplate from './chart'
import { getCommunityDetail } from '../../api/community'
import { useFlowStore } from '../../store/flowStore'
const route = useRoute()
const router = useRouter()
const { setOption } = useFlowStore()

const data = ref({})

console.log(route.params.id)

onMounted(async () => {
    const chartTemplate = new ChartTemplate('detail-chart', true)

    data.value = await getCommunityDetail(route.params.id)
    chartTemplate.fromJson(data.value.option)
})

function back() {
    router.back()
}
function toEdit() {
    setOption(data.value.option)
    router.push({ name: '知识图谱' })
}
</script>

<style scoped>
.detail {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

header {
    width: 100%;
    height: 40px;
    flex: 0 0 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #c0c0c0;

    .left {
        display: flex;
        align-items: center;
        gap: 10px;
        .back {
            margin-left: 10px;
            cursor: pointer;

            &:hover > :deep(svg) {
                color: #409eff;
            }
        }
        .title {
            padding: 0 10px;
            font-size: 1rem;
            color: #333;
            font-weight: 600;
            position: relative;

            &::after {
                content: '';
                position: absolute;
                left: 0;
                height: 100%;
                width: 2px;
                background-color: #333;
                transform: rotateZ(10deg);
            }
        }
    }

    .right {
        padding: 0 5px;
    }
}

main {
    flex: 1;
    display: flex;

    #detail-chart {
        width: 100%;
        height: 100%;
        flex: 1;
    }

    .detail-info {
        width: 25%;
        height: 100%;
        flex: 0 0 25%;
        border-left: 1px solid #c0c0c0;
    }
}
</style>
