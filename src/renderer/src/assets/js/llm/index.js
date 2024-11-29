import config from '../config'
import Ollama from './ollama'
import Siliconflow from './siliconflow'
import ZhiPuAi from './zhipuai'

class LLM {
    static vendorName = {
        ollama: Ollama,
        siliconflow: Siliconflow,
        智谱AI: ZhiPuAi
    }
    static currentVendorName = config.llm.vendor

    /**
     * 聊天
     * @param {*} messages 消息
     *
     * @return {Promise} 聊天结果
     */
    static async chat(messages) {
        return await LLM.vendorName[LLM.currentVendorName].chat(messages)
    }

    /**
     * 异步聊天
     * @param {*} messages 消息
     * @param {*} callback 回调
     * @return {Promise} 聊天结果
     */
    static async chatAsync(messages, callback) {
        return await LLM.vendorName[LLM.currentVendorName].chatAsync(messages, callback)
    }
}

export default LLM
