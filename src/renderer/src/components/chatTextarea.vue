<template>
    <div class="chat-textarea">
        <textarea v-model="value" v-bind="attrs" />
        <button class="send-button" @click="send">
            发送
            <span>(Ctrl + Enter)</span>
        </button>
    </div>
</template>

<script setup>
import { useAttrs } from 'vue'

const value = defineModel('modelValue')
const attrs = useAttrs()
const emits = defineEmits(['send'])
const send = () => {
    emits('send')
}
</script>

<style scoped>
.chat-textarea {
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
    width: 100%;
    height: 6rem;
}

.chat-textarea textarea {
    width: 100%;
    height: 100%;
    border: none;
    resize: none;
    background-color: transparent;
    outline: none;
    font-size: 14px;
    line-height: 24px;
    background-color: #fff;
    color: #333;
    overflow-y: scroll;
    border: 1px solid #ccc;
    padding: 5px 10px;
    font-size: medium;
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.03) 0px 0px 0px 1px;

    &:focus {
        border: 1px solid #a1c4fd;
    }
    &::-webkit-scrollbar {
        width: 0;
        height: 0;
    }
}

.send-button {
    position: absolute;
    width: 8rem;
    height: 2rem;
    background-color: #ffffff;
    color: #626262;
    border: 1px solid #efefef;
    border-radius: 5px;
    cursor: pointer;
    right: 10px;
    bottom: 10px;
    transition: all 0.1s ease-in-out;

    span {
        color: #aaa;
    }

    &:hover {
        color: #409eff;
        border-color: #c6e2ff;
        background-color: #ecf5ff;
    }
    &:hover > span {
        color: #40a0ffac;
    }
    &:active {
        color: #409eff;
        border-color: #409eff;
        background-color: #ecf5ff60;
    }
    &:active > span {
        color: #40a0ffac;
    }
}
</style>
