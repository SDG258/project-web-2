const nodemailer = require('nodemailer');

async function send(to, subject, content) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USERNAME || '17k1.web2.demo@gmail.com',
          pass: process.env.EMAIL_PASSWORD || 'abcXYZ123~' ,
        }
      });
      
      return transporter.sendMail({
        from: process.env.EMAIL_USERNAME || '17k1.web2.demo@gmail.com',
        to,
        subject,
        text: content,
      });
}

module.exports = { send };