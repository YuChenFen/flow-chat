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

<style scoped></style>
