import config from '../config'

class ZhiPuAi {
    static url = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
    static apiKey = config.llm.zhipuai.apiKey
    static model = config.llm.zhipuai.model
    constructor() {}

    /**
     * 聊天
     * @param {*} messages 消息
     *
     * @return {Promise} 聊天结果
     */
    static async chat(messages) {
        const resp = await fetch(ZhiPuAi.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${ZhiPuAi.apiKey}`
            },
            body: JSON.stringify({
                model: ZhiPuAi.model,
                messages: messages,
                stream: false
            })
        })
        const {
            choices: [
                {
                    message: { content }
                }
            ]
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
        const resp = await fetch(ZhiPuAi.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${ZhiPuAi.apiKey}`
            },
            body: JSON.stringify({
                model: ZhiPuAi.model,
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
            const res = textDecoder.decode(value).substring(6).split('data:')
            for (let i = 0; i < res.length; i++) {
                res[i] = res[i].trim()
                if (res[i] != '[DONE]') {
                    const {
                        choices: [
                            {
                                delta: { content }
                            }
                        ]
                    } = JSON.parse(res[i])
                    callback(content)
                    str += content
                }
            }
        }
        return str
    }

    /**
     * 获取模型列表
     * @return {Promise} 模型列表
     */
    static async getModels() {
        return ['glm-4-flash']
    }
}

export default ZhiPuAi
