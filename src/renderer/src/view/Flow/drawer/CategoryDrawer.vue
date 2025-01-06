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
                    <div v-if="categoryFrom.symbol === 'custom'" class="item">
                        <el-text class="mx-1" line-clamp="1">图片</el-text>
                        <el-upload
                            class="avatar-uploader"
                            :show-file-list="false"
                            :http-request="uploadAvatar"
                        >
                            <img v-if="symbolPath" :src="symbolPath.substring(8)" class="avatar" />
                            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                        </el-upload>
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
    { label: '图片', value: 'custom' }
]

const onOpen = () => {
    categoriesList.value = new Chart().getOption().series[0].categories
}
const onClose = () => {
    if (props.categoryFrom.symbol === 'custom') {
        props.categoryFrom.symbol = symbolPath.value
        symbolPath.value = ''
    }
    emit('close')
}

function onSelectChange(itemName) {
    const item = categoriesList.value.find((item) => item.name === itemName)
    console.log(item)
    props.categoryFrom.name = itemName
    props.categoryFrom.symbol = item.symbol
    props.categoryFrom.symbolSize = item.symbolSize
    props.categoryFrom.itemStyle.color = item.itemStyle?.color
    if (
        props.categoryFrom.symbol &&
        !symbolList.find((item) => item.value === props.categoryFrom.symbol)
    ) {
        props.categoryFrom.symbol = 'custom'
        symbolPath.value = item.symbol
    }
}

function uploadAvatar(param) {
    const file = param.file
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
        const img = new Image()
        img.src = reader.result
        img.onload = () => {
            const canvas = document.createElement('canvas')
            const size = Math.max(img.width, img.height)
            canvas.width = size
            canvas.height = size

            const ctx = canvas.getContext('2d')
            const ratio = Math.min(size / img.width, size / img.height)
            const x = (size - img.width * ratio) / 2
            const y = (size - img.height * ratio) / 2
            ctx.drawImage(img, x, y, img.width * ratio, img.height * ratio)

            symbolPath.value = `image://${canvas.toDataURL('image/png')}`
        }
    }
}
</script>

<style scoped>
@import url(./style.css);

.avatar-uploader :deep(.el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .avatar {
    width: 50px;
    height: 50px;
    object-fit: cover;
}

.avatar-uploader :deep(.el-upload:hover) {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 50px;
    height: 50px;
    text-align: center;
}
</style>
