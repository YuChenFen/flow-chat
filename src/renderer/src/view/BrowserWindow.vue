<template>
    <div id="BrowserWindow" class="container">
        <Sidebar style="flex: 0 0 54px"></Sidebar>
        <div style="flex: 1">
            <RouterView></RouterView>
        </div>
    </div>
</template>
<script setup>
import Sidebar from './Sidebar/index.vue'
import { RouterView } from 'vue-router'
</script>

<style scoped>
.container {
    display: flex;
    width: 100%;
}
</style>
