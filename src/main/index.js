import { app, shell, BrowserWindow, ipcMain, dialog, clipboard } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fileManage from './fileManage'

const APP_NAME = 'flow chat'

function createWindow(path, options) {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        autoHideMenuBar: true,
        titleBarStyle: 'hidden',
        icon: icon,
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false
        },
        ...options
    })
    win.on('ready-to-show', () => {
        win.show()
    })
    win.loadFile(join(__dirname, path))
    return win
}

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        width: 900,
        height: 670,
        minWidth: 300,
        minHeight: 600,
        show: false,
        autoHideMenuBar: true,
        titleBarStyle: 'hidden',
        // titleBarOverlay: {
        //     color: '#2f3241',
        //     symbolColor: '#74b1be',
        //     height: 30
        // },
        // alwaysOnTop: true,
        icon: icon,
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false
        }
    })
    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }
}

app.whenReady().then(() => {
    electronApp.setAppUserModelId('com.electron')

    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    // IP
    ipcMain.on('ping', () => console.log('pong')) // test
    // 打开主进程
    ipcMain.on('openMainWindow', () => {
        createMainWindow()
    })
    //  打开登录窗口
    ipcMain.on('openLoginWindow', () => {
        createWindow('../renderer/login/index.html', {
            width: 600,
            height: 400,
            transparent: true,
            resizable: false
        })
    })
    // 窗口控制
    ipcMain.on('close', (e) => {
        BrowserWindow.fromWebContents(e.sender)?.close()
    })
    ipcMain.on('maximize', (e) => {
        const win = BrowserWindow.fromWebContents(e.sender)
        if (win?.isMaximized()) {
            win?.unmaximize()
        } else {
            win?.maximize()
        }
    })
    ipcMain.on('minimize', (e) => {
        const win = BrowserWindow.fromWebContents(e.sender)
        if (win?.isMinimized()) {
            win?.restore()
        } else {
            win?.minimize()
        }
    })
    // 文件管理
    ipcMain.handle('dialog:readFile', (_, args) => {
        try {
            const { filePath } = args
            let data = fileManage.readFile(filePath)
            return {
                success: true,
                data
            }
        } catch (e) {
            console.log(e)
            return {
                success: false,
                data: e
            }
        }
    })
    ipcMain.handle('dialog:writeFile', (_, args) => {
        try {
            const { filePath, content } = args
            fileManage.writeFile(filePath, content)
            return {
                success: true
            }
        } catch (e) {
            console.log(e)
            return {
                success: false,
                data: e
            }
        }
    })
    // 配置
    ipcMain.handle('dialog:loadConfig', () => {
        return fileManage.loadConfig()
    })

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
    })

    // 消息提示
    ipcMain.on('showMessageBox', (e, { message }) => {
        dialog.showMessageBox(BrowserWindow.fromWebContents(e.sender), {
            type: 'info',
            icon: icon,
            title: APP_NAME,
            message,
            buttons: ['确定'],
            noLink: true
        })
    })
    // 关于窗口
    ipcMain.on('showAboutMessageBox', (e) => {
        const win = BrowserWindow.fromWebContents(e.sender)
        const about = [
            '版本：0.0.1',
            'Electron: ' + process.versions.electron,
            'Chromium: ' + process.versions.chrome,
            'Node.js: ' + process.versions.node,
            'V8: ' + process.versions.v8,
            'OS：' + process.platform
        ].join('\n')
        dialog
            .showMessageBox(win, {
                type: 'info',
                icon: icon,
                title: APP_NAME,
                message: 'YU CHEN FENG SI',
                detail: about,
                buttons: ['复制', '确定'],
                noLink: true
            })
            .then(({ response }) => {
                if (response === 0) {
                    clipboard.writeText(about)
                }
            })
    })
    // 检查更新
    ipcMain.on('checkUpdate', (e) => {
        // TODO
        const win = BrowserWindow.fromWebContents(e.sender)
        dialog.showMessageBox(win, {
            type: 'info',
            icon: icon,
            title: APP_NAME,
            message: '当前没有可用的更新',
            buttons: ['确定'],
            noLink: true
        })
    })

    let $loginData
    ipcMain.on('login:setLoginData', (e, loginDtat) => {
        $loginData = loginDtat
    })
    ipcMain.handle('login:getLoginData', () => {
        const temp = $loginData
        $loginData = undefined
        return temp
    })

    // 默认打开登录页
    // createMainWindow()
    createWindow('../renderer/login/index.html', {
        width: 600,
        height: 400,
        transparent: true,
        resizable: false
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
