import { defineStore } from 'pinia'

export const useFlowStore = defineStore('flow', () => {
    let option

    function getOption() {
        return option
    }
    function setOption(opt) {
        option = opt
    }

    return { getOption, setOption }
})
