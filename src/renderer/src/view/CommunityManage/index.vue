<template>
    <div style="padding: 10px; display: flex; flex-direction: column; height: 100%">
        <h3 style="font-weight: bold; flex: 0 0 2em">社区管理</h3>
        <div class="user-list">
            <div style="flex: 0 0 40px; display: flex; padding: 10px 0 0 10px">
                <el-input
                    v-model="filterText"
                    style="max-width: 500px"
                    placeholder="请输入搜索内容"
                    @keydown.enter="searchUserList"
                >
                    <template #prepend>
                        <el-select v-model="filterKey" placeholder="查询内容" style="width: 100px">
                            <el-option
                                v-for="item in filterKeyList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </template>
                    <template #append>
                        <el-button icon="Search" @click="searchUserList" />
                    </template>
                </el-input>
            </div>
            <div
                ref="userListContainer"
                style="flex: 1; display: flex; justify-content: flex-start; padding: 5px 0 0 10px"
            >
                <el-table-v2
                    :columns="columns"
                    :data="data"
                    :width="tableWidth"
                    :height="tableHeight"
                    :row-height="70"
                    :h-scrollbar-size="3"
                    :v-scrollbar-size="3"
                    fixed
                >
                    <template #empty>
                        <el-empty description="无数据" />
                    </template>
                </el-table-v2>
            </div>
            <div
                style="
                    display: flex;
                    justify-content: flex-end;
                    padding: 0 15px 15px 0;
                    flex: 0 0 50px;
                "
            >
                <el-pagination
                    v-model:current-page="paginationData.pageNum"
                    v-model:page-size="paginationData.pageSize"
                    :page-sizes="[10, 20, 50, 100]"
                    background
                    layout="slot, prev, pager, next"
                    :total="paginationData.total"
                    @current-change="searchUserList"
                >
                    <div style="padding: 0 10px">共{{ paginationData.total }}条</div>
                    <el-select
                        v-model="paginationData.pageSize"
                        placeholder="每页 条"
                        style="width: 120px"
                        @change="searchUserList"
                    >
                        <el-option
                            v-for="item in [10, 20, 50, 100]"
                            :key="item"
                            :label="`每页 ${item} 条`"
                            :value="item"
                        />
                    </el-select>
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script setup lang="jsx">
import { ElButton, ElMessage, TableV2FixedDir } from 'element-plus'
import { onBeforeUnmount, onMounted, ref, reactive, unref } from 'vue'
import { deleteCommunity, getCommunityList } from '../../api/community'

const tableWidth = ref(0)
const tableHeight = ref(0)
const userListContainer = ref(null)
let resizeObserver

const paginationData = reactive({
    total: 0,
    pageNum: 1,
    pageSize: 10
})
const filterText = ref('')
const filterKey = ref('userName')
const filterKeyList = [
    {
        label: '发布者',
        value: 'userName'
    },
    {
        label: '描述',
        value: 'description'
    }
]

const handleResize = (entries) => {
    entries.forEach((entry) => {
        const { width, height } = entry.contentRect
        tableWidth.value = width - 50
        tableHeight.value = height - 25
    })
}

onMounted(() => {
    resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(userListContainer.value)
})

onBeforeUnmount(() => {
    if (userListContainer.value) {
        resizeObserver.unobserve(userListContainer.value)
    }
})

const SelectionCell = ({ value, intermediate = false, onChange }) => {
    return <ElCheckbox onChange={onChange} modelValue={value} indeterminate={intermediate} />
}

const columns = [
    {
        key: 'selection',
        width: 50,
        cellRenderer: ({ rowData }) => {
            const onChange = (value) => (rowData.checked = value)
            return <SelectionCell value={rowData.checked} onChange={onChange} />
        },
        headerCellRenderer: () => {
            const _data = unref(data)
            const onChange = (value) =>
                (data.value = _data.map((row) => {
                    row.checked = value
                    return row
                }))
            const allSelected = _data.every((row) => row.checked)
            const containsChecked = _data.some((row) => row.checked)

            return (
                <SelectionCell
                    value={allSelected}
                    intermediate={containsChecked && !allSelected}
                    onChange={onChange}
                />
            )
        }
    },
    {
        key: 'userName',
        title: '发布者',
        dataKey: 'userName',
        width: 80,
        align: 'center',
        cellRenderer: ({ cellData }) => <div>{cellData}</div>
    },
    {
        key: 'description',
        title: '描述',
        dataKey: 'description',
        width: 150,
        align: 'center',
        cellRenderer: ({ cellData }) => <div>{cellData}</div>
    },
    {
        key: 'updateTime',
        title: '最近更新时间',
        dataKey: 'updateTime',
        width: 150,
        align: 'center',
        cellRenderer: ({ cellData }) => <div>{cellData}</div>
    },
    {
        key: 'operations',
        title: '操作',
        width: 150,
        fixed: TableV2FixedDir.RIGHT,
        cellRenderer: ({ rowData }) => {
            function deleteItem() {
                deleteCommunity(rowData.id).then((code) => {
                    if (code === 200) {
                        ElMessage({
                            type: 'success',
                            message: '删除成功',
                            duration: 1000,
                            offset: 46
                        })
                        searchUserList()
                    } else {
                        ElMessage({
                            type: 'error',
                            message: '删除失败',
                            duration: 1000,
                            offset: 46
                        })
                    }
                })
            }
            return (
                <>
                    <el-popconfirm
                        title="确定要删除吗？"
                        confirm-button-text="确定"
                        cancel-button-text="取消"
                        onConfirm={deleteItem}
                    >
                        {{
                            reference: () => (
                                <el-button type="danger" size="small">
                                    删除
                                </el-button>
                            )
                        }}
                    </el-popconfirm>
                </>
            )
        }
    }
]

const data = ref([])
function searchUserList() {
    if (filterText.value !== '' && filterKey.value === 'userName') {
        getCommunityList(
            filterText.value,
            undefined,
            paginationData.pageNum,
            paginationData.pageSize
        ).then((result) => {
            data.value = result.data
            paginationData.total = result.totle
        })
    } else if (filterText.value !== '' && filterKey.value === 'description') {
        getCommunityList(
            undefined,
            filterText.value,
            paginationData.pageNum,
            paginationData.pageSize
        ).then((result) => {
            data.value = result.data
            paginationData.total = result.totle
        })
    } else {
        getCommunityList(
            undefined,
            undefined,
            paginationData.pageNum,
            paginationData.pageSize
        ).then((result) => {
            data.value = result.data
            paginationData.total = result.totle
        })
    }
}
searchUserList()
</script>

<style scoped>
.user-list {
    flex: 1;
    background-color: var(--app-them-color);
    width: 100%;
    border-radius: 5px;
    user-select: none;
    display: flex;
    flex-direction: column;
    box-shadow:
        rgb(0 0 0 / 5%) 0px 1px 1px,
        rgb(0 0 0 / 5%) 0px 0px 1px 1px;
}
</style>
