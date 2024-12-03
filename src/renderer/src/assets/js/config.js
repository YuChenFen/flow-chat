let obj
try {
    obj = await window.electronAPI.loadConfig()
} catch (e) {
    obj = {
        chart: {
            title: '编辑器',
            layout: 'force',
            legend: {
                orient: 'vertical',
                top: '',
                left: '10',
                bottom: '10',
                right: ''
            },
            force: {
                gravity: 0.1,
                repulsion: 2000,
                edgeLength: {
                    min: 100,
                    max: 500
                }
            }
        },
        llm: {
            vendor: 'ollama',
            VectorDbEnable: true,
            ollama: {
                url: 'http://localhost:11434',
                model: ''
            },
            siliconflow: {
                apiKey: '',
                model: ''
            },
            zhipuai: {
                apiKey: '',
                model: ''
            }
        }
    }
}

function configProxy(obj) {
    if (typeof obj === 'object') {
        for (let key in obj) {
            if (typeof obj[key] === 'object') {
                obj[key] = configProxy(obj[key])
            }
        }
    }
    return new Proxy(obj, {
        set(target, key, value) {
            target[key] = value
            window.electronAPI?.writeFile({
                filePath: 'config.json',
                content: JSON.stringify(config)
            })
            return true
        }
    })
}
const config = configProxy(obj)
export default config
