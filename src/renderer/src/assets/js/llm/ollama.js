import config from '../config'

class Ollama {
    static url = config.llm.ollama.url
    static model = config.llm.ollama.model
    constructor() {}

    /**
     * 聊天
     * @param {*} messages 消息
     *
     * @return {Promise} 聊天结果
     */
    static async chat(messages) {
        const resp = await fetch(`${Ollama.url}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: Ollama.model,
                messages: messages,
                stream: false
            })
        })
        const {
            message: { content }
        } = await resp.json()
        return content
    }

    /**
     * 异步聊天
     * @param {*} messages 消息
     * @param {*} callback 回调
     * @return {Promise} 聊天结果
     */
    static async chatAsync(messages, callback) {
        const resp = await fetch(`${Ollama.url}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: Ollama.model,
                messages: messages,
                stream: true
            })
        })
        let str = ''
        const reader = resp.body.getReader()
        const textDecoder = new TextDecoder()
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const { done, value } = await reader.read()
            if (done) {
                break
            }
            const {
                message: { content }
            } = JSON.parse(textDecoder.decode(value))
            callback(content)
            str += content
        }
        return str
    }

    /**
     * 获取模型列表
     * @return {Promise} 模型列表
     */
    static async getModels() {
        const resp = await fetch(`${Ollama.url}/api/tags`)
        return await resp.json()
    }
}

export default Ollama
