import { init } from 'echarts'
import MdPreview from '@renderer/components/MdPreview.vue'
import { render, h } from 'vue'

class ChartTemplate {
    static instance

    constructor(domId, isReLoad = false) {
        if (ChartTemplate.instance && !isReLoad) {
            return ChartTemplate.instance
        }
        this.chart = init(document.getElementById(domId))
        this.showWarn = true
        this.fontFamily = 'auto'
        this.init()
        return (ChartTemplate.instance = this)
    }

    /**
     * 初始化
     */
    init() {
        window.addEventListener('resize', function () {
            ChartTemplate.instance.chart.resize()
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
                text: '',
                textStyle: {
                    color: '#666666',
                    fontFamily: this.fontFamily
                }
            },
            legend: [
                {
                    data: categories.map((x) => x.name),
                    icon: 'circle',
                    textStyle: {
                        color: '#666',
                        fontFamily: this.fontFamily
                    }
                }
            ],
            tooltip: {
                show: true,
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
                    layout: 'force',
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
                        repulsion: 2000,
                        edgeLength: [100, 500]
                    },
                    data: data.nodes,
                    links: data.links
                }
            ]
        }

        this.setOption(option)
    }

    fromJson(json) {
        const nodeArray = json.node
        const edgeArray = json.edge
        const categoryArray = json.category
        const option = this.getOption()
        option.series[0].data = nodeArray
        option.series[0].links = edgeArray
        option.series[0].categories = categoryArray

        this.setOption({
            ...option,
            legend: [
                {
                    data: categoryArray.map((x) => x.name)
                }
            ]
        })
    }
    getOption() {
        return this.chart.getOption()
    }
    setOption(option) {
        this.chart.setOption(option)
    }
}

export default ChartTemplate
