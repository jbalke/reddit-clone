import nodemailer from 'nodemailer';

interface EmailContent {
  to: string[] | string;
  subject: string;
  text: string;
  html?: string;
}

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'velva.gulgowski@ethereal.email', // generated ethereal user
    pass: 'DdeM3wMajpD8wfWVe5', // generated ethereal password
  },
});

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(content: EmailContent) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  const recipients = Array.isArray(content.to)
    ? content.to.flat().join(', ')
    : content.to;

  try {
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Velva Gulgowski" <velva.gulgowski@ethereal.email>', // sender address
      to: recipients, // list of receivers
      subject: content.subject, // Subject line
      text: content.text, // plain text body
      html: content.html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error(error);
  }
}
