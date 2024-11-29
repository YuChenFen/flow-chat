<template>
    <div style="display: flex; flex-direction: column; gap: 10px">
        <el-input v-model="description" placeholder="描述" />
        <div style="display: flex; align-items: center; gap: 10px">
            <el-upload :http-request="uploadContent" :show-file-list="false">
                <template #trigger>
                    <el-button type="primary">JSON 文件</el-button>
                </template>
            </el-upload>
            <el-tag v-show="fileName !== ''" size="large" @close="fileName = ''">
                {{ fileName }}
            </el-tag>
        </div>
        <el-upload class="avatar-uploader" :show-file-list="false" :http-request="uploadImage">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
    </div>
</template>

<script setup>
import { ref, useAttrs } from 'vue'

const { description, loadFile, loadImage } = useAttrs()
const upload = ref()
const fileName = ref('')
console.log(useAttrs())
const imageUrl = ref('')
function uploadContent({ file }) {
    upload.value?.clearFiles()
    fileName.value = file.name
    loadFile(file)
}
function uploadImage({ file }) {
    // 转为base64，可转blob
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
        imageUrl.value = reader.result
    }
    loadImage(file)
}
</script>

<style scoped>
.avatar-uploader :deep(.el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
    width: 100%;
    aspect-ratio: 16/9;
}

.avatar-uploader .avatar {
    width: 100%;
    aspect-ratio: 16/9;
    object-fit: cover;
}

.avatar-uploader :deep(.el-upload:hover) {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    text-align: center;
}
</style>
