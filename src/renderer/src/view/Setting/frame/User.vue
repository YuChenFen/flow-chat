<template>
    <div class="container">
        <div class="anchor-container">
            <el-anchor
                :container="itemContainerRef"
                direction="vertical"
                type="default"
                @click="handleClick"
            >
                <el-anchor-link href="#用户信息" title="用户信息" />
            </el-anchor>
        </div>
        <div ref="itemContainerRef" class="item-container">
            <h3 id="用户信息">用户信息</h3>
            <el-descriptions :column="4" border direction="vertical">
                <el-descriptions-item :rowspan="2" :width="140" label="头像" align="center">
                    <el-image
                        v-if="!isChange"
                        style="width: 100px; height: 100px"
                        :src="userInfo.userAvatar"
                    />
                    <el-upload
                        v-else
                        class="avatar-uploader"
                        :show-file-list="false"
                        :http-request="uploadAvatar"
                    >
                        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                    </el-upload>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon>
                                <user />
                            </el-icon>
                            用户名
                        </div>
                    </template>
                    <p v-if="!isChange">{{ userInfo.userName }}</p>
                    <el-input v-else v-model="changeUserInfoForm.userName" />
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">性别</div>
                    </template>
                    <span v-if="!isChange">
                        <el-tag v-if="userInfo.gender === '男'" size="small"> 男 </el-tag>
                        <el-tag v-else-if="userInfo.gender === '女'" type="danger" size="small">
                            女
                        </el-tag>
                        <el-tag v-else size="small" type="warning"> 未知 </el-tag>
                    </span>
                    <el-radio-group v-else v-model="changeUserInfoForm.gender" size="small">
                        <el-radio label="男" value="男"></el-radio>
                        <el-radio label="女" value="女"></el-radio>
                        <el-radio label="" value="" style="display: none"></el-radio>
                    </el-radio-group>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">身份</div>
                    </template>
                    <span>
                        <el-tag
                            v-if="userInfo.userRole === 'superAdmin'"
                            type="primary"
                            size="small"
                            round
                        >
                            超级管理员
                        </el-tag>
                        <el-tag
                            v-else-if="userInfo.userRole === 'admin'"
                            type="success"
                            size="small"
                            round
                        >
                            管理员
                        </el-tag>
                        <el-tag
                            v-else-if="userInfo.userRole === 'user'"
                            type="info"
                            size="small"
                            round
                        >
                            用户
                        </el-tag>
                    </span>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon>
                                <iphone />
                            </el-icon>
                            电话
                        </div>
                    </template>
                    <p v-if="!isChange">{{ userInfo.phone }}</p>
                    <el-input v-else v-model="changeUserInfoForm.phone" />
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon>
                                <tickets />
                            </el-icon>
                            邮箱
                        </div>
                    </template>
                    <p v-if="!isChange">{{ userInfo.email }}</p>
                    <el-input v-else v-model="changeUserInfoForm.email" />
                </el-descriptions-item>
            </el-descriptions>
            <div v-if="!isChange" style="display: flex; justify-content: flex-end">
                <el-button type="primary" @click="setUserInfo">修改信息</el-button>
                <el-button type="danger" @click="logout">注销</el-button>
            </div>
            <div v-else style="display: flex; justify-content: flex-end">
                <el-button type="primary" @click="changeUserInfo">确定</el-button>
                <el-button type="danger" @click="isChange = false">取消</el-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { getUserInfo, updateUserInfo } from '../../../api/user'
import { ElMessage } from 'element-plus'
const itemContainerRef = ref(null)
const isChange = ref(false)
const userInfo = reactive({
    userAvatar: '',
    userName: '',
    gender: '',
    phone: '',
    email: '',
    userRole: ''
})

function init() {
    getUserInfo().then((data) => {
        for (let key in data) {
            userInfo[key] = data[key]
        }
    })
}
init()

const handleClick = (e) => {
    e.preventDefault()
}

function setUserInfo() {
    for (let key in userInfo) {
        changeUserInfoForm[key] = userInfo[key]
    }
    imageUrl.value = changeUserInfoForm.userAvatar
    isChange.value = true
}
function logout() {
    window.electron.ipcRenderer.send('close')
    window.electron.ipcRenderer.send('openLoginWindow')
}

const imageUrl = ref('')
watch(imageUrl, (_, oldValue) => {
    URL.revokeObjectURL(oldValue)
})
// 修改信息
const changeUserInfoForm = reactive({
    userAvatar: '',
    userName: '',
    gender: '',
    phone: '',
    email: ''
})
function uploadAvatar({ file }) {
    imageUrl.value = URL.createObjectURL(file)
    changeUserInfoForm.userAvatar = file
}

async function changeUserInfo() {
    if (typeof changeUserInfoForm.userAvatar !== 'object') {
        delete changeUserInfoForm.userAvatar
    }
    const code = await updateUserInfo(changeUserInfoForm)
    if (code === 200) {
        isChange.value = false
        init()
        ElMessage({
            message: '修改成功',
            type: 'success',
            duration: 2000,
            offset: 46
        })
    } else {
        ElMessage({
            message: '修改失败',
            type: 'error',
            duration: 2000,
            offset: 46
        })
    }
}
</script>

<style scoped>
@import url(./style.css);

.cell-item {
    display: flex;
    align-items: center;
    gap: 5px;
}

.avatar-uploader :deep(.el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .avatar {
    width: 100px;
    height: 100px;
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
