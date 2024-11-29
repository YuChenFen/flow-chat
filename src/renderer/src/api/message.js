import { $get } from '.'

export async function getUnreadMessage() {
    const { data } = await $get('/db/message/unread')
    return data
}
