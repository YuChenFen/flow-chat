import { $get, $post } from '.'

export const getUserInfo = async () => {
    const { data } = await $get('/db/user/info')
    return data
}

export const updateUserInfo = async (userInfo) => {
    const form = new FormData()
    for (const key in userInfo) {
        form.append(key, userInfo[key])
    }
    const { code } = await $post('/db/user/update', form)
    return code
}

export const queryUser = async (search, where) => {
    const params = {
        search: search.join(','),
        where: where
    }
    const {
        data: { data }
    } = await $get('/db/user/query', params)
    const req = {}
    for (let i = 0; i < search.length; i++) {
        req[search[i]] = data[0][i]
    }
    return req
}

export const getUserList = async (page = 1, size = 10, where = null) => {
    const params = {
        search: 'userName, userAvatar, gender, userAccount, phone, email, userRole, createTime, updateTime, isDelete',
        page,
        size
    }
    if (where) {
        params.where = where
    }
    const {
        data: { data, totle }
    } = await $get('/db/user/query', params)
    const list = data.map((item) => {
        return {
            checked: false,
            userName: item[0],
            userAvatar: item[1],
            gender: item[2],
            userAccount: item[3],
            phone: item[4],
            email: item[5],
            userRole: item[6],
            createTime: item[7],
            updateTime: item[8],
            isDelete: item[9]
        }
    })
    return {
        data: list,
        totle
    }
}

export const changeUserInfo = async (userAccount, userRole, isDelete) => {
    const { code, message } = await $post(
        '/db/user/change',
        JSON.stringify({ userAccount, userRole, isDelete }),
        {
            'Content-Type': 'application/json'
        }
    )
    return { code, message }
}
