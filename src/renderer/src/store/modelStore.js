import { defineStore } from 'pinia'
import config from '@renderer/assets/js/config'
import LLM from '@renderer/assets/js/llm'
import Ollama from '@renderer/assets/js/llm/ollama'
import Siliconflow from '@renderer/assets/js/llm/siliconflow'
import ZhiPuAi from '../assets/js/llm/zhipuai'

export const useModelStore = defineStore('model', () => {
    const llm = {
        getVendorName() {
            return LLM.currentVendorName
        },
        setVendorName(name) {
            LLM.currentVendorName = name
            config.llm.vendor = name
        },
        getVendorNameList() {
            return Object.keys(LLM.vendorName)
        },
        getRetrieverEnable() {
            return config.llm.retrieverEnable
        },
        setRetrieverEnable(enable) {
            config.llm.retrieverEnable = enable
        },
        getRetrieverWeight() {
            return config.llm.retrieverWeight
        },
        setRetrieverWeight(weight) {
            config.llm.retrieverWeight = weight
        }
    }

    const ollama = {
        getUrl() {
            return Ollama.url
        },
        setUrl(url) {
            Ollama.url = url
            config.llm.ollama.url = url
        },
        getModel() {
            return Ollama.model
        },
        setModel(model) {
            Ollama.model = model
            config.llm.ollama.model = model
        },
        getModels() {
            return Ollama.getModels()
        }
    }

    const siliconflow = {
        getApiKey() {
            return Siliconflow.apiKey
        },
        setApiKey(apiKey) {
            Siliconflow.apiKey = apiKey
            config.llm.siliconflow.apiKey = apiKey
        },
        getModel() {
            return Siliconflow.model
        },
        setModel(model) {
            Siliconflow.model = model
            config.llm.siliconflow.model = model
        },
        getModels() {
            return Siliconflow.getModels()
        }
    }

    const zhipuai = {
        getApiKey() {
            return ZhiPuAi.apiKey
        },
        setApiKey(apiKey) {
            ZhiPuAi.apiKey = apiKey
            config.llm.zhipuai.apiKey = apiKey
        },
        getModel() {
            return ZhiPuAi.model
        },
        setModel(model) {
            ZhiPuAi.model = model
            config.llm.zhipuai.model = model
        },
        getModels() {
            return ZhiPuAi.getModels()
        }
    }

    return { llm, ollama, siliconflow, zhipuai }
})
