import { $get } from '.'

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
