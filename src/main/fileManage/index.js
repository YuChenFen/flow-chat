const fs = require('fs')
const path = require('path')

// const BASE_PATH = path.resolve(__dirname, './')
const BASE_PATH = path.resolve('./', 'resources')
// 初始化文件夹
const dir = ['./chat']
for (let i = 0; i < dir.length; i++) {
    const dirPath = path.resolve(BASE_PATH, dir[i])
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath)
    }
}

function readFile(filePath) {
    const file = path.resolve(BASE_PATH, filePath)
    return fs.readFileSync(file, 'utf-8')
}

function writeFile(filePath, content) {
    const file = path.resolve(BASE_PATH, filePath)
    fs.writeFileSync(file, content)
}

function loadConfig() {
    let config = {
        chart: {
            title: '编辑器',
            layout: 'force',
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
            vendor: '',
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
    try {
        const data = readFile('config.json')
        const obj = JSON.parse(data)
        // 如果有就覆盖，如果没有就保持原来的
        config = deep(obj, config)
        writeFile('config.json', JSON.stringify(config))
    } catch (e) {
        writeFile('config.json', JSON.stringify(config))
    }
    return config
}
function deep(obj1, obj2) {
    if (typeof obj1 === 'object') {
        for (let key in obj1) {
            if (typeof obj1[key] === 'object') {
                obj2[key] = deep(obj1[key], obj2[key])
            } else {
                obj2[key] = obj1[key]
            }
        }
    }
    return obj2
}

export default {
    readFile,
    writeFile,
    loadConfig
}
