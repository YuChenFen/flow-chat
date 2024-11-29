<template>
    <div
        ref="contextMenuRef"
        class="context-menu"
        :style="{
            left: x === undefined ? false : x + 'px',
            top: y === undefined ? false : y + 'px'
        }"
    >
        <span v-for="data in dataArray" :key="keyName ? data[keyName] : data">
            <div v-if="data.list" class="context-menu-item">
                <div class="has-children-item-label">
                    <p>{{ data[labelName] }}</p>
                    <svg
                        t="1723621107797"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="4093"
                        width="20"
                        height="20"
                    >
                        <path
                            d="M384 354.24v315.616a34.112 34.112 0 0 0 52.96 28.448l226.656-150.752a42.688 42.688 0 0 0 0-71.072l-226.656-150.688A34.08 34.08 0 0 0 384 354.24z"
                            fill="#ccc"
                            p-id="4094"
                        ></path>
                    </svg>
                </div>
                <ContextMenuView
                    v-if="data.list"
                    class="children-menu"
                    :data-array="data.list"
                    v-bind="attrs"
                >
                </ContextMenuView>
            </div>
            <button v-else class="context-menu-item" @click.stop="onClick(data, $event)">
                <p>{{ data[labelName] }}</p>
                <p></p>
            </button>
        </span>
    </div>
</template>

<script setup>
import { nextTick, onUnmounted, ref, useAttrs } from 'vue'

const props = defineProps({
    dataArray: {
        required: true
    },
    x: {
        type: Number,
        required: false
    },
    y: {
        type: Number,
        required: false
    },
    keyName: {
        default: ''
    },
    labelName: {
        default: 'label'
    }
})
const x = ref(props.x)
const y = ref(props.y)
const contextMenuRef = ref(null)
const delta = 2
nextTick(() => {
    if (x.value !== undefined && y.value !== undefined) {
        if (x.value + contextMenuRef.value.offsetWidth > window.innerWidth) {
            x.value = window.innerWidth - contextMenuRef.value.offsetWidth - delta
        }
        if (y.value + contextMenuRef.value.offsetHeight > window.innerHeight) {
            y.value = window.innerHeight - contextMenuRef.value.offsetHeight - delta
        }
    }
})

const attrs = useAttrs()
defineEmits(['update:x', 'update:y'])
function onClick(data, event) {
    attrs.click(data, event)
}

function close(event) {
    if (
        event.target.className == 'context-menu-item' ||
        event.target.parentElement?.className == 'context-menu-item' ||
        event.target.parentElement?.parentElement?.className == 'context-menu-item'
    ) {
        return
    }
    attrs.close(event)
}
if (props.x !== undefined && props.y !== undefined) {
    document.addEventListener('mousedown', close, {
        capture: true
    })
    window.addEventListener('blur', close)
    onUnmounted(() => {
        document.removeEventListener('mousedown', close, {
            capture: true
        })
        window.removeEventListener('blur', close)
    })
}
</script>

<style scoped>
@import url(./style.css);
</style>
