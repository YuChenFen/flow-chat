import { init } from 'echarts'
import LLM from '../../assets/js/llm'
import { ElMessage } from 'element-plus'
import Tools from '../../assets/js/tools'
import Template from './template'
import config from '@renderer/assets/js/config'
import { send as SSESend } from '../../api/sse'
import MdPreview from '@renderer/components/MdPreview.vue'
import { render, h } from 'vue'

class Chart {
    static instance
    static collaborationRoomKey = ''

    constructor(domId, isReLoad = false) {
        if (Chart.instance && !isReLoad) {
            return Chart.instance
        }
        this.chart = init(document.getElementById(domId))
        this.showWarn = true
        this.fontFamily = 'auto'
        this.init()
        return (Chart.instance = this)
    }

    /**
     * 初始化
     */
    init() {
        window.addEventListener('resize', function () {
            Chart.instance.chart.resize()
        })

        const data = {
            nodes: [],
            links: []
        }

        const categories = [
            {
                name: '无类别',
                symbolSize: 50,
                itemStyle: {
                    color: '#86b1fe'
                }
            }
        ]

        const option = {
            title: {
                text: config.chart.title,
                textStyle: {
                    color: '#666666',
                    fontFamily: this.fontFamily
                }
            },
            legend: [
                {
                    data: categories.map((x) => x.name),
                    bottom: config.chart.legend.bottom === '' ? null : config.chart.legend.bottom,
                    left: config.chart.legend.left === '' ? null : config.chart.legend.left,
                    right: config.chart.legend.right === '' ? null : config.chart.legend.right,
                    top: config.chart.legend.top === '' ? null : config.chart.legend.top,
                    orient: config.chart.legend.orient,
                    icon: 'circle',
                    textStyle: {
                        color: '#666',
                        fontFamily: this.fontFamily
                    }
                }
            ],
            tooltip: {
                show: config.chart.tooltip.show,
                confine: true,
                // alwaysShowContent: true,
                formatter: function (params) {
                    const vnode = h(MdPreview, {
                        text: params.data.content ? params.data.content : '无内容'
                    })
                    const container = document.createElement('div')
                    container.style.maxWidth = '300px'
                    container.style.maxHeight = '500px'
                    container.style.whiteSpace = 'pre-wrap'
                    container.style.overflowY = 'scroll'
                    render(vnode, container)
                    return container
                }
            },
            series: [
                {
                    type: 'graph',
                    layout: config.chart.layout,
                    symbolSize: 58,
                    draggable: true,
                    roam: true,
                    emphasis: { focus: 'adjacency' },
                    categories: categories,
                    edgeSymbol: ['', 'arrow'],
                    edgeLabel: {
                        show: true,
                        fontSize: 16,
                        formatter(x) {
                            return x.data.name
                        }
                    },
                    label: {
                        show: true,
                        fontSize: 16,
                        fontFamily: this.fontFamily
                    },
                    force: {
                        gravity: config.chart.force.gravity,
                        repulsion: config.chart.force.repulsion,
                        edgeLength: [
                            config.chart.force.edgeLength.min,
                            config.chart.force.edgeLength.max
                        ]
                    },
                    data: data.nodes,
                    links: data.links
                }
            ],
            toolbox: {
                show: true,
                itemSize: 18,
                feature: {
                    myUpload: {
                        show: true,
                        title: '加载XML',
                        icon: 'image:///src/assets/image/upload.svg',
                        onclick: async () => {
                            // 打开文件对话框
                            const content = await Tools.openTextFile([
                                {
                                    description: 'XML',
                                    accept: {
                                        'text/xml': ['.xml']
                                    }
                                }
                            ])
                            const xml = new DOMParser().parseFromString(content, 'text/xml')
                            let nodes = xml.getElementsByTagName('node')
                            let edges = xml.getElementsByTagName('edge')
                            let data = {
                                nodes: [],
                                edges: []
                            }
                            let categories = []
                            for (let i = 0; i < nodes.length; i++) {
                                let node = {}
                                node.name = nodes[i].getAttribute('id').replace(/^"|"$/g, '')
                                node.category = nodes[i]
                                    .querySelector('data[key="d0"]')
                                    .innerHTML.replace(/^"|"$/g, '')
                                node.content = nodes[i]
                                    .querySelector('data[key="d1"]')
                                    .innerHTML.replace(/^"|"$/g, '')
                                    .split('"&lt;SEP&gt;"')
                                    .map((item) => {
                                        return `- ${item}`
                                    })
                                    .join('\n')
                                if (categories.indexOf(node.category) == -1) {
                                    categories.push(node.category)
                                }
                                data.nodes.push(node)
                            }
                            for (let i = 0; i < edges.length; i++) {
                                let edge = {}
                                edge.source = edges[i].getAttribute('source').replace(/^"|"$/g, '')
                                edge.target = edges[i].getAttribute('target').replace(/^"|"$/g, '')
                                edge.name = edges[i]
                                    .querySelector('data[key="d5"]')
                                    .innerHTML.replace(/^"|"$/g, '')
                                edge.content = edges[i]
                                    .querySelector('data[key="d4"]')
                                    .innerHTML.replace(/^"|"$/g, '')
                                    .split('"&lt;SEP&gt;"')
                                    .map((item) => {
                                        return `- ${item}`
                                    })
                                    .join('\n')
                                data.edges.push(edge)
                            }
                            let option = this.getOption()
                            option.series[0].categories = categories.map((item) => {
                                return {
                                    name: item,
                                    symbolSize: 50
                                }
                            })
                            option.series[0].data = data.nodes
                            option.series[0].links = data.edges
                            this.chart.setOption({
                                ...option,
                                legend: [
                                    {
                                        data: categories
                                    }
                                ]
                            })
                        }
                    }
                }
            }
        }
        this.setOption(option)
    }
    /**
     * 添加节点
     * @param {*} node 节点信息
     */
    addNode(node) {
        try {
            if (Tools.isAllSpaces(node.name)) {
                return
            }
            if (Tools.isAllSpaces(node.category)) {
                delete node.category
            }
            const option = this.getOption()
            for (let i = 0; i < option.series[0].data.length; i++) {
                if (option.series[0].data[i].name === node.name) {
                    ElMessage({
                        message: '节点已存在',
                        type: 'warning',
                        offset: 46,
                        duration: 1000
                    })
                    console.log('已存在')
                    return
                }
            }
            option.series[0].data.push(node)
            this.setOption(option)
        } catch (e) {
            if (this.showWarn) {
                alert('创建节点失败')
            }
            throw new Error('创建节点失败')
        }
    }
    /**
     * 添加关系
     * @param {*} edge 关系信息
     */
    addEdge(edge) {
        try {
            if (Tools.isAllSpaces(edge.source) || Tools.isAllSpaces(edge.target)) {
                return
            }
            const option = this.getOption()
            option.series[0].links.push({ ...edge })
            this.setOption(option)
        } catch (e) {
            if (this.showWarn) {
                alert('创建关系失败')
            }
            throw new Error('创建关系失败')
        }
    }
    /**
     * 添加类别
     * @param {*} category 类别信息
     */
    addCategory(category) {
        try {
            if (Tools.isAllSpaces(category.name)) {
                return
            }
            const option = this.getOption()
            const categories = option.series[0].categories.map((item) => item.name)
            for (let i = 0; i < categories.length; i++) {
                if (category.name === categories[i]) {
                    console.log('已存在')
                    return
                }
            }
            option.series[0].categories.push(category)
            this.setOption({
                ...option,
                legend: [
                    {
                        data: option.series[0].categories.map((x) => x.name)
                    }
                ]
            })
        } catch (e) {
            if (this.showWarn) {
                alert('创建类别失败')
            }
            throw new Error('创建类别失败')
        }
    }
    /**
     * 修改节点
     * @param {*} oldNode 旧节点信息
     * @param {*} newNode 新节点信息
     */
    updateNode(oldNode, newNode) {
        try {
            const option = this.getOption()
            for (let i = 0; i < option.series[0].data.length; i++) {
                if (option.series[0].data[i].name === oldNode.name) {
                    option.series[0].data[i] = newNode
                    break
                }
            }
            this.setOption(option)
        } catch (e) {
            if (this.showWarn) {
                alert('修改节点失败')
            }
            throw new Error('修改节点失败')
        }
    }
    /**
     * 修改关系
     * @param {*} oldEdge 旧关系信息
     * @param {*} newEdge 新关系信息
     */
    updateEdge(oldEdge, newEdge) {
        try {
            const option = this.getOption()
            for (let i = 0; i < option.series[0].links.length; i++) {
                if (
                    option.series[0].links[i].source === oldEdge.source &&
                    option.series[0].links[i].target === oldEdge.target &&
                    option.series[0].links[i].name === oldEdge.name
                ) {
                    option.series[0].links[i] = newEdge
                    break
                }
            }
            this.setOption(option)
        } catch (e) {
            if (this.showWarn) {
                alert('修改关系失败')
            }
            throw new Error('修改关系失败')
        }
    }
    /**
     * 修改类别
     * @param {*} oldCategory 旧类别信息
     * @param {*} newCategory 新类别信息
     */
    updateCategory(oldCategory, newCategory) {
        try {
            if (Tools.isAllSpaces(newCategory.name)) {
                return
            }
            const option = this.getOption()
            for (let i = 0; i < option.series[0].categories.length; i++) {
                if (option.series[0].categories[i].name === oldCategory.name) {
                    option.series[0].categories[i] = newCategory
                    break
                }
            }
            option.series[0].data.forEach((node) => {
                if (node.category === oldCategory.name) {
                    node.category = newCategory.name
                }
            })
            this.setOption({
                ...option,
                legend: [
                    {
                        data: option.series[0].categories.map((x) => x.name)
                    }
                ]
            })
        } catch (e) {
            if (this.showWarn) {
                alert('修改类别失败')
            }
            throw new Error('修改类别失败')
        }
    }
    /**
     * 删除节点
     * @param {*} node 节点信息
     */
    removeNode(node) {
        try {
            const option = this.getOption()
            for (let i = 0; i < option.series[0].data.length; i++) {
                if (option.series[0].data[i].name === node.name) {
                    option.series[0].data.splice(i, 1)
                    break
                }
            }
            for (let i = 0; i < option.series[0].links.length; i++) {
                if (
                    option.series[0].links[i].source === node.name ||
                    option.series[0].links[i].target === node.name
                ) {
                    option.series[0].links.splice(i, 1)
                    i--
                }
            }
            this.setOption(option)
        } catch (e) {
            if (this.showWarn) {
                alert('删除节点失败')
            }
            throw new Error('删除节点失败')
        }
    }
    /**
     * 删除关系
     * @param {*} edge 关系信息
     */
    removeEdge(edge) {
        try {
            const option = this.getOption()
            for (let i = 0; i < option.series[0].links.length; i++) {
                if (
                    option.series[0].links[i].source === edge.source &&
                    option.series[0].links[i].target === edge.target &&
                    option.series[0].links[i].name === edge.name
                ) {
                    option.series[0].links.splice(i, 1)
                    break
                }
            }
            this.setOption(option)
        } catch (e) {
            if (this.showWarn) {
                alert('删除关系失败')
            }
            throw new Error('删除关系失败')
        }
    }
    /**
     * 删除类别
     * @param {*} category 类别信息
     */
    removeCategory(category) {
        try {
            const option = this.getOption()
            for (let i = 0; i < option.series[0].categories.length; i++) {
                if (option.series[0].categories[i].name === category.name) {
                    option.series[0].categories.splice(i, 1)
                    break
                }
            }
            this.setOption({
                ...option,
                legend: [
                    {
                        data: option.series[0].categories.map((x) => x.name)
                    }
                ]
            })
        } catch (e) {
            if (this.showWarn) {
                alert('删除类别失败')
            }
            throw new Error('删除类别失败')
        }
    }

    /**
     * 导出为markdown
     * @return {string} markdown文本
     */
    toMarkdown() {
        const option = this.getOption()
        const nodeArray = option.series[0].data
        const edgeArray = option.series[0].links

        // 找出无根节点
        const rootNode = nodeArray.filter((x) => {
            return edgeArray.findIndex((y) => y.target === x.name) === -1
        })

        function toMarkdownText(node, level = '#') {
            let str = `${level} ${node.name}\n`
            str += node.content + '\n'
            const nextNode = nodeArray.filter((x) => {
                return (
                    edgeArray.findIndex((y) => {
                        return y.source === node.name && y.target === x.name
                    }) !== -1
                )
            })
            for (let i = 0; i < nextNode.length; i++) {
                const next = nextNode[i]
                str += toMarkdownText(next, `${level}#`)
            }
            return str
        }

        let str = ''
        rootNode.forEach((x) => {
            str += toMarkdownText(x)
        })
        return str
    }

    /**
     * 导出为markdown标题
     * @return {string} markdown标题
     */
    toMarkdownTitle() {
        const option = this.getOption()
        const nodeArray = option.series[0].data
        const edgeArray = option.series[0].links

        // 找出无根节点
        const rootNode = nodeArray.filter((x) => {
            return edgeArray.findIndex((y) => y.target === x.name) === -1
        })

        function toMarkdownText(node, level = '#') {
            let str = `${level} ${node.name}\n`
            const nextNode = nodeArray.filter((x) => {
                return (
                    edgeArray.findIndex((y) => {
                        return y.source === node.name && y.target === x.name
                    }) !== -1
                )
            })
            for (let i = 0; i < nextNode.length; i++) {
                const next = nextNode[i]
                str += toMarkdownText(next, `${level}#`)
            }
            return str
        }

        let str = ''
        rootNode.forEach((x) => {
            str += toMarkdownText(x)
        })
        return str
    }

    /**
     * 导出为json
     * @return {object} json
     */
    toJson() {
        const option = this.getOption()
        const nodeArray = option.series[0].data
        const edgeArray = option.series[0].links
        const categoryArray = option.series[0].categories
        return {
            node: nodeArray,
            edge: edgeArray,
            category: categoryArray
        }
    }

    /**
     * 导入json
     * @param {object} json json对象
     */
    fromJson(json, isSend = true) {
        try {
            const nodeArray = json.node
            const edgeArray = json.edge
            const categoryArray = json.category
            const option = this.getOption()
            option.series[0].data = nodeArray
            option.series[0].links = edgeArray
            option.series[0].categories = categoryArray

            this.setOption(
                {
                    ...option,
                    legend: [
                        {
                            data: categoryArray.map((x) => x.name)
                        }
                    ]
                },
                isSend
            )
        } catch (e) {
            alert('导入失败', e)
        }
    }

    /**
     * AI 扩展
     * @param {*} node 扩展节点信息
     */
    async aiExtend(node) {
        const loadMessage = ElMessage({
            message: '正在生成中...',
            duration: 0,
            offset: 46
        })
        try {
            const content = await LLM.chat(Template.extend(this.toMarkdownTitle(), node.name))
            let ans = JSON.parse(content)
            for (let i = 0; i < ans.length; i++) {
                this.addNode({
                    name: ans[i].label,
                    content: ans[i].content,
                    category: node.category
                })
                this.addEdge({
                    source: node.name,
                    target: ans[i].label,
                    name: ''
                })
            }
            loadMessage.close()
            ElMessage({
                message: '生成成功',
                type: 'success',
                duration: 5000,
                offset: 46
            })
        } catch (e) {
            loadMessage.close()
            ElMessage({
                message: '生成失败',
                type: 'error',
                duration: 5000,
                offset: 46
            })
        }
    }

    /**
     * 导出为图片
     * @return {string} 图片base64
     */
    toImage() {
        const base64 = this.chart.getDataURL({
            pixelRatio: 2
        })
        return base64
    }

    /**
     * 导出为表格
     * @return {string} 表格文本
     */
    toMackdownTable() {
        const option = this.getOption()
        const nodeArray = option.series[0].data
        const edgeArray = option.series[0].links

        let str = ''
        str += '| 节点名称 | 节点内容 |\n'
        nodeArray.forEach((node) => {
            str += `| ${node.name?.replaceAll('\n', '<br>')} | ${node.content?.replaceAll('\n', '<br>')} |\n`
        })
        str += '\n| 源节点 | 目标节点 | 关系名称 | 关系内容 |\n'
        edgeArray.forEach((edge) => {
            str += `| ${edge.source?.replaceAll('\n', '<br>')} | ${edge.target?.replaceAll('\n', '<br>')} | ${edge.name?.replaceAll('\n', '<br>')} | ${edge.content?.replaceAll('\n', '<br>')} |\n`
        })
        return str
    }

    /**
     * 由文本导入
     * @param {string} text 文本
     */
    async fromText(text) {
        const loadMessage = ElMessage({
            message: '正在生成中...',
            duration: 0,
            offset: 46
        })
        try {
            // 一起生成实体与关系
            const entityRelationshipTemplate = Template.entityRelationshipExtraction(text)
            const entityRelationshipText = await LLM.chat(entityRelationshipTemplate)
            console.log(entityRelationshipText)
            entityRelationshipTemplate.push({
                role: 'assistant',
                content: entityRelationshipText
            })
            const { entity, relationship } = JSON.parse(entityRelationshipText)
            let nodeList = {}
            const nodes = []
            const edges = []
            let categories = []
            for (let i = 0; i < entity.length; i++) {
                // eslint-disable-next-line no-prototype-builtins
                if (!nodeList.hasOwnProperty(entity[i].entity_name)) {
                    nodeList[entity[i].entity_name] = {
                        name: entity[i].entity_name,
                        category: entity[i].entity_type,
                        content: `- ${entity[i].entity_description}`
                    }
                } else {
                    nodeList[entity[i].entity_name].content += `\n- ${entity[i].entity_description}`
                }
            }
            for (let i = 0; i < relationship.length; i++) {
                edges.push({
                    source: relationship[i].source_entity,
                    target: relationship[i].target_entity,
                    name: relationship[i].relationship_keywords,
                    content: relationship[i].relationship_description
                })
            }
            // entityRelationshipTemplate.push({
            //     role: 'user',
            //     content:
            //         '在上次提取中缺少许多实体和对应的实体之间关系。 使用相同的格式在下面添加它们，回答为JSON字符串类型，不需要有代码块的表示，如 **```json```**，能够用javascript的JSON.parse()方法解析。:'
            // })
            // const reEntityRelationshipText = await LLM.chat(entityRelationshipTemplate)
            // console.log(reEntityRelationshipText)
            // const { entity: reEntity, relationship: reRelationship } =
            //     JSON.parse(reEntityRelationshipText)
            // for (let i = 0; i < reEntity.length; i++) {
            //     // eslint-disable-next-line no-prototype-builtins
            //     if (!nodeList.hasOwnProperty(reEntity[i].entity_name)) {
            //         nodeList[reEntity[i].entity_name] = {
            //             name: reEntity[i].entity_name,
            //             category: reEntity[i].entity_type,
            //             content: `- ${reEntity[i].entity_description}`
            //         }
            //     } else if (
            //         nodeList[reEntity[i].entity_name].content.indexOf(
            //             reEntity[i].entity_description
            //         ) === -1
            //     ) {
            //         nodeList[reEntity[i].entity_name].content +=
            //             `\n- ${reEntity[i].entity_description}`
            //     }
            // }
            // for (let i = 0; i < reRelationship.length; i++) {
            //     edges.push({
            //         source: reRelationship[i].source_entity,
            //         target: reRelationship[i].target_entity,
            //         name: reRelationship[i].relationship_keywords,
            //         content: reRelationship[i].relationship_description
            //     })
            // }
            for (let key in nodeList) {
                nodes.push(nodeList[key])
                if (categories.indexOf(nodeList[key].category) == -1) {
                    categories.push(nodeList[key].category)
                }
            }

            // 分别提取
            // const entityTemplateText = Template.entityExtraction(text)
            // const entityText = await LLM.chat(entityTemplateText)
            // entityTemplateText.push({
            //     role: 'assistant',
            //     content: entityText
            // })
            // console.log(entityText)
            // let entity = JSON.parse(entityText)
            // let nodeList = {}
            // const nodes = []
            // const edges = []
            // let categories = []
            // for (let i = 0; i < entity.length; i++) {
            //     // eslint-disable-next-line no-prototype-builtins
            //     if (!nodeList.hasOwnProperty(entity[i].entity_name)) {
            //         nodeList[entity[i].entity_name] = {
            //             name: entity[i].entity_name,
            //             category: entity[i].entity_type,
            //             content: `- ${entity[i].entity_description}`
            //         }
            //     } else {
            //         nodeList[entity[i].entity_name].content +=
            //             `\n- ${entity[i].entity_description}`
            //     }
            // }
            // entityTemplateText.push({
            //     role: 'user',
            //     content:
            //         '在上次提取中缺少许多实体。 使用相同的格式在下面添加它们:'
            // })
            // const autoEntityText = await LLM.chat(entityTemplateText)
            // console.log(autoEntityText)
            // let autoEntity = JSON.parse(autoEntityText)
            // for (let i = 0; i < autoEntity.length; i++) {
            //     // eslint-disable-next-line no-prototype-builtins
            //     if (!nodeList.hasOwnProperty(autoEntity[i].entity_name)) {
            //         nodeList[autoEntity[i].entity_name] = {
            //             name: autoEntity[i].entity_name,
            //             category: autoEntity[i].entity_type,
            //             content: `- ${autoEntity[i].entity_description}`
            //         }
            //     } else {
            //         nodeList[autoEntity[i].entity_name].content +=
            //             `\n- ${autoEntity[i].entity_description}`
            //     }
            // }
            // for (let key in nodeList) {
            //     nodes.push(nodeList[key])
            //     if (categories.indexOf(nodeList[key].category) == -1) {
            //         categories.push(nodeList[key].category)
            //     }
            // }
            // const relationshipTemplateText = Template.relationshipExtraction(
            //     text,
            //     nodes.map((item) => item.name)
            // )
            // const relationshipText = await LLM.chat(relationshipTemplateText)
            // relationshipTemplateText.push({
            //     role: 'assistant',
            //     content: relationshipText
            // })
            // console.log(relationshipText)
            // let relationship = JSON.parse(relationshipText)
            // for (let i = 0; i < relationship.length; i++) {
            //     edges.push({
            //         source: relationship[i].source_entity,
            //         target: relationship[i].target_entity,
            //         name: relationship[i].relationship_keywords,
            //         content: relationship[i].relationship_description,
            //         lineStyle: {
            //             color: '#000',
            //             type: 'solid',
            //             width: 1,
            //             curveness: 0.1
            //         }
            //     })
            // }
            // relationshipTemplateText.push({
            //     role: 'user',
            //     content:
            //         '在上次提取中缺少许多关系。 使用相同的格式在下面添加它们:'
            // })
            // const autoRelationshipText =
            //     await LLM.chat(relationshipTemplateText)
            // console.log(autoRelationshipText)
            // let autoRelationship = JSON.parse(autoRelationshipText)
            // for (let i = 0; i < autoRelationship.length; i++) {
            //     edges.push({
            //         source: autoRelationship[i].source_entity,
            //         target: autoRelationship[i].target_entity,
            //         name: autoRelationship[i].relationship_keywords,
            //         content: autoRelationship[i].relationship_description,
            //         lineStyle: {
            //             color: '#000',
            //             type: 'solid',
            //             width: 1,
            //             curveness: 0.1
            //         }
            //     })
            // }

            console.log('nodes', nodes)
            console.log('edges', edges)
            console.log('categories', categories)
            // 加入数据
            const option = this.getOption()
            option.series[0].data = nodes
            option.series[0].links = edges
            option.series[0].categories = categories.map((item) => {
                return {
                    name: item,
                    symbolSize: 80
                }
            })
            this.setOption({
                ...option,
                legend: [
                    {
                        data: categories
                    }
                ]
            })
            loadMessage.close()
            ElMessage({
                message: '生成成功',
                type: 'success',
                duration: 5000,
                offset: 46
            })
        } catch (e) {
            loadMessage.close()
            ElMessage({
                message: '生成失败',
                type: 'error',
                duration: 5000,
                offset: 46
            })
        }
    }

    /**
     * 设置option
     * @param {*} option
     */
    setOption(option, isSend = true) {
        this.chart.setOption(option)
        if (Chart.collaborationRoomKey !== '' && isSend) {
            SSESend(Chart.collaborationRoomKey, JSON.stringify(this.toJson()), 'chartRoom')
        }
    }
    /**
     * 获取option
     *
     * @return {object} option
     */
    getOption() {
        return this.chart.getOption()
    }

    /**
     * 重新定义表单
     * @param {object} form 表单
     * @param {string} type 类型
     * @param {object} source 源数据，不传则重新定义
     */
    resetForm(form, type, source) {
        if (type === 'node') {
            const nodeForm = {
                name: '',
                category: '',
                content: '',
                ...source
            }
            Tools.deepCopy(nodeForm, form)
        } else if (type === 'edge') {
            const edgeForm = {
                source: '',
                target: '',
                name: '',
                content: '',
                lineStyle: {
                    color: '#000',
                    type: 'solid',
                    width: 1,
                    curveness: 0
                },
                label: {
                    color: '#000',
                    fontSize: 16,
                    fontWeight: 'normal'
                },
                ...source
            }
            Tools.deepCopy(edgeForm, form)
        } else if (type === 'category') {
            const categoryForm = {
                name: '',
                symbol: 'circle',
                symbolSize: 50,
                itemStyle: {
                    color: '#000'
                },
                ...source
            }
            Tools.deepCopy(categoryForm, form)
        }
    }

    /**
     * 像素坐标转数据坐标
     * @param {number} x 像素坐标x
     * @param {number} y 像素坐标y
     * @return {array} 数据坐标
     */
    convertFromPixel(x, y) {
        const porin = this.chart.convertFromPixel({ seriesIndex: 0 }, [x, y])
        return {
            x: porin[0],
            y: porin[1]
        }
    }
    /**
     * 数据坐标转像素坐标
     * @param {number} x 数据坐标x
     * @param {number} y 数据坐标y
     * @return {array} 像素坐标
     */
    convertToPixel(x, y) {
        const porin = this.chart.convertToPixel({ seriesIndex: 0 }, [x, y])
        return {
            x: porin[0],
            y: porin[1]
        }
    }

    /**
     * 消除实例
     */
    destroy() {
        this.chart.dispose()
        Chart.instance = null
    }

    static collaborationRoomListener({ content }) {
        const chart = new Chart()
        chart.fromJson(JSON.parse(content), false)
    }
}

export default Chart
