import { $get, $post, $delete } from '.'

export const getCommunityList = async (userName, description, page = 1, size = 100) => {
    const params = {
        page: page,
        size: size
    }
    if (userName) {
        params.userName = userName
    }
    if (description) {
        params.description = description
    }
    const { data } = await $get('/db/community/list', params)
    return data
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

export const deleteCommunity = async (id) => {
    const { code } = await $delete('/db/community/data', { id })
    return code
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
