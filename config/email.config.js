require('dotenv').config()

module.exports = {
  host: process.env.MAIL_HOST || 'smtp.googlemail.com',
  service: process.env.MAIL_MAILER || 'smtp',
  port: process.env.MAIL_PORT || '587',
  auth: {
    user: process.env.MAIL_USERNAME || '',
    pass: process.env.MAIL_PASSWORD || '',
  },
};