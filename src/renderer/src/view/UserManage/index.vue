<template>
    <div style="padding: 10px; display: flex; flex-direction: column; height: 100%">
        <h3 style="font-weight: bold; flex: 0 0 2em">用户管理</h3>
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
            <div ref="userListContainer" style="flex: 1; display: flex; justify-content: center">
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
import { ElButton, ElImage, ElMessage, ElTag, TableV2FixedDir } from 'element-plus'
import { onBeforeUnmount, onMounted, ref, reactive, unref } from 'vue'
import { getUserList, changeUserInfo } from '../../api/user'

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
        label: '用户名',
        value: 'userName'
    },
    {
        label: '性别',
        value: 'gender'
    },
    {
        label: '账号',
        value: 'userAccount'
    },
    {
        label: '电话',
        value: 'phone'
    },
    {
        label: '邮箱',
        value: 'email'
    },
    {
        label: '角色',
        value: 'userRole'
    },
    {
        label: '创建时间',
        value: 'createTime'
    },
    {
        label: '更新时间',
        value: 'updateTime'
    },
    {
        label: '禁用状态',
        value: 'isDelete'
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
        title: '用户名',
        dataKey: 'userName',
        width: 80,
        cellRenderer: ({ cellData }) => <div>{cellData}</div>
    },
    {
        key: 'userAvatar',
        title: '头像',
        dataKey: 'userAvatar',
        width: 80,
        align: 'center',
        cellRenderer: ({ cellData: src }) => (
            <ElImage src={src} fit="cover" style="width: 60px; height: 60px"></ElImage>
        )
    },
    {
        key: 'gender',
        title: '性别',
        dataKey: 'gender',
        width: 70,
        cellRenderer: ({ cellData: gender }) => {
            if (gender === '男') {
                return <ElTag type="primary">男</ElTag>
            } else if (gender === '女') {
                return <ElTag type="danger">女</ElTag>
            } else {
                return <ElTag type="warning">未知</ElTag>
            }
        },
        align: 'center'
    },
    {
        key: 'userAccount',
        title: '账号',
        dataKey: 'userAccount',
        width: 120,
        align: 'center',
        cellRenderer: ({ cellData }) => <div>{cellData}</div>
    },
    {
        key: 'phone',
        title: '电话',
        dataKey: 'phone',
        width: 100,
        align: 'center',
        cellRenderer: ({ cellData }) => <div>{cellData}</div>
    },
    {
        key: 'email',
        title: '邮箱',
        dataKey: 'email',
        width: 150,
        align: 'center',
        cellRenderer: ({ cellData }) => {
            return (
                <el-tooltip placement="top" effect="table" content={cellData}>
                    {{
                        default: () => (
                            <div style="width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                {cellData}
                            </div>
                        )
                    }}
                </el-tooltip>
            )
        }
    },
    {
        key: 'userRole',
        title: '角色',
        dataKey: 'userRole',
        width: 100,
        align: 'center',
        cellRenderer: ({ cellData }) => {
            if (cellData === 'superAdmin') {
                return (
                    <ElTag type="primary" round>
                        超级管理员
                    </ElTag>
                )
            } else if (cellData === 'admin') {
                return (
                    <ElTag type="success" round>
                        管理员
                    </ElTag>
                )
            } else if (cellData === 'user') {
                return (
                    <ElTag type="info" round>
                        用户
                    </ElTag>
                )
            }
        }
    },
    {
        key: 'createTime',
        title: '创建时间',
        dataKey: 'createTime',
        width: 150,
        align: 'center',
        cellRenderer: ({ cellData }) => <div>{cellData}</div>
    },
    {
        key: 'updateTime',
        title: '更新时间',
        dataKey: 'updateTime',
        width: 150,
        align: 'center',
        cellRenderer: ({ cellData }) => <div>{cellData}</div>
    },
    {
        key: 'isDelete',
        title: '是否禁用',
        dataKey: 'isDelete',
        width: 80,
        align: 'center',
        cellRenderer: ({ cellData }) => {
            if (cellData === 0) {
                return <ElTag type="success">正常</ElTag>
            } else {
                return <ElTag type="danger">禁用</ElTag>
            }
        }
    },
    {
        key: 'operations',
        title: '操作',
        width: 150,
        fixed: TableV2FixedDir.RIGHT,
        cellRenderer: ({ rowData }) => {
            let isDeleteRef
            async function setUserInfo(info) {
                info = {
                    userRole: rowData.userRole,
                    isDelete: rowData.isDelete,
                    ...info
                }
                if (rowData.userRole === 'superAdmin') {
                    ElMessage({
                        type: 'error',
                        message: '超级管理员不允许被禁用',
                        duration: 1000,
                        offset: 46
                    })
                    return
                }
                const { code, message } = await changeUserInfo(
                    rowData.userAccount,
                    info.userRole,
                    info.isDelete
                )
                if (code === 200) {
                    ElMessage({
                        type: 'success',
                        message: '修改成功',
                        duration: 1000,
                        offset: 46
                    })
                    searchUserList()
                } else {
                    ElMessage({
                        type: 'error',
                        message: message,
                        duration: 1000,
                        offset: 46
                    })
                }
            }
            if (rowData.isDelete === 0) {
                isDeleteRef = (
                    <ElButton
                        size="small"
                        type="warning"
                        onClick={() => {
                            setUserInfo({ isDelete: 1 })
                        }}
                    >
                        禁用
                    </ElButton>
                )
            } else {
                isDeleteRef = (
                    <ElButton
                        size="small"
                        type="success"
                        onClick={() => {
                            setUserInfo({ isDelete: 0 })
                        }}
                    >
                        启用
                    </ElButton>
                )
            }
            return (
                <>
                    <isDeleteRef></isDeleteRef>
                    {rowData.userRole === 'superAdmin' ? (
                        <span></span>
                    ) : rowData.userRole === 'admin' ? (
                        <ElButton
                            size="small"
                            type="danger"
                            onClick={() => {
                                setUserInfo({ userRole: 'user' })
                            }}
                        >
                            取消管理员
                        </ElButton>
                    ) : (
                        <ElButton
                            size="small"
                            type="primary"
                            onClick={() => {
                                setUserInfo({ userRole: 'admin' })
                            }}
                        >
                            设为管理员
                        </ElButton>
                    )}
                </>
            )
        }
    }
]

const data = ref([])
function searchUserList() {
    let where
    if (filterText.value !== '' && filterKey.value !== '') {
        where = `${filterKey.value} LIKE '%${filterText.value}%'`
        where = encodeURIComponent(where)
    }
    getUserList(paginationData.pageNum, paginationData.pageSize, where).then((result) => {
        data.value = result.data
        paginationData.total = result.totle
    })
}
searchUserList()
</script>

<style scoped>
.user-list {
    flex: 1;
    background-color: #ffffff;
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
