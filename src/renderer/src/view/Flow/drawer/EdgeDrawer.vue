<template>
    <el-drawer v-model="edgeDrawer" :with-header="false" @open="onOpen" @close="onClose">
        <div class="item-group">
            <div class="item-title">
                <el-text class="mx-1" line-clamp="1" size="large" type="primary">关系</el-text>
            </div>
        </div>
        <el-tabs type="border-card">
            <el-tab-pane label="基本信息">
                <div class="item-group">
                    <div class="item">
                        <el-text class="mx-1" line-clamp="1">源节点</el-text>
                        <el-select v-model="edgeFrom.source" placeholder="源节点" filterable>
                            <el-option
                                v-for="item in nodeNameList"
                                :key="item"
                                :label="item"
                                :value="item"
                                :disabled="item === edgeFrom.target"
                            />
                            <template #empty>
                                <el-text type="danger">无节点</el-text>
                            </template>
                        </el-select>
                    </div>
                    <div class="item">
                        <el-text class="mx-1" line-clamp="1">目标节点</el-text>
                        <el-select v-model="edgeFrom.target" placeholder="目标节点" filterable>
                            <el-option
                                v-for="item in nodeNameList"
                                :key="item"
                                :label="item"
                                :value="item"
                                :disabled="item === edgeFrom.source"
                            />
                            <template #empty>
                                <el-text type="danger">无节点</el-text>
                            </template>
                        </el-select>
                    </div>
                    <div class="item">
                        <el-text class="mx-1" line-clamp="1">关系名称</el-text>
                        <el-input v-model="edgeFrom.name" />
                    </div>
                    <div class="item">
                        <el-text class="mx-1 lable-top" line-clamp="1">关系内容</el-text>
                        <!-- <el-input v-model="edgeFrom.content" type="textarea" /> -->
                    </div>
                    <div class="item">
                        <MdEditor
                            v-model:text="edgeFrom.content"
                            :preview="false"
                            :toolbars="[]"
                            style="height: 300px"
                        ></MdEditor>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="样式">
                <div class="item-group">
                    <el-divider content-position="left">线条</el-divider>
                    <div class="item">
                        <el-text class="mx-1" line-clamp="1">颜色</el-text>
                        <el-color-picker v-model="edgeFrom.lineStyle.color" show-alpha />
                    </div>
                    <div class="item">
                        <el-text class="mx-1" line-clamp="1">类型</el-text>
                        <el-select v-model="edgeFrom.lineStyle.type" placeholder="关系类型">
                            <el-option label="直线" value="solid" />
                            <el-option label="虚线" value="dashed" />
                            <el-option label="点线" value="dotted" />
                        </el-select>
                    </div>
                    <div class="item">
                        <el-text class="mx-1" line-clamp="1">宽度</el-text>
                        <el-input-number v-model="edgeFrom.lineStyle.width" :min="0" />
                    </div>
                    <div class="item">
                        <el-text class="mx-1" line-clamp="1">曲度</el-text>
                        <el-input-number
                            v-model="edgeFrom.lineStyle.curveness"
                            :min="0"
                            :max="1"
                            :step="0.1"
                        />
                    </div>
                    <el-divider content-position="left">文本</el-divider>
                    <div class="item">
                        <el-text class="mx-1" line-clamp="1">字体颜色</el-text>
                        <el-color-picker v-model="edgeFrom.label.color" show-alpha />
                    </div>
                    <div class="item">
                        <el-text class="mx-1" line-clamp="1">字体大小</el-text>
                        <el-input-number v-model="edgeFrom.label.fontSize" :min="0" />
                    </div>
                    <div class="item">
                        <el-text class="mx-1" line-clamp="1">字体粗细</el-text>
                        <el-select v-model="edgeFrom.label.fontWeight" placeholder="字体粗细">
                            <el-option label="细" value="lighter" />
                            <el-option label="正常" value="normal" />
                            <el-option label="粗" value="bold" />
                            <el-option label="特粗" value="bolder" />
                        </el-select>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </el-drawer>
</template>

<script setup>
import { ref } from 'vue'
import Chart from '../chart.js'
import MdEditor from '@renderer/components/MdEditor.vue'

const edgeDrawer = defineModel('edgeDrawer')
defineProps({
    edgeFrom: Object
})
const emit = defineEmits(['close'])
const nodeNameList = ref([])
const onOpen = () => {
    nodeNameList.value = new Chart().getOption().series[0].data.map((item) => item.name)
}
const onClose = () => {
    emit('close')
}
</script>

<style scoped>
@import url(./style.css);
</style>
