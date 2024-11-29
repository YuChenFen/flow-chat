<template>
    <div class="community">
        <div class="header">
            <div class="title">
                <h2>社区</h2>
                <el-button type="primary" round icon="Position" @click="openPublish"
                    >发布</el-button
                >
            </div>
            <el-input
                v-model="filterText"
                placeholder="请输入搜索内容"
                prefix-icon="Search"
                clearable
                @keydown.enter="filterData(filterText)"
            >
            </el-input>
        </div>
        <div class="grid">
            <div v-for="item in communityList" :key="item" class="card">
                <el-image class="image" :src="item.image" fit="cover" @click="toDetail(item)">
                    <template #error>
                        <div class="image-error">
                            <el-icon>
                                <svg viewBox="0 0 1024 1024">
                                    <path
                                        d="M520 672L256 413.44l-109.76 93.76V246.72h261.12a41.6 41.6 0 1 0 0-82.88H104.64A41.6 41.6 0 0 0 64 205.44V800a41.6 41.6 0 0 0 41.6 41.6h267.84a40.96 40.96 0 0 0 32-67.52h21.76z"
                                        p-id="5048"
                                    ></path>
                                    <path
                                        d="M952 211.52a41.92 41.92 0 0 0-28.48-15.68l-310.08-32a41.6 41.6 0 0 0-8.32 82.88l267.2 27.52-55.04 411.84-113.28-160-99.2 17.92 42.56 96-123.84 123.52-32-1.6a41.6 41.6 0 1 0-4.16 82.88l352 17.92h1.92a41.28 41.28 0 0 0 41.28-35.84L960 242.88a42.56 42.56 0 0 0-8-31.36z"
                                        p-id="5049"
                                    ></path>
                                    <path
                                        d="M695.36 397.44m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z"
                                        p-id="5050"
                                    ></path>
                                </svg>
                            </el-icon>
                        </div>
                    </template>
                </el-image>
                <div class="info">
                    <div class="user flex-center">
                        <el-avatar class="head-avatar" :src="item.userAvatar">
                            <img src="/src/assets/image/empty-user.png" />
                        </el-avatar>
                        <div>
                            <div class="user-name">{{ item.name }}</div>
                            <div class="one-line">
                                {{ item.description }}
                            </div>
                        </div>
                    </div>
                    <div class="flex-center" style="gap: 0.5rem">
                        <div class="flex-center">
                            <el-icon><Timer /></el-icon>
                            <span class="one-line">{{ item.updateTime }}</span>
                        </div>
                        <!-- 收藏数 -->
                        <!-- <div class="flex-center">
                            <el-icon><Star /></el-icon>
                            <span>100</span>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>
        <div
            v-if="communityList.length === 0"
            style="flex: 1; display: flex; align-items: center; justify-content: center"
        >
            <el-empty description="无数据" />
        </div>
    </div>
</template>

<script setup>
// item % 2 ? `https://cdn.seovx.com/?mom=302&${item}` : `https://t.alcy.cc/moez?${item}`
import { useRouter } from 'vue-router'
import { h, ref } from 'vue'
import { getCommunityList } from '@renderer/api/community'
import { ElMessage, ElMessageBox } from 'element-plus'
import publishBox from './publishBox.vue'
import { publishCommunity } from '../../api/community'

const router = useRouter()
const communityList = ref([])
const filterText = ref('')
getCommunityList().then((res) => {
    communityList.value = res
})
function toDetail(item) {
    router.push({ name: '社区详情', params: { id: item.id } })
}

let filterListTimeout = null
function filterData() {
    clearTimeout(filterListTimeout)
    filterListTimeout = setTimeout(() => {
        getCommunityList(filterText.value, filterText.value).then((res) => {
            communityList.value = res
        })
    }, 500)
}

function openPublish() {
    const description = ref('')
    let contentFile
    let imageFile
    ElMessageBox({
        title: '发布',
        'close-on-click-modal': false,
        message: () => {
            return h(publishBox, {
                description,
                loadFile: (file) => {
                    contentFile = file
                },
                loadImage: (file) => {
                    imageFile = file
                }
            })
        }
    }).then(async () => {
        if (description.value !== '' && contentFile !== undefined && imageFile !== undefined) {
            // 读取文件
            const buffer = await contentFile.arrayBuffer()
            const content = new TextDecoder().decode(buffer)
            const formData = new FormData()
            formData.append('description', description.value)
            formData.append('content', content)
            formData.append('image', imageFile)
            const code = await publishCommunity(formData)
            if (code === 200) {
                ElMessage.success({
                    message: '发布成功',
                    offset: 46
                })
                getCommunityList().then((res) => {
                    communityList.value = res
                })
            } else {
                ElMessage.error({
                    message: '发布失败',
                    offset: 46
                })
            }
        } else {
            ElMessage.error({
                message: '信息未填写完整',
                duration: 2000,
                offset: 46
            })
        }
    })
}
</script>

<style scoped>
.community {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 32px;
    grid-auto-rows: auto;
    grid-auto-flow: dense;
}
.flex-center {
    display: flex;
    align-items: center;
    gap: 0.2rem;
}

.card {
    .image {
        width: 100%;
        aspect-ratio: 16/9;
        border: 1px solid #ccc;
        border-radius: 5px;
        position: relative;
    }
    .image::before {
        content: '';
        opacity: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        background-image: linear-gradient(
            rgba(255, 255, 255, 0.01),
            rgba(252, 252, 252, 0.01) 6.67%,
            rgba(245, 245, 245, 0.04) 13.33%,
            rgba(235, 235, 235, 0.08) 20%,
            rgba(217, 217, 217, 0.15) 26.67%,
            rgba(196, 196, 196, 0.23) 33.33%,
            rgba(171, 171, 171, 0.33) 40%,
            rgba(143, 143, 143, 0.44) 46.67%,
            rgba(112, 112, 112, 0.56) 53.33%,
            rgba(85, 85, 85, 0.67) 60%,
            rgba(59, 59, 59, 0.77) 66.67%,
            rgba(38, 38, 38, 0.85) 73.33%,
            rgba(20, 20, 20, 0.92) 80%,
            rgba(9, 9, 9, 0.96) 86.67%,
            rgba(2, 2, 2, 0.99) 93.33%,
            rgb(0, 0, 0)
        );
        transition: opacity 0.5s ease-in-out;
    }
    .image:hover::before {
        opacity: 0.5;
    }

    .info {
        margin-top: 5px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;

        .user {
            gap: 0.5rem;
            max-width: calc(100% - 143px);

            .head-avatar {
                flex: 0 0 40px;
            }
            .user-name {
                font-size: 1rem;
                font-weight: 600;
            }
        }
    }
}

.header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    gap: 0.5rem;

    .title {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}

.image-error {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 30px;
}

.one-line {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
