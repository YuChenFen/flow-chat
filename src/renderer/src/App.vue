<script setup lang="ts">
import Titlebar from './view/TitleBar/Titlebar.vue'
import BrowserWindow from './view/BrowserWindow.vue'
import SSEEvents from './api/sse'

try {
    window.electronAPI
        .getLoginData()
        .then((loginData) => {
            if (loginData?.token) {
                sessionStorage.setItem('token', loginData?.token)
            }
            if (loginData?.userAccount) {
                sessionStorage.setItem('userAccount', loginData?.userAccount)
            }
            if (loginData?.role) {
                sessionStorage.setItem('role', loginData?.role)
            }
        })
        .finally(() => {
            SSEEvents.init()
        })
} catch (e) {
    console.log(e)
}
</script>

<template>
    <Titlebar class="titlebar user-select-none"></Titlebar>
    <BrowserWindow class="browser-window"></BrowserWindow>
</template>

<style scoped>
.titlebar {
    position: relative;
    width: 100%;
    height: var(--titlebar-height);
    background-color: var(--titlebar-background-color);
    color: var(--titlebar-color);
    z-index: 9999999;
}

.browser-window {
    height: calc(100vh - var(--titlebar-height));
    background-color: var(--body-background-color);
    color: var(--body-color);
}
</style>
