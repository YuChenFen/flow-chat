<template>
    <div class="container">
        <div class="back">
            <div class="card">
                <div class="card-main" :type="type">
                    <h1>{{ typeText }}</h1>
                    <p>{{ describeText }}</p>
                    <div class="form">
                        <input
                            v-model="account"
                            type="text"
                            placeholder="账号"
                            name="account"
                            @keydown.enter="passwordFocus"
                        />
                        <input
                            ref="passwordRef"
                            v-model="password"
                            type="password"
                            placeholder="密码"
                            name="password"
                            @keydown.enter="submit"
                        />
                    </div>
                    <button type="submit" :disabled="disabled" @click="submit">
                        <span class="loader"></span>
                        <span class="label">{{ typeText }}</span>
                    </button>
                    <footer @click="changeType">{{ changeTypeText }}</footer>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { login, register } from './api.js'

const disabled = ref(false)
const type = ref('login')
const typeText = ref('登录')
const describeText = ref('Welcome Back!')
const account = ref('')
const password = ref('')
const changeTypeText = ref('没有账号? 立即注册')
const passwordRef = ref()

function changeType() {
    if (disabled.value) {
        return
    }
    type.value = type.value === 'login' ? 'register' : 'login'
    typeText.value = type.value === 'login' ? '登录' : '注册'
    describeText.value = type.value === 'login' ? 'Welcome Back!' : 'LETS GO!'
    changeTypeText.value = type.value === 'login' ? '没有账号? 立即注册' : '已有账号? 立即登录'
    account.value = ''
    password.value = ''
}

async function submitForm(userAccount, userPassword) {
    if (type.value === 'login') {
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

async function submit() {
    disabled.value = true
    const userAccount = account.value
    const userPassword = password.value
    if (!userAccount || !userPassword) {
        window.electron.ipcRenderer.send('showMessageBox', { message: '账号或密码不能为空' })
    } else {
        await submitForm(userAccount, userPassword)
    }
    disabled.value = false
}

function passwordFocus() {
    passwordRef.value?.focus()
}
</script>

<style scoped>
.container {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.back:has(.card-main[type='register']) {
    &::before {
        background-image: linear-gradient(90deg, #53e9d9, #53e9d9 70%, transparent);
    }
    .card {
        animation: twinkle-login 5000ms infinite linear;
    }
}
.back:has(.card-main[type='register']) {
    &::before {
        background-image: linear-gradient(90deg, #f97d3e, #f97d3e 70%, transparent);
    }
    .card {
        animation: twinkle-register 5000ms infinite linear;
    }
}

.back {
    width: 550px;
    height: 350px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;
    border-radius: 5px;
    user-select: none;
    box-shadow:
        rgb(14 30 37 / 55%) 0px 2px 4px 0px,
        rgb(14 30 37 / 55%) 0px 2px 16px 0px;

    &::before {
        position: absolute;
        content: '';
        display: block;
        width: 300px;
        height: 200%;
        background-image: linear-gradient(90deg, #53e9d9, #53e9d9 70%, transparent);
        mask-image: linear-gradient(to top, transparent, transparent 50%, #000 1px, #000);
        animation: rotation 5000ms infinite linear;
    }

    .card {
        position: absolute;
        width: calc(100% - 5px);
        height: calc(100% - 5px);
        background-color: rgb(255, 255, 255);
        border-radius: 5px;
        background-image: url('./bg.jpg');
        background-size: cover;
        -webkit-app-region: drag;
    }
}

@keyframes rotation {
    0% {
        transform: rotateZ(0deg);
    }

    0% {
        transform: rotateZ(360deg);
    }
}

@keyframes twinkle-login {
    0% {
        box-shadow: #53e9d946 0px 5px 15px;
    }

    50% {
        box-shadow: #53e9d914 0px 5px 15px;
    }
    100% {
        box-shadow: #53e9d946 0px 5px 15px;
    }
}

@keyframes twinkle-register {
    0% {
        box-shadow: #f97d3e46 0px 5px 15px;
    }

    50% {
        box-shadow: #f97d3e14 0px 5px 15px;
    }
    100% {
        box-shadow: #f97d3e46 0px 5px 15px;
    }
}

.card {
    position: relative;

    .card-main[type='login'] {
        left: 34%;
        box-shadow: #02b6d693 -3px 0px 5px;
        h1,
        p {
            background-image: linear-gradient(110deg, #02b5d6, 45%, #04d9ff, 55%, #02b5d6);
        }
        input {
            border: #02b5d6 1px solid;
            color: #02b5d6;
            &:focus {
                box-shadow: #02b5d6 0px 0px 5px;
            }

            &::placeholder {
                color: #02b5d6;
            }
        }
        button[type='submit'] {
            background-color: #02b5d6;

            &:hover {
                box-shadow: #02b5d6 0px 2px 8px 0px;
            }
        }

        footer {
            color: #02b5d6;

            &::before {
                background-color: #00d9ff;
            }
        }
    }
    .card-main[type='register'] {
        left: 0;
        box-shadow: #d3602693 3px 0px 5px;
        h1,
        p {
            background-image: linear-gradient(110deg, #d36026, 45%, #ff5500, 55%, #d36026);
        }
        input {
            border: #d36026 1px solid;
            color: #d36026;
            &:focus {
                box-shadow: #d36026 0px 0px 5px;
            }

            &::placeholder {
                color: #d36026;
            }
        }
        button[type='submit'] {
            background-color: #d36026;

            &:hover {
                box-shadow: #d36026 0px 2px 8px 0px;
            }
        }

        footer {
            color: #d36026;

            &::before {
                background-color: #ff5500;
            }
        }
    }
    .card-main {
        position: absolute;
        height: 100%;
        width: 66%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 5px;
        background-color: #ffffff;
        transition: all 500ms;

        h1,
        p {
            color: transparent;
            background-clip: text;
            background-size: 250% 100%;
            animation: backgroundShine 2s linear infinite;
            transition: background-position 500ms;
        }

        .form {
            width: 80%;
            position: relative;
            margin: 20px 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 20px;

            input {
                width: 75%;
                height: 30px;
                border-radius: 5px;
                background-color: #ffffff;
                font-size: 0.8rem;
                padding: 0 10px;
                outline: none;
                transition:
                    box-shadow 500ms,
                    border-color 500ms;
                letter-spacing: 0.1rem;

                &::placeholder {
                    transition: color 500ms;
                }
            }
        }

        button[type='submit'] {
            width: 30%;
            height: 30px;
            border: none;
            border-radius: 15px;
            color: #fff;
            transition:
                box-shadow 500ms,
                background-color 500ms;
            cursor: pointer;
        }

        footer {
            margin-top: 20px;
            font-size: 0.7rem;
            position: relative;
            cursor: pointer;
            transition: color 500ms;

            &::before {
                content: '';
                position: absolute;
                display: block;
                width: 100%;
                height: 1px;
                bottom: -2px;
                left: 0;
                transform: scaleX(0);
                transition:
                    transform 0.3s ease,
                    background-color 500ms;
                transform-origin: top right;
            }

            &:hover::before {
                transform: scaleX(1);
                transform-origin: top left;
            }
        }
    }
}

input,
button,
footer {
    -webkit-app-region: no-drag;
}

@keyframes backgroundShine {
    from {
        background-position: 0, 0;
    }

    to {
        background-position: -200%, 0;
    }
}

button[disabled] {
    cursor: not-allowed !important;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    opacity: 0.5;

    &:hover {
        box-shadow: none !important;
    }
}

button[disabled] .loader {
    color: #ffffff;
    font-size: 0.6rem;
    text-indent: -9999em;
    overflow: hidden;
    width: 1em;
    height: 1em;
    border-radius: 50%;
    position: relative;
    transform: translateZ(0);
    animation:
        mltShdSpin 1.7s infinite ease,
        round 1.7s infinite ease;
}

@keyframes mltShdSpin {
    0% {
        box-shadow:
            0 -0.83em 0 -0.4em,
            0 -0.83em 0 -0.42em,
            0 -0.83em 0 -0.44em,
            0 -0.83em 0 -0.46em,
            0 -0.83em 0 -0.477em;
    }
    5%,
    95% {
        box-shadow:
            0 -0.83em 0 -0.4em,
            0 -0.83em 0 -0.42em,
            0 -0.83em 0 -0.44em,
            0 -0.83em 0 -0.46em,
            0 -0.83em 0 -0.477em;
    }
    10%,
    59% {
        box-shadow:
            0 -0.83em 0 -0.4em,
            -0.087em -0.825em 0 -0.42em,
            -0.173em -0.812em 0 -0.44em,
            -0.256em -0.789em 0 -0.46em,
            -0.297em -0.775em 0 -0.477em;
    }
    20% {
        box-shadow:
            0 -0.83em 0 -0.4em,
            -0.338em -0.758em 0 -0.42em,
            -0.555em -0.617em 0 -0.44em,
            -0.671em -0.488em 0 -0.46em,
            -0.749em -0.34em 0 -0.477em;
    }
    38% {
        box-shadow:
            0 -0.83em 0 -0.4em,
            -0.377em -0.74em 0 -0.42em,
            -0.645em -0.522em 0 -0.44em,
            -0.775em -0.297em 0 -0.46em,
            -0.82em -0.09em 0 -0.477em;
    }
    100% {
        box-shadow:
            0 -0.83em 0 -0.4em,
            0 -0.83em 0 -0.42em,
            0 -0.83em 0 -0.44em,
            0 -0.83em 0 -0.46em,
            0 -0.83em 0 -0.477em;
    }
}

@keyframes round {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
