<template>
    <div class="detail">
        <header>
            <div class="left">
                <el-icon class="back" size="22px" @click="back"><Back /></el-icon>
                <el-text class="title">{{ data.description }}</el-text>
            </div>
            <div class="right">
                <el-button type="primary" icon="Edit" size="small" @click="toEdit"
                    >转到编辑器</el-button
                >
            </div>
        </header>
        <main>
            <div id="detail-chart"></div>
            <div class="detail-info">
                <div class="comment-list">
                    <div
                        v-for="comment in commentList"
                        :key="comment.id"
                        style="display: flex; padding: 0.5rem"
                    >
                        <div style="margin-right: 10px">
                            <el-avatar :size="35" :src="comment.userAvatar" />
                        </div>
                        <div style="flex: 1">
                            <div style="display: flex; align-items: center; margin-bottom: 5px">
                                <span style="font-weight: bold; margin-right: 1rem">{{
                                    comment.userName
                                }}</span>
                                <span>{{ comment.createTime.substring(0, 10) }}</span>
                            </div>
                            <div>{{ comment.content }}</div>
                        </div>
                    </div>
                </div>
                <div style="padding: 10px; aspect-ratio: 16/9; height: 235px">
                    <MdEditor
                        v-model:text="commentText"
                        :preview="false"
                        :toolbars="[]"
                        :footers="['markdownTotal', '=', 0]"
                        style="width: 100%; height: 215px"
                    >
                        <template #defFooters>
                            <span style="position: absolute; right: 10px; bottom: 34px">
                                <el-button type="primary" @click="sendComment">发送</el-button>
                            </span>
                        </template>
                    </MdEditor>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ChartTemplate from './chart'
import { addComment, getCommentList, getCommunityDetail } from '../../api/community'
import { useFlowStore } from '../../store/flowStore'
import MdEditor from '@renderer/components/MdEditor.vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const { setOption } = useFlowStore()

const commentText = ref('')
const data = ref({})
const commentList = ref([])
let chartTemplate

onMounted(async () => {
    chartTemplate = new ChartTemplate('detail-chart', true)

    data.value = await getCommunityDetail(route.params.id)
    chartTemplate.fromJson(data.value.option)

    commentList.value = await getCommentList(route.params.id)
})

function back() {
    router.back()
}
function toEdit() {
    setOption(data.value.option)
    router.push({ name: '知识图谱' })
}

async function sendComment() {
    const code = await addComment(route.params.id, commentText.value)
    if (code === 200) {
        ElMessage({
            message: '评论成功',
            type: 'success',
            offset: 46
        })
        commentText.value = ''
        commentList.value = await getCommentList(route.params.id)
    } else {
        ElMessage({
            message: '评论失败',
            type: 'error',
            offset: 46
        })
    }
}

onBeforeUnmount(() => {
    chartTemplate.destroy()
})
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
            color: var(--app-color);
            font-weight: 600;
            position: relative;
            white-space: nowrap;

            &::after {
                content: '';
                position: absolute;
                left: 0;
                height: 100%;
                width: 2px;
                background-color: var(--app-color);
                transform: rotateZ(10deg);
            }
        }
    }

    .right {
        padding: 0 10px;
    }
}

main {
    flex: 1;
    display: flex;
    height: calc(100% - 40px);

    #detail-chart {
        width: 100%;
        height: 100%;
        flex: 1;
    }

    .detail-info {
        /* width: 25%; */
        height: 100%;
        border-left: 1px solid #c0c0c0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .comment-list {
            flex: 1;
            padding: 10px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            overflow: auto;
            max-height: calc(100% - 235px);
        }
    }
}
</style>
