<template>
    <MdEditor v-model="text" v-bind="attrs" />
</template>

<script setup>
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { useAttrs } from 'vue'

const text = defineModel('text')
const attrs = useAttrs()
</script>

<style scoped></style>
