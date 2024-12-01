<template>
    <div class="menubar-menu">
        <div
            v-for="(menu, key) in menuData"
            :key="key"
            class="menubar-menu-button"
            :tabIndex="key"
            role="button"
        >
            <p>{{ key }}</p>
            <TitlebarMenu class="menubar-item-menu" :menu="menu"></TitlebarMenu>
        </div>
    </div>
</template>
<script setup>
import { ElMessageBox } from 'element-plus'
import Tools from '../../assets/js/tools'
import Chart from '../Flow/chart'
import TitlebarMenu from './TitlebarMenu.vue'
import { useRouter } from 'vue-router'
import { h } from 'vue'
import CollaborationBox from './box/CollaborationBox.vue'

const router = useRouter()

const menuData = {
    文件: [
        {
            type: 'item',
            text: '新建文件',
            callback: () => {
                const chart = new Chart()
                const option = chart.getOption()
                option.series[0].data = []
                option.series[0].links = []
                option.series[0].categories = []
                chart.setOption({
                    ...option,
                    legend: [
                        {
                            data: []
                        }
                    ]
                })
            }
        },
        {
            type: 'menu',
            text: '导入文件',
            children: [
                {
                    type: 'item',
                    text: '由 JSON 导入',
                    callback: async () => {
                        const content = await Tools.openTextFile([
                            {
                                description: 'JSON',
                                accept: {
                                    'text/json': ['.json']
                                }
                            }
                        ])
                        new Chart().fromJson(JSON.parse(content))
                    }
                },
                {
                    type: 'item',
                    text: '由 Markdown 导入',
                    callback: async () => {
                        const content = await Tools.openTextFile([
                            {
                                description: 'Markdown',
                                accept: {
                                    'text/markdown': ['.md']
                                }
                            }
                        ])
                        const lines = content.split('\n')
                        const nodes = []
                        const edges = []
                        const stack = []
                        let maxLevel = 0

                        try {
                            for (let line of lines) {
                                if (line.startsWith('#')) {
                                    const level = line.match(/^#+/)[0].length
                                    const title = line.replace(/^#+/, '').trim()
                                    const content = ''

                                    maxLevel = Math.max(level, maxLevel)

                                    while (
                                        stack.length > 0 &&
                                        stack[stack.length - 1].level >= level
                                    ) {
                                        stack.pop()
                                    }

                                    const parent = stack.length > 0 ? stack[stack.length - 1] : null

                                    const node = {
                                        name: title,
                                        category: `level${level}`,
                                        content
                                    }
                                    nodes.push(node)

                                    if (parent) {
                                        const edge = {
                                            target: title,
                                            source: parent.name,
                                            name: ''
                                        }
                                        edges.push(edge)
                                    }

                                    stack.push({ ...node, level })
                                } else {
                                    if (nodes.length > 0) {
                                        nodes[nodes.length - 1].content += line + '\n'
                                    }
                                }
                            }
                            for (let i = 0; i < nodes.length; i++) {
                                nodes[i].content = nodes[i].content.trim()
                            }
                            const categories = []
                            for (let i = 1; i <= maxLevel; i++) {
                                categories.push(`level${i}`)
                            }
                            const chart = new Chart()
                            const option = chart.getOption()
                            option.series[0].data = nodes
                            option.series[0].links = edges
                            option.series[0].categories = categories.map((item) => {
                                return {
                                    name: item,
                                    symbolSize: 80 - 5 * Number(item.slice(5))
                                }
                            })
                            chart.setOption({
                                ...option,
                                legend: [
                                    {
                                        data: categories
                                    }
                                ]
                            })
                        } catch (e) {
                            console.log(e)
                        }
                    }
                },
                {
                    type: 'item',
                    text: '由CSV导入',
                    callback: async () => {
                        const content = await Tools.openTextFile([
                            {
                                description: 'CSV',
                                accept: {
                                    'text/csv': ['.csv']
                                }
                            }
                        ])
                        const lines = content.split('\n')
                        const nodes = []
                        const edges = []
                        const category = []

                        try {
                            let flag = true // 标志是否在读节点
                            for (let i = 1; i < lines.length; i++) {
                                if (lines[i].trim() === '') {
                                    flag = false
                                    i++
                                    continue
                                }
                                if (flag) {
                                    const line = lines[i].trim().split(',')
                                    nodes.push({
                                        name: line[0],
                                        category: line[1],
                                        content: line[2]
                                    })
                                    if (!category.includes(line[1])) {
                                        category.push(line[1])
                                    }
                                } else {
                                    const line = lines[i].trim().split(',')
                                    edges.push({
                                        source: line[0],
                                        target: line[1],
                                        name: line[2],
                                        content: line[3]
                                    })
                                }
                            }
                            const chart = new Chart()
                            const option = chart.getOption()
                            console.log(nodes, edges, category, option.series[0])
                            option.series[0].data = nodes
                            option.series[0].links = edges
                            option.series[0].categories = category.map((item) => {
                                return {
                                    name: item,
                                    symbolSize: 80
                                }
                            })
                            chart.setOption({
                                ...option,
                                legend: [
                                    {
                                        data: category
                                    }
                                ]
                            })
                        } catch (e) {
                            console.log(e)
                        }
                    }
                },
                {
                    type: 'item',
                    text: 'AI解析文本',
                    callback: async () => {
                        // 打开文件对话框
                        const text = await Tools.openTextFile([
                            {
                                description: '文本',
                                accept: {
                                    'text/plain': ['.txt']
                                }
                            }
                        ])
                        const chart = new Chart()
                        chart.fromText(text)
                    }
                }
            ]
        },
        {
            type: 'menu',
            text: '导出文件',
            children: [
                {
                    type: 'item',
                    text: '导出为 JSON',
                    callback: async () => {
                        Tools.saveTextFile(JSON.stringify(new Chart().toJson()), [
                            {
                                description: 'JSON',
                                accept: {
                                    'text/json': ['.json']
                                }
                            }
                        ])
                    }
                },
                {
                    type: 'item',
                    text: '导出为 Markdown',
                    callback: async () => {
                        const text = new Chart().toMarkdown()
                        Tools.saveTextFile(text, [
                            {
                                description: 'Markdown',
                                accept: {
                                    'text/markdown': ['.md']
                                }
                            }
                        ])
                    }
                },
                {
                    type: 'item',
                    text: '导出为CSV',
                    callback: async () => {
                        const option = new Chart().getOption()
                        const nodeArray = option.series[0].data
                        const edgeArray = option.series[0].links
                        const csvContent = [
                            '节点名称,节点类型,节点内容',
                            ...nodeArray.map(
                                (node) => `${node.name},${node.category},${node.content}`
                            ),
                            '',
                            '源节点名称,目标节点名称,关系名称,关系内容',
                            ...edgeArray.map(
                                (edge) =>
                                    `${edge.source},${edge.target},${edge.name},${edge.content}`
                            )
                        ]
                        await Tools.saveTextFile(csvContent.join('\n'), [
                            {
                                description: 'CSV',
                                accept: {
                                    'text/csv': ['.csv']
                                }
                            }
                        ])
                    }
                },
                {
                    type: 'item',
                    text: '导出为图片',
                    callback: async () => {
                        const image = new Chart().toImage()
                        const blob = Tools.blobFromBase64(image)
                        await Tools.saveTextFile(blob, [
                            {
                                description: 'PNG',
                                accept: {
                                    'image/png': ['.png']
                                }
                            }
                        ])
                    }
                }
            ]
        },
        {
            type: 'line'
        },
        {
            type: 'item',
            text: '实时操作',
            callback: async () => {
                ElMessageBox({
                    showConfirmButton: false,
                    message: h(CollaborationBox)
                })
            }
        }
    ],
    查看: [
        {
            type: 'item',
            text: '刷新',
            callback: () => {
                window.location.reload()
            }
        },
        {
            type: 'item',
            text: '设置',
            callback: () => {
                router.push({ name: '设置' })
            }
        }
    ],
    帮助: [
        {
            type: 'item',
            text: '欢迎'
        },
        {
            type: 'item',
            text: '文档教程',
            callback: () => {
                window.open('https://www.ycfsh.top')
            }
        },
        {
            type: 'line'
        },
        {
            type: 'item',
            text: '检查更新...',
            callback: () => {
                window.electron.ipcRenderer.send('checkUpdate')
            }
        },
        {
            type: 'line'
        },
        {
            type: 'item',
            text: '关于',
            callback: () => {
                window.electron.ipcRenderer.send('showAboutMessageBox')
            }
        }
    ]
}
</script>
<style scoped>
.menubar-menu {
    height: 80%;
    display: flex;
    gap: 5px;
    align-items: center;
    padding: 0 5px;
    color: var(--titlebar-color);
    font-size: 0.8rem;
    white-space: nowrap;

    & .menubar-menu-button {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 2px 10px;
        border-radius: 2px;
        user-select: none;
        position: relative;
        -webkit-app-region: no-drag;

        &:hover,
        &:focus {
            background-color: var(--titlebar-hover-background-color);
        }

        &:focus-within {
            & .menubar-item-menu {
                display: flex;
            }
        }

        & .menubar-item-menu {
            position: absolute;
            top: 100%;
            left: 0;
            z-index: 1;
            display: none;
        }
    }
}
</style>
