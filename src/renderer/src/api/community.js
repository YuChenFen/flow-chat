import { $get, $post } from '.'

export const getCommunityList = async (userName, description) => {
    const params = {
        page: 1,
        size: 100
    }
    if (userName) {
        params.userName = userName
    }
    if (description) {
        params.description = description
    }
    const { data } = await $get('/db/community/list', params)
    let list = []
    for (let i = 0; i < data.length; i++) {
        list.push({
            id: data[i][0],
            name: data[i][1],
            description: data[i][2],
            image: data[i][3],
            updateTime: data[i][4],
            userAvatar: data[i][5]
        })
    }
    return list
}

export const getCommunityDetail = async (id) => {
    const params = {
        search: 'content, description',
        where: `id=${id}`
    }
    const { data } = await $get('/db/community/query', params)
    return {
        option: JSON.parse(data[0][0]),
        description: data[0][1]
    }
}

export const publishCommunity = async (params) => {
    const { code } = await $post('/db/community/data', params)
    return code
}

export async function addComment(communityId, content) {
    const { code } = await $post(
        '/db/community/comment',
        JSON.stringify({ communityId, content }),
        {
            'Content-Type': 'application/json'
        }
    )
    return code
}

export async function getCommentList(communityId, page = 1, size = 10) {
    const { data } = await $get('/db/community/comment/list', { communityId, page, size })
    return data
}
