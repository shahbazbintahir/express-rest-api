// third party import
const nodemailer = require('nodemailer');

// import config information
const emailConfiguration = require("../config/email.config");

// helper function for sending email
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

// export function
module.exports = sendEmail;