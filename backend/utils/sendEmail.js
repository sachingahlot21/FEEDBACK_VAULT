require('dotenv').config();
const nodemailer = require("nodemailer");


module.exports = async({email , userId , verifyCode}) => {
    try{
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service:process.env.SERVICE,
            port: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.SECURE), 
            auth: {
              user: process.env.USER,
              pass: process.env.PASSWORD,
            },
          });


         const info = await transporter.sendMail({
            from: process.env.USER, // sender address
            to: email, // list of receivers
            subject:"verification code", // Subject line
            html:  `<p>Click <a href="${process.env.DOMAIN}/${userId}/verify/${verifyCode}">here</a> to verify your email
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verify-email?userId=${userId}&verifyCode=${verifyCode}
            </p>`, 
          });

          console.log("mail sent...")
          return info
    }
    catch(error){
       console.log(error)
    }
}




