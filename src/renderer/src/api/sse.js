import { $post } from './index'

const eventNames = ['SSE: message']

class SSEEvents {
    static _listeners = {
        'SSE: message': new Set()
    }
    static init() {
        const token = sessionStorage.getItem('token')
        fetch('http://localhost:8008/v1/db/message/link', {
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
                    const { done, value } = await reader.read()
                    if (done) return
                    const data = new TextDecoder().decode(value)
                    SSEEvents.dispatchEvent('SSE: message', JSON.parse(data))
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

export function send(toUserId, content) {
    const data = {
        toUserId,
        content,
        type: 'text'
    }
    return $post('/db/message/send', JSON.stringify(data), {
        'Content-Type': 'application/json'
    })
}

export default SSEEvents
