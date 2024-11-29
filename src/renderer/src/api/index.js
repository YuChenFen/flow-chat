const baseUrl = import.meta.env.VITE_API_BASE_URL

/**
 * @description: get请求
 * @param {String} url 请求地址
 * @param {Object} params 请求参数
 * @param {Object} headers 请求头
 * @param {Number} timeout 超时时间
 * @return: Promise
 */
export const $get = async (url, params = {}, headers = {}, timeout = 5000) => {
    const token = sessionStorage.getItem('token')
    if (Object.keys(params).length) {
        url += '?'
        for (const key in params) {
            url += `${key}=${params[key]}&`
        }
        url = url.slice(0, -1)
    }
    const response = await fetch(`${baseUrl}${url}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            ...headers
        },
        timeout
    })
    // const { success, message, data } = await response.json()
    return await response.json()
}

/**
 * @description: post请求
 * @param {String} url 请求地址
 * @param {string | FormData} params 请求参数
 * @param {Object} headers 请求头
 * @param {Number} timeout 超时时间
 * @return: Promise
 */

export const $post = async (url, params, headers = {}, timeout = 5000) => {
    const token = sessionStorage.getItem('token')
    const response = await fetch(`${baseUrl}${url}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            ...headers
        },
        body: params,
        timeout
    })
    return await response.json()
}
