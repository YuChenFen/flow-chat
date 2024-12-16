<template>
    <MdEditor v-model="text" v-bind="attrs">
        <template v-for="(slot, name) in slots" #[name] :key="name">
            <slot :name="name"></slot>
        </template>
    </MdEditor>
</template>

<script setup>
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { useAttrs, useSlots } from 'vue'

const text = defineModel('text')
const attrs = useAttrs()
const slots = useSlots()
</script>

<style>
html.dark {
    .cm-editor {
        background: transparent;
        color: var(--app-color);
    }
    .md-editor {
        background: rgba(0, 0, 0, 0.25);
        color: var(--app-color);
        border: 1px solid #666;

        /*input {
            caret-color: var(--app-color) !important;
        } */
    }
    .md-editor-footer {
        color: var(--app-color);
        border-top: 1px solid #666;
    }

    .ͼ15 .cm-cursor,
    .ͼ15 .cm-dropCursor {
        border-left-color: var(--app-color);
    }
}
</style>
