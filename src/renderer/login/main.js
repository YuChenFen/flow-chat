import './style.css'
import { login, register } from './api.js'

const carMain = document.querySelector('.card-main')
const submit = document.querySelector('button[type="submit"]')
const submitText = submit.querySelector('.label')
const to = document.querySelector('footer')
const accountInput = document.querySelector('input[name="account"]')
const passwordInput = document.querySelector('input[name="password"]')

to.addEventListener('click', () => {
    if (submit.disabled) {
        return
    }
    const type = carMain.getAttribute('type') === 'login' ? 'register' : 'login'
    carMain.setAttribute('type', type)
    const title = document.querySelector('h1')
    const p = document.querySelector('p')
    const footer = document.querySelector('footer')
    submitText.innerText = type === 'login' ? '登录' : '注册'
    title.innerText = type === 'login' ? '登录' : '注册'
    p.innerText = type === 'login' ? 'Welcome Back!' : 'LETS GO!'
    footer.innerText = type === 'login' ? '没有账号? 立即注册' : '已有账号? 立即登录'
    const inputs = document.querySelectorAll('input')
    inputs.forEach((input) => {
        input.value = ''
    })
})

async function submitForm(userAccount, userPassword) {
    if (carMain.getAttribute('type') === 'login') {
        try {
            const { code, data } = await login(userAccount, userPassword)
            if (code === 200) {
                window.electron.ipcRenderer.send('login:setLoginData', {
                    token: data.token,
                    userAccount,
                    role: data.userRole
                })
                window.electron.ipcRenderer.send('close')
                window.electron.ipcRenderer.send('openMainWindow')
            } else {
                window.electron.ipcRenderer.send('showMessageBox', { message: data })
            }
        } catch (e) {
            window.electron.ipcRenderer.send('showMessageBox', { message: '网络错误，请重试' })
        }
    } else {
        try {
            const { code, data } = await register(userAccount, userPassword)
            if (code === 200) {
                window.electron.ipcRenderer.send('showMessageBox', { message: '注册成功' })
            } else {
                window.electron.ipcRenderer.send('showMessageBox', { message: data })
            }
        } catch (e) {
            window.electron.ipcRenderer.send('showMessageBox', { message: '网络错误，请重试' })
        }
    }
}

submit.addEventListener('click', async () => {
    submit.disabled = true
    const userAccount = accountInput.value
    const userPassword = passwordInput.value
    if (!userAccount || !userPassword) {
        window.electron.ipcRenderer.send('showMessageBox', { message: '账号或密码不能为空' })
    } else {
        await submitForm(userAccount, userPassword)
    }
    submit.disabled = false
})

accountInput.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
        passwordInput.focus()
    }
})

passwordInput.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
        submit.click()
    }
})
