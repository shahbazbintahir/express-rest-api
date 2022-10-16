const nodemailer = require('nodemailer');

const emailConfiguration = require("../config/email.config");

const sendEmail= async (options) => {
  //creating a transporter
  const transporter = nodemailer.createTransport(emailConfiguration);
  //define  the email options
  const mailOptions = {
    from: emailConfiguration.auth.user,
    to: options.email,
    subject: options.subject,
    html: options.html,
    text: options.message,
  };
  //now send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;