import { $post } from './index'
const baseUrl = import.meta.env.VITE_API_BASE_URL

const eventNames = ['SSE: message-text', 'SSE: message-chartRoom']

class SSEEvents {
    static _listeners = {
        'SSE: message-text': new Set(),
        'SSE: message-chartRoom': new Set()
    }
    static init() {
        const token = sessionStorage.getItem('token')
        fetch(`${baseUrl}/db/message/link`, {
            method: 'GET',
            headers: {
                'Content-Type': 'text/event-stream',
                Authorization: `Bearer ${token}`
            }
        }).then(async (response) => {
            const reader = response.body.getReader()
            try {
                // eslint-disable-next-line no-constant-condition
                while (true) {
                    let text = ''
                    while (text.indexOf('[END_FLAG]') === -1) {
                        const { done, value } = await reader.read()
                        if (done) return
                        text += new TextDecoder().decode(value)
                    }
                    const block = text.split('[END_FLAG]')
                    block[0] = decodeURIComponent(block[0])
                    // block[0] = block[0].replace(/\\\[END_FLAG\\\]/g, '[END_FLAG]')
                    const data = JSON.parse(block[0])
                    text = block[1]
                    SSEEvents.dispatchEvent(`SSE: message-${data.type}`, data)
                }
            } catch (e) {
                console.log('sse:', e)
            }
        })
    }

    static addEventListener(eventName, listener) {
        if (!eventNames.includes(eventName)) return
        SSEEvents._listeners[eventName].add(listener)
    }
    static removeEventListener(eventName, listener) {
        if (!eventNames.includes(eventName)) return
        SSEEvents._listeners[eventName].delete(listener)
    }
    static dispatchEvent(eventName, data) {
        if (!eventNames.includes(eventName)) return
        SSEEvents._listeners[eventName].forEach((listener) => {
            listener(data)
        })
    }
}

export function send(to, content, type) {
    const data = {
        to: String(to),
        // content: content.replace(/\[END_FLAG\]/g, '\\[END_FLAG\\]'),
        content: content,
        type: type
    }
    return $post('/db/message/send', JSON.stringify(data), {
        'Content-Type': 'application/json'
    })
}

export default SSEEvents
