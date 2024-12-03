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
 * @param {*} query 查询文本
 */
export async function vdQuery(text, query) {
    const { data } = await $post('/db/message/vd/query', JSON.stringify({ text, query }), {
        'Content-Type': 'application/json'
    })
    const results = `| 节点名称 | 节点内容 |\n| - | - |\n${data.nodes_results.join('\n')}\n\n| 源节点 | 目标节点 | 关系名称 | 关系内容 |\n| - | - | - | - |\n${data.edges_results.join('\n')}`
    return results
}
