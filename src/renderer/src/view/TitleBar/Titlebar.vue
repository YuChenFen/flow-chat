<template>
    <div>
        <div class="titlebar-content">
            <div class="titlebar-drag-region"></div>
            <div class="titlebar-left">
                <div style="width: 25px; height: 25px; margin-left: 5px">
                    <svg
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                    >
                        <path
                            d="M214.773 661.358l311.01-153.981 28.396 57.355-311.01 153.98z"
                            fill="#B4C1F9"
                            p-id="2849"
                        ></path>
                        <path
                            d="M562.63 558.63l-45.26-45.26a30.9 30.9 0 0 0-5 6.52c6.15-11.15 94.82-190.91 152.92-309l57.42 28.24c-0.38 0.78-38.44 78.16-76.26 154.79-22.23 45-40 81-52.89 106.89-26.56 53.43-26.56 53.43-30.93 57.82z"
                            fill="#B4C1F9"
                            p-id="2850"
                        ></path>
                        <path
                            d="M517.412 558.684l45.168-45.342 258.993 258-45.168 45.342z"
                            fill="#B4C1F9"
                            p-id="2851"
                        ></path>
                        <path
                            d="M540.5 536.5m-180.5 0a180.5 180.5 0 1 0 361 0 180.5 180.5 0 1 0-361 0Z"
                            fill="#7287FD"
                            p-id="2852"
                        ></path>
                        <path
                            d="M693.5 225.5m-124.5 0a124.5 124.5 0 1 0 249 0 124.5 124.5 0 1 0-249 0Z"
                            fill="#68D2C8"
                            p-id="2853"
                        ></path>
                        <path
                            d="M799.5 795.5m-124.5 0a124.5 124.5 0 1 0 249 0 124.5 124.5 0 1 0-249 0Z"
                            fill="#7287FD"
                            p-id="2854"
                        ></path>
                        <path
                            d="M227.5 691.5m-124.5 0a124.5 124.5 0 1 0 249 0 124.5 124.5 0 1 0-249 0Z"
                            fill="#FDC005"
                            p-id="2855"
                        ></path>
                    </svg>
                </div>
                <Menubar></Menubar>
            </div>
            <div class="titlebar-center"></div>
            <div class="titlebar-right">
                <WindowControls></WindowControls>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import WindowControls from './WindowControls.vue'
import Menubar from './Menubar.vue'
</script>
<style scoped>
.titlebar-content {
    width: 100%;
    height: 100%;
    position: relative;
    align-items: center;
    display: flex;
    justify-content: space-between;
    user-select: none;
    box-shadow:
        rgba(var(--app-box-shadow-color), 0.05) 0px 6px 24px 0px,
        rgba(var(--app-box-shadow-color), 0.08) 0px 0px 0px 1px;

    & .titlebar-drag-region {
        display: block;
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
        z-index: -1;
        -webkit-app-region: drag;
    }

    .titlebar-left {
        display: flex;
        align-items: center;
    }
}
</style>
