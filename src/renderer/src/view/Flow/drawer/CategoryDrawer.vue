<template>
    <el-drawer v-model="categoryDrawer" :with-header="false" @open="onOpen" @close="onClose">
        <div class="item-group">
            <div class="item-title">
                <el-text class="mx-1" line-clamp="1" size="large" type="primary">类别</el-text>
                <el-select
                    v-show="isChangeCategoryName"
                    v-model="currentCategoryName"
                    placeholder="原类别"
                    style="width: 50%"
                    @change="onSelectChange"
                >
                    <el-option
                        v-for="item in categoriesList"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name"
                    />
                </el-select>
            </div>
        </div>
        <el-tabs type="border-card">
            <el-tab-pane label="基本信息">
                <div class="item-group">
                    <div class="item">
                        <el-text class="mx-1" line-clamp="1">类别名称</el-text>
                        <el-input v-model="categoryFrom.name" />
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="样式">
                <div class="item-group">
                    <div class="item">
                        <el-text class="mx-1" line-clamp="1">类别形状</el-text>
                        <el-select v-model="categoryFrom.symbol" placeholder="类别形状">
                            <el-option
                                v-for="item in symbolList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </div>
                    <div class="item">
                        <el-text class="mx-1" line-clamp="1">路径</el-text>
                        <el-input
                            v-model="symbolPath"
                            placeholder="自定义路径（image://或path://）"
                            :disabled="categoryFrom.symbol !== 'custom'"
                        />
                    </div>
                    <div class="item">
                        <el-text class="mx-1" line-clamp="1">类别大小</el-text>
                        <el-input-number v-model="categoryFrom.symbolSize" />
                    </div>
                    <div class="item">
                        <el-text class="mx-1" line-clamp="1">类别颜色</el-text>
                        <el-color-picker v-model="categoryFrom.itemStyle.color" show-alpha />
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </el-drawer>
</template>

<script setup>
import { ref } from 'vue'
import Chart from '../chart.js'
const categoryDrawer = defineModel('categoryDrawer')
const currentCategoryName = defineModel('currentCategoryName')
const props = defineProps({
    categoryFrom: Object,
    isChangeCategoryName: Boolean
})
const emit = defineEmits(['close'])
const categoriesList = ref([])
const symbolPath = ref('')
// const symbolList = ['circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', '自定义']
const symbolList = [
    { label: '圆形', value: 'circle' },
    { label: '长方形', value: 'rect' },
    { label: '长方形（圆角）', value: 'roundRect' },
    { label: '三角形', value: 'triangle' },
    { label: '菱形', value: 'diamond' },
    { label: '箭头', value: 'arrow' },
    { label: '针头', value: 'pin' },
    { label: '自定义', value: 'custom' }
]

const onOpen = () => {
    categoriesList.value = new Chart().getOption().series[0].categories
}
const onClose = () => {
    if (props.categoryFrom.symbol === 'custom') {
        props.categoryFrom.symbol = symbolPath.value
    }
    emit('close')
}

function onSelectChange(itemName) {
    const item = categoriesList.value.find((item) => item.name === itemName)
    props.categoryFrom.name = itemName
    props.categoryFrom.symbol = item.symbol
    props.categoryFrom.symbolSize = item.symbolSize
    props.categoryFrom.itemStyle.color = item.itemStyle?.color
    if (props.categoryFrom.symbol && symbolList.indexOf(props.categoryFrom.symbol) === -1) {
        props.categoryFrom.symbol = 'custom'
        symbolPath.value = item.symbol
    }
}
</script>

<style scoped>
@import url(./style.css);
</style>
