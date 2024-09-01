import nodemailer from 'nodemailer'
const sendVerification = async (email:string,link:string)=>{
  
      await transport.sendMail({
        from:"verification@myapp.com",
        to:email,
        html:`<h1>Hesabınızı bu <a href="${link}" >linke</a> tıklayarak doğrulayın</h1>`
      })

}
const sendPasswordResetLink = async (email:string,link:string)=>{
  
  await transport.sendMail({
    from:"security@myapp.com",
    to:email,
    html:`<h1>Hesabınızı bu <a href="${link}" >linke</a> tıklayarak şifreinizi güncelleyebilirsiniz</h1>`
  })

}

const sendPasswordUpdateMessage = async(email:string)=>{
  await transport.sendMail({
    from:"security@myapp.com",
    to:email,
    html:`<h1>Şifreniz güncellendi</h1>`
  })
}

const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAIL_TRAP_USER,
      pass: process.env.MAIL_TRAP_PASSWORD
    }
  });
const mail = {
    sendVerification,
    sendPasswordResetLink,
    sendPasswordUpdateMessage
}

export default mail