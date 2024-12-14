<template>
    <div>
        <svg
            v-if="attrs.state.value"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            class="icon"
        >
            <path
                d="M149.95456 471.77728a30.72 30.72 0 0 1 41.2672-2.00704l2.19136 2.00704 224.4608 224.4608 412.71296-412.73344a30.72 30.72 0 0 1 41.2672-1.98656l2.19136 1.98656a30.72 30.72 0 0 1 1.98656 41.24672l-1.98656 2.19136-434.46272 434.46272a30.72 30.72 0 0 1-41.24672 1.98656l-2.19136-1.98656-246.1696-246.19008a30.72 30.72 0 0 1 0-43.43808z"
            ></path>
        </svg>
        <span v-else class="icon"></span>
    </div>
</template>

<script setup>
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>

<style scoped>
.icon {
    width: 18px;
    height: 18px;
    margin-right: 5px;
    display: flex;
    align-items: center;
    fill: var(--titlebar-color);
}
</style>
