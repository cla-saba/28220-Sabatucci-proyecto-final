const nodemailer = require('nodemailer');
const { logConsole, logFile } = require('./loggers');

let transporter;

nodemailer.createTestAccount((err, account) => {
  if (err) {
    logFile.error('Failed to create a testing account. ' + err.message);
    return process.exit(1);
  }

  // Create a SMTP transporter object
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    // secure: account.smtp.secure,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
});

const sendEmail = async (to, subject, html) => {
  let message = {
    from: 'Cla Cart <no-reply@clacart.com>',
    to: `Recipient <${to}>`,
    subject,
    html
  };

  return await transporter.sendMail(message, (err, info) => {
    if (err) {
      logFile.error('Error occurred. ' + err.message);
      return process.exit(1);
    }

    logConsole.info('Email | Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    logConsole.info('Email | Preview URL: %s', nodemailer.getTestMessageUrl(info));
  });
}

module.exports = sendEmail;
