<template>
    <MdPreview
        :id="id"
        :model-value="text"
        :auto-fold-threshold="999999999"
        v-bind="attrs"
        style="background: transparent"
    />
</template>

<script setup>
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import { useAttrs } from 'vue'

const id = 'mdpreview-' + Math.floor(Math.random() * 100000000).toString(36)
defineProps({
    text: String
})
const attrs = useAttrs()
</script>

<style>
.md-editor-preview-wrapper {
    padding: 0 !important;
    background: transparent !important;
}
</style>
