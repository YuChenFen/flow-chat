<template>
    <div class="collaboration-box flex-center">
        <h2>实时协作</h2>
        <span v-if="!isCollaboration" class="flex-center">
            <p style="margin: 20px 0">你可以加入或创建房间邀请其他人到画面中与你协作。</p>
            <el-input
                v-model="roomKey"
                placeholder="房间号（若创建房间请留空）"
                style="margin-bottom: 20px"
            />
            <el-button
                v-if="roomKey === ''"
                type="primary"
                icon="VideoPlay"
                size="large"
                @click="start"
                >开始会话</el-button
            >
            <el-button v-else type="primary" icon="VideoPlay" size="large" @click="join"
                >加入会话</el-button
            >
        </span>
        <span v-else class="flex-center">
            <div
                style="
                    width: 100%;
                    margin-top: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 10px;
                "
            >
                <p style="font-size: 1rem; width: 100%; display: flex; align-items: center">
                    <span style="width: 4rem">房间号：</span>
                    <span
                        style="
                            border-radius: 5px;
                            border: 1px solid #777;
                            padding: 4px 10px;
                            flex: 1;
                        "
                        >{{ roomKey }}</span
                    >
                </p>
                <el-button type="primary" icon="CopyDocument" @click="copyRoomKey"
                    >复制号码</el-button
                >
            </div>
            <p style="margin: 15px 0 20px 0; border-top: 1px solid #bbb">
                ⚠️停止会话将中断您与房间的连接，但您依然可以在本地继续使用画布。请注意，这不会影响到其他用户，他们仍可以在他们的版本上继续协作。
            </p>
            <el-button type="danger" icon="VideoPause" size="large" @click="stop"
                >结束会话</el-button
            >
        </span>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Tools from '../../../assets/js/tools'
import { ElMessage } from 'element-plus'
import Chart from '../../Flow/chart'
import {
    createCollaborationRoom,
    joinCollaborationRoom,
    leaveCollaborationRoom
} from '../../../api/message'
import SSEEvents from '../../../api/sse'

const roomKey = ref(Chart.collaborationRoomKey)
const isCollaboration = ref(Chart.collaborationRoomKey !== '')
function start() {
    isCollaboration.value = true
    createCollaborationRoom().then((data) => {
        roomKey.value = data
        Chart.collaborationRoomKey = data
        addCollaborationRoomListener()
    })
}
function stop() {
    isCollaboration.value = false
    leaveCollaborationRoom(Chart.collaborationRoomKey).then(() => {
        Chart.collaborationRoomKey = ''
        SSEEvents.removeEventListener('SSE: message-chartRoom', Chart.collaborationRoomListener)
    })
}

function join() {
    joinCollaborationRoom(roomKey.value).then(({ success, message }) => {
        if (!success) {
            ElMessage({
                message: message,
                type: 'error',
                duration: 2000,
                offset: 46
            })
            return
        }
        isCollaboration.value = true
        Chart.collaborationRoomKey = roomKey.value
        addCollaborationRoomListener()
    })
}

function addCollaborationRoomListener() {
    SSEEvents.addEventListener('SSE: message-chartRoom', Chart.collaborationRoomListener)
}

function copyRoomKey() {
    try {
        Tools.copyToClipboard(roomKey.value)
        ElMessage({
            message: '已复制房间号',
            type: 'success',
            duration: 2000,
            offset: 46
        })
    } catch (e) {
        ElMessage({
            message: '复制失败',
            type: 'error',
            duration: 2000,
            offset: 46
        })
        console.log(e)
    }
}
</script>

<style scoped>
.collaboration-box {
    width: 100%;
    height: 100%;
    padding: 20px 10px 10px 10px;
}
.flex-center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

h2 {
    font-weight: bold;
}
</style>
