import { init } from 'echarts'
import { marked } from 'marked'

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
                formatter: function (x) {
                    const div = document.createElement('div')
                    div.style.maxWidth = '300px'
                    div.style.maxHeight = '500px'
                    div.style.whiteSpace = 'pre-wrap'
                    div.style.overflowY = 'scroll'
                    div.classList.add('markdown-body')
                    div.innerHTML = marked.parse(x.data.content ? x.data.content : '无内容')
                    return div
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
