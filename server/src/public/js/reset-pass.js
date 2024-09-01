const form = document.getElementById('form')
const messageTag = document.getElementById('message')
const password = document.getElementById('password')
const confirmPassword = document.getElementById('confirm-password')
const notification = document.getElementById('notification')
const submitBtn = document.getElementById('submit')
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/
form.style.display='none'
let token,id
window.addEventListener('DOMContentLoaded',async()=>{
    //URLSearchParams(window.location.search)
    //example.com?param1=value1&param2=valu2
    const params = new Proxy(new URLSearchParams(window.location.search),{
        get:(searchParams,prop)=>{
           return searchParams.get(prop)
        }
    })
     id = params.id
     token = params.token

   const response =  await fetch('/auth/verify-pass-reset-token',{
        method:'POST',
        body:JSON.stringify({token,id}),
        headers:{
            "Content-Type":"application/json;charset=utf-8"
        }
    })
    if(!response.ok) {
        const {message} = await response.json()
        messageTag.innerText = message
        messageTag.classList.add('error')
        return
    }

    messageTag.style.display='none'
    form.style.display='block'
})

const displayNotification = (message,type)=>{
    notification.style.display = 'block'
    notification.innerText = message
    notification.classList.add(type)
}

const handleSubmit = async (event)=>{
    
    event.preventDefault()
    if(!passwordRegex.test(password.value)) {
        return displayNotification('Invalid password','error')
    } 
    if(password.value !== confirmPassword.value) {
        return displayNotification('Password do not match!','error')
    } 

    submitBtn.disabled = true
    submitBtn.innerText = "Please wait..."

   const response = await fetch('/auth/reset-pass',{
        method:'POST',
        headers:{
            "Content-Type":"application/json;charset=utf-8"
        },
        body:JSON.stringify({id,token,password:password.value})
    })

    submitBtn.disabled = false
    submitBtn.innerText = "Update Password"


    if(!response.ok) {
        const {message} = await response.json()
        console.log("c")
        return displayNotification(message,'error')
    }

    messageTag.style.display="block"
    messageTag.innerText="Your password updated successfully"
    form.style.display='none'

}
form.addEventListener('submit',handleSubmit)