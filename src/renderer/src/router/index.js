import { createMemoryHistory, createRouter } from 'vue-router'

const routes = [
    {
        path: '/',
        name: '首页',
        component: () => import('../view/Home/index.vue')
    },
    {
        path: '/flow',
        name: '知识图谱',
        component: () => import('../view/Flow/index.vue')
    },
    {
        path: '/chat',
        name: '对话',
        component: () => import('../view/Chat/index.vue')
    },
    {
        path: '/community',
        component: () => import('../view/Community/index.vue'),
        children: [
            {
                path: '',
                name: '社区',
                component: () => import('../view/Community/list.vue')
            },
            {
                path: '/detail/:id',
                name: '社区详情',
                component: () => import('../view/Community/detail.vue')
            }
        ]
    },
    {
        path: '/userManage',
        name: '用户管理',
        component: () => import('../view/UserManage/index.vue')
    },
    {
        path: '/setting',
        name: '设置',
        component: () => import('../view/Setting/index.vue')
    }
]

const router = createRouter({
    history: createMemoryHistory(),
    routes
})

export default router
