<template>
    <el-drawer v-model="nodeDrawer" :with-header="false" @open="onOpen" @close="onClose">
        <div class="item-group">
            <div class="item-title">
                <el-text class="mx-1" line-clamp="1" size="large" type="primary">基本信息</el-text>
            </div>
            <div class="item">
                <el-text class="mx-1" line-clamp="1">节点名称</el-text>
                <el-input v-model="nodeFrom.name" />
            </div>
            <div class="item">
                <el-text class="mx-1" line-clamp="1">节点类别</el-text>
                <el-select v-model="nodeFrom.category" placeholder="节点类别" filterable>
                    <el-option
                        v-for="item in categoriesNameList"
                        :key="item"
                        :label="item"
                        :value="item"
                    />
                    <template #empty>
                        <el-text type="danger">无类别</el-text>
                    </template>
                </el-select>
            </div>
            <div class="item">
                <el-text class="mx-1 lable-top" line-clamp="1">节点内容</el-text>
                <!-- <el-input v-model="nodeFrom.content" type="textarea" /> -->
            </div>
            <div class="item">
                <MdEditor
                    v-model:text="nodeFrom.content"
                    :preview="false"
                    :toolbars="[]"
                    style="height: 300px"
                ></MdEditor>
            </div>
        </div>
    </el-drawer>
</template>

<script setup>
import { ref } from 'vue'
import Chart from '../chart.js'
import MdEditor from '@renderer/components/MdEditor.vue'

const nodeDrawer = defineModel('nodeDrawer')
defineProps({
    nodeFrom: Object
})
const emit = defineEmits(['close'])
const categoriesNameList = ref([])

const onOpen = () => {
    categoriesNameList.value = new Chart().getOption().series[0].categories.map((item) => item.name)
}
const onClose = () => {
    emit('close')
}
</script>

<style scoped>
@import url(./style.css);
</style>
