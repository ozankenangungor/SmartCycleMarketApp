const messageTag = document.getElementById('message')

window.addEventListener('DOMContentLoaded', async () => {
    //URLSearchParams(window.location.search)
    //example.com?param1=value1&param2=valu2
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => {
            return searchParams.get(prop)
        }
    })
    const id = params.id
    const token = params.token

    const response = await fetch('/auth/verify', {
        method: 'POST',
        body: JSON.stringify({ token, id }),
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        }
    })
    if (!response.ok) {
        const { message } = await response.json()
        messageTag.innerText = message
        messageTag.classList.add('error')
        return
    }

    const { message } = await response.json()
    messageTag.innerText = message

})
