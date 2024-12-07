<template>
    <el-menu
        :default-active="NavActive"
        class="el-menu-vertical user-select-none"
        :collapse="true"
        @select="onClick"
    >
        <div>
            <el-menu-item index="首页">
                <el-icon><HomeFilled /></el-icon>
                <template #title>
                    <span>首页</span>
                </template>
            </el-menu-item>
            <el-menu-item index="知识图谱">
                <el-icon><DataLine /></el-icon>
                <template #title>
                    <span>知识图谱</span>
                </template>
            </el-menu-item>
            <el-menu-item index="对话">
                <el-icon>
                    <el-badge
                        :max="99"
                        :value="unreadMessageCount"
                        :hidden="unreadMessageCount === 0"
                        :offset="[5]"
                    >
                        <ChatDotSquare />
                    </el-badge>
                </el-icon>
                <template #title>
                    <span>对话</span>
                </template>
            </el-menu-item>
            <el-menu-item index="社区">
                <el-icon><Link /></el-icon>
                <template #title>
                    <span>社区</span>
                </template>
            </el-menu-item>
            <el-menu-item v-if="role === 'admin' || role === 'superAdmin'" index="用户管理">
                <el-icon><Notebook /></el-icon>
                <template #title>
                    <span>用户管理</span>
                </template>
            </el-menu-item>
            <el-menu-item v-if="role === 'admin' || role === 'superAdmin'" index="社区管理">
                <el-icon><TakeawayBox /></el-icon>
                <template #title>
                    <span>社区管理</span>
                </template>
            </el-menu-item>
        </div>
        <div>
            <el-menu-item index="设置">
                <el-icon><Setting /></el-icon>
                <template #title>
                    <span>设置</span>
                </template>
            </el-menu-item>
        </div>
    </el-menu>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useChatStore } from '../../store/chatStore'
import { storeToRefs } from 'pinia'
const router = useRouter()
const NavActive = ref('首页')
const role = ref('')
const { unreadMessageCount } = storeToRefs(useChatStore())

setTimeout(() => {
    nextTick(() => {
        role.value = sessionStorage.getItem('role')
    })
}, 100)

watch(
    () => router.currentRoute.value.name,
    (val) => {
        NavActive.value = val
    }
)

function onClick(item) {
    router.push({ name: item })
}
</script>

<style scoped>
.el-menu-vertical {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
</style>
