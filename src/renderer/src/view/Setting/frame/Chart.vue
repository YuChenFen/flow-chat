<template>
    <div class="container">
        <div class="anchor-container">
            <el-anchor
                :container="itemContainerRef"
                direction="vertical"
                type="default"
                @click="handleClick"
            >
                <el-anchor-link href="#基本设置-chart" title="基本设置" />
                <el-anchor-link href="#力引导布局" title="力引导布局" />
            </el-anchor>
        </div>
        <div ref="itemContainerRef" class="item-container">
            <h3 id="基本设置-chart">基本设置</h3>
            <div class="card">
                <el-text size="large" class="title">标题</el-text>
                <el-text class="description">标题，仅在本地编辑时有效</el-text>
                <el-input
                    v-model="title"
                    placeholder="请输入标题"
                    style="width: 30%; min-width: 300px"
                    @change="(val) => (config.chart.title = val)"
                />
            </div>
            <div class="card">
                <el-text size="large" class="title">布局方式</el-text>
                <el-text class="description">图的布局方式</el-text>
                <el-select
                    v-model="layout"
                    placeholder="选择布局方式"
                    style="width: 240px"
                    @change="(val) => (config.chart.layout = val)"
                >
                    <el-option label="力引导布局" value="force" />
                    <el-option label="环形布局" value="circular" />
                    <!-- <el-option label="无布局" value="none" /> -->
                </el-select>
            </div>
            <div class="card">
                <el-text size="large" class="title">图例位置</el-text>
                <el-text class="description">图例的位置（对应的空值为null）</el-text>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px">
                    <el-autocomplete
                        v-model="legendTop"
                        :fetch-suggestions="legendQuerySearch"
                        :trigger-on-focus="false"
                        clearable
                        placeholder="top"
                        style="width: 30%; min-width: 300px"
                        @change="(val) => (config.chart.legend.top = val)"
                    />
                    <el-autocomplete
                        v-model="legendBottom"
                        :fetch-suggestions="legendQuerySearch"
                        :trigger-on-focus="false"
                        clearable
                        placeholder="bottom"
                        style="width: 30%; min-width: 300px"
                        @change="(val) => (config.chart.legend.bottom = val)"
                    />
                    <el-autocomplete
                        v-model="legendLeft"
                        :fetch-suggestions="legendQuerySearch"
                        :trigger-on-focus="false"
                        clearable
                        placeholder="left"
                        style="width: 30%; min-width: 300px"
                        @change="(val) => (config.chart.legend.left = val)"
                    />
                    <el-autocomplete
                        v-model="legendRight"
                        :fetch-suggestions="legendQuerySearch"
                        :trigger-on-focus="false"
                        clearable
                        placeholder="right"
                        style="width: 30%; min-width: 300px"
                        @change="(val) => (config.chart.legend.right = val)"
                    />
                </div>
            </div>
            <div class="card">
                <el-text size="large" class="title">图例布局</el-text>
                <el-text class="description">图例的布局方向</el-text>
                <el-select
                    v-model="legendOrient"
                    placeholder="选择图例方向"
                    style="width: 240px"
                    @change="(val) => (config.chart.legend.orient = val)"
                >
                    <el-option label="水平" value="horizontal" />
                    <el-option label="垂直" value="vertical" />
                </el-select>
            </div>
            <h3 id="力引导布局">力引导布局</h3>
            <div class="card">
                <el-text size="large" class="title">引力因子</el-text>
                <el-text class="description"
                    >节点受到的向中心的引力因子。该值越大节点越往中心点靠拢</el-text
                >
                <el-input-number
                    v-model="forceGravity"
                    size="small"
                    :min="0"
                    :step="0.1"
                    @change="(val) => (config.chart.force.gravity = val)"
                />
            </div>
            <div class="card">
                <el-text size="large" class="title">斥力因子</el-text>
                <el-text class="description">节点之间的斥力因子,值越大则斥力越大</el-text>
                <el-input-number
                    v-model="forceRepulsion"
                    size="small"
                    :min="0"
                    @change="(val) => (config.chart.force.repulsion = val)"
                />
            </div>
            <div class="card">
                <el-text size="large" class="title">线条长度范围</el-text>
                <el-text class="description"
                    >边的两个节点之间的距离，这个距离也会受斥力因子影响</el-text
                >
                <div style="display: flex; align-items: center; gap: 35px">
                    <div style="display: flex; align-items: center; gap: 15px">
                        <el-text>最小值</el-text>
                        <el-input-number
                            v-model="forceMinEdgeLength"
                            size="small"
                            :min="0"
                            :max="forceMaxEdgeLength"
                            @change="(val) => (config.chart.force.edgeLength.min = val)"
                        />
                    </div>
                    <el-text size="large">~</el-text>
                    <div style="display: flex; align-items: center; gap: 15px">
                        <el-text>最大值</el-text>
                        <el-input-number
                            v-model="forceMaxEdgeLength"
                            size="small"
                            :min="forceMinEdgeLength"
                            @change="(val) => (config.chart.force.edgeLength.max = val)"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import config from '@renderer/assets/js/config'
const itemContainerRef = ref(null)
const title = ref(config.chart.title)
const layout = ref(config.chart.layout)
const forceGravity = ref(config.chart.force.gravity)
const forceRepulsion = ref(config.chart.force.repulsion)
const forceMinEdgeLength = ref(config.chart.force.edgeLength.min)
const forceMaxEdgeLength = ref(config.chart.force.edgeLength.max)
const legendTop = ref(config.chart.legend.top)
const legendLeft = ref(config.chart.legend.left)
const legendRight = ref(config.chart.legend.right)
const legendBottom = ref(config.chart.legend.bottom)
const legendOrient = ref(config.chart.legend.orient)

const handleClick = (e) => {
    e.preventDefault()
}

function legendQuerySearch(queryString, cb) {
    const results = 'center'.startsWith(queryString) ? [{ value: 'center' }] : []
    cb(results)
}
</script>

<style scoped>
@import url(./style.css);
</style>
