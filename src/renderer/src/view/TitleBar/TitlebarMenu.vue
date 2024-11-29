<template>
    <div ref="menuRef" class="menu">
        <div v-for="(item, index) in props.menu" :key="index">
            <div v-if="item.type === 'item'" class="menu-item" @click="click(item.callback)">
                <p>{{ item.text }}</p>
                <p>{{ item.key }}</p>
            </div>
            <div v-else-if="item.type === 'line'" class="line"></div>
            <div v-else-if="item.type === 'menu'" class="menu-item">
                <div class="has-children-item-label">
                    <p>{{ item.text }}</p>
                    <svg
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                    >
                        <path
                            d="M384 354.24v315.616a34.112 34.112 0 0 0 52.96 28.448l226.656-150.752a42.688 42.688 0 0 0 0-71.072l-226.656-150.688A34.08 34.08 0 0 0 384 354.24z"
                            fill="#ccc"
                        ></path>
                    </svg>
                </div>
                <TitlebarMenu
                    :menu="item.children"
                    class="children-menu"
                    :blur="blurRoot"
                ></TitlebarMenu>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
const props = defineProps({
    menu: {
        type: Array
    },
    blur: {
        type: Function
    }
})
const menuRef = ref(null)
if (!props.blur) {
    window.addEventListener('blur', blurRoot)
}
function blurRoot() {
    if (props.blur) {
        props.blur()
    } else {
        menuRef.value?.parentElement?.blur()
    }
}
function click(callback) {
    if (callback) {
        callback()
    }
    blurRoot()
}
</script>
<style scoped>
@import url('./titlebarMenuStyle.css');
</style>
