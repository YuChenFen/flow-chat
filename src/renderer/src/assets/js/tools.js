class Tools {
    /**
     * 判断是否为空
     * @param {*} str
     * @return {boolean} 是否为空
     */
    static isAllSpaces(str) {
        return /^\s*$/.test(str)
    }

    /**
     * 深度拷贝
     * @param {object} obj1
     * @param {object} obj2
     */
    static deepCopy(obj1, obj2) {
        for (let key in obj1) {
            obj2[key] = typeof obj1[key] === 'object' ? Tools.deepCopy(obj1[key], {}) : obj1[key]
        }
        return obj2
    }

    /**
     * 打开文本文件
     * @param {object} types 文件类型
     * @return {Promise} 文件内容
     */
    static async openTextFile(types) {
        // eslint-disable-next-line no-undef
        let fileHandles = await showOpenFilePicker({
            multiple: false,
            types: types
        })
        if (fileHandles.length > 0) {
            const fileHandle = fileHandles[0]
            const file = await fileHandle.getFile()
            const content = await file.text()
            return content
        }
        return ''
    }

    /**
     * 打开保存文件对话框
     * @param {string} content 文件内容
     * @param {object} types 文件类型
     * @param {string} fileName 文件名
     */
    static async saveTextFile(content, types, fileName = '') {
        // eslint-disable-next-line no-undef
        const fileHandle = await showSaveFilePicker({
            suggestedName: fileName,
            types
        })
        const writable = await fileHandle.createWritable()
        await writable.write(content)
        await writable.close()
    }

    /**
     * base64转blob
     * @param {string} base64 base64字符串
     * @return {Blob} blob对象
     */
    static blobFromBase64(base64) {
        const byteString = atob(base64.split(',')[1])
        const mimeString = base64.split(',')[0].split(':')[1].split(';')[0]
        const ab = new ArrayBuffer(byteString.length)
        const ia = new Uint8Array(ab)
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i)
        }
        return new Blob([ab], { type: mimeString })
    }
}

export default Tools
