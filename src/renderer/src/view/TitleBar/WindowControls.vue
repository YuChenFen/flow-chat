<template>
    <div class="window-controls-container">
        <div class="controls-button" close @click="close">
            <svg
                t="1709375294946"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M217.82708 851.418089m-22.627417-22.627417l0 0q-22.627417-22.627417 0-45.254834l588.312842-588.312842q22.627417-22.627417 45.254834 0l0 0q22.627417 22.627417 0 45.254834l-588.312842 588.312842q-22.627417 22.627417-45.254834 0Z"
                ></path>
                <path
                    d="M172.572246 217.850413m22.627417-22.627417l0 0q22.627417-22.627417 45.254834 0l588.312842 588.312842q22.627417 22.627417 0 45.254834l0 0q-22.627417 22.627417-45.254834 0l-588.312842-588.312842q-22.627417-22.627417 0-45.254834Z"
                ></path>
            </svg>
        </div>
        <div class="controls-button" maximize @click="maximize">
            <svg
                t="1709375641237"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M802.16 191.78H222c-16.57 0-30 12.22-30 27.28v585.39c0 15.06 13.43 27.27 30 27.27h585.16a25 25 0 0 0 25-25V219.06c0-15.06-13.43-27.28-30-27.28zM256.05 773.61V250.13h512.1v523.48z"
                ></path>
            </svg>
        </div>
        <div class="controls-button" minimize @click="minimize">
            <svg
                t="1709375810724"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M875.263467 495.52477c0 11.307533-9.15859 20.466124-20.466124 20.466124l-655.325289 0c-11.307533 0-20.466124-9.15859-20.466124-20.466124 0-11.2973 9.15859-20.466124 20.466124-20.466124l655.325289 0C866.104877 475.058646 875.263467 484.22747 875.263467 495.52477z"
                ></path>
            </svg>
        </div>
    </div>
</template>
<script setup>
function close() {
    window.electron.ipcRenderer.send('close')
}
function maximize() {
    window.electron.ipcRenderer.send('maximize')
}
function minimize() {
    window.electron.ipcRenderer.send('minimize')
}
</script>
<style scoped>
.window-controls-container {
    display: flex;
    flex-direction: row-reverse;
}

.controls-button {
    height: var(--titlebar-height);
    width: calc(var(--titlebar-height) + 10px);
    -webkit-app-region: no-drag;

    & svg {
        padding: 5px;
        height: 100%;
        width: 100%;
        fill: var(--titlebar-color);
    }

    &[close]:hover {
        background-color: #ff2929e0;

        & svg {
            fill: #ffffff;
        }
    }

    &[maximize]:hover {
        background-color: #cacacae9;
    }

    &[minimize]:hover {
        background-color: #cacacae9;
    }
}
</style>
