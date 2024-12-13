import { autoUpdater } from 'electron-updater'
import icon from '../../resources/icon.png?asset'
import { dialog } from 'electron'

const APP_NAME = 'flow chat'

let MAIN_WIN
let IS_UPDATING = false
autoUpdater.autoDownload = false
autoUpdater.on('update-available', () => {
    dialog
        .showMessageBox(MAIN_WIN, {
            type: 'info',
            icon: icon,
            title: APP_NAME,
            message: '检测到新版本，是否立即下载？',
            buttons: ['立即下载', '取消'],
            noLink: true
        })
        .then(({ response }) => {
            if (response === 0) {
                autoUpdater.downloadUpdate()
            }
        })
})
autoUpdater.on('update-not-available', () => {
    dialog.showMessageBox(MAIN_WIN, {
        type: 'info',
        icon: icon,
        title: APP_NAME,
        message: '当前已经是最新版本',
        buttons: ['确定'],
        noLink: true
    })
})
autoUpdater.on('error', (error) => {
    dialog
        .showMessageBox(MAIN_WIN, {
            type: 'error',
            icon: icon,
            title: APP_NAME,
            message: `更新出错，${error}`,
            buttons: ['确定'],
            noLink: true
        })
        .then(() => {
            IS_UPDATING = false
        })
})
autoUpdater.on('download-progress', (progressObj) => {
    IS_UPDATING = true
    MAIN_WIN.setProgressBar(progressObj.percent / 100)
})
autoUpdater.on('update-downloaded', () => {
    IS_UPDATING = false
    MAIN_WIN.setProgressBar(-1)
    dialog
        .showMessageBox(MAIN_WIN, {
            type: 'info',
            icon: icon,
            title: APP_NAME,
            message: '新版本已下载，是否立即安装？',
            buttons: ['立即安装', '取消'],
            noLink: true
        })
        .then(({ response }) => {
            if (response === 0) {
                autoUpdater.quitAndInstall()
            }
        })
})

export function checkUpdate(win) {
    MAIN_WIN = win
    if (IS_UPDATING) {
        dialog.showMessageBox(MAIN_WIN, {
            type: 'info',
            icon: icon,
            title: APP_NAME,
            message: '正在更新中...',
            buttons: ['确定'],
            noLink: true
        })
    } else {
        autoUpdater.checkForUpdates()
    }
}
