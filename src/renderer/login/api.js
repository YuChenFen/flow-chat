import { $get, $post } from '../src/api/index'

export async function login(userAccount, userPassword) {
    const { data, code, message } = await $get('/db/login', {
        userAccount,
        userPassword
    })
    if (code !== 200) {
        return {
            code,
            data: message
        }
    }
    return {
        code,
        data
    }
}

export async function register(userAccount, userPassword) {
    const { data, code, message } = await $post(
        '/db/register',
        JSON.stringify({ userAccount, userPassword }),
        {
            'Content-Type': 'application/json'
        }
    )
    if (code !== 200) {
        return {
            code,
            data: message
        }
    }
    return {
        code,
        data
    }
}
