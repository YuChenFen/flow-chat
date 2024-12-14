import { $get, $post } from '.'

export async function getUnreadMessage() {
    const { data } = await $get('/db/message/unread')
    return data
}

export async function createCollaborationRoom() {
    const { data } = await $get('/db/message/collaboration/create')
    return data
}

export async function joinCollaborationRoom(roomId) {
    const data = await $get('/db/message/collaboration/join', { roomId })
    return data
}

export async function leaveCollaborationRoom(roomId) {
    const data = await $get('/db/message/collaboration/leave', { roomId })
    return data
}

/**
 * 向量数据库查询
 * @param {*} text 内容文本
 * @param {*} words 查询关键词
 * @param {*} n 搜索数量
 * @param {*} weight 权重
 */
export async function retrieverQuery(text, words, n = 100, weight = 0.5) {
    const { data } = await $post(
        '/db/message/retriever/query',
        JSON.stringify({ text, words, n, weight }),
        {
            'Content-Type': 'application/json'
        }
    )
    return data
}

export async function retrieverTextQuery(text, query, n = 100, weight = 0.5) {
    const { data } = await $post(
        '/db/message/retriever/text/query',
        JSON.stringify({ text, query, n, weight }),
        {
            'Content-Type': 'application/json'
        }
    )
    return data.join('\n')
}

export async function retrieverRerank(documents, query, n = 100) {
    const { data } = await $post(
        '/db/message/retriever/rerank',
        JSON.stringify({ documents, query, n }),
        {
            'Content-Type': 'application/json'
        }
    )
    return data
}
