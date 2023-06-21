// third party import
const nodemailer = require('nodemailer');
const path = require('path');
const hbs = require('nodemailer-express-handlebars');

// import config information
const emailConfiguration = require("../../config/email.config");

// helper function for sending email
const newUserCreationEmail = (options) => {
    //email configuration for template paths
    const viewPath = path.resolve(__dirname, '../../../templates/newUserEmail/');
    const partialsPath = path.resolve(__dirname, '../../../templates/newUserEmail');

    //creating a transporter
    const transporter = nodemailer.createTransport(emailConfiguration);

    //define  the email options
    const mailOptions = {
        from: emailConfiguration.auth.user,
        to: options.email,
        subject: options.subject,
        template: "index",
        context: {
            data: options,
        },
        attachments: [
            {   
                filename: 'logo.png',
                path: `${__dirname}/../../../../public/images/mail/logo.png`,
                cid: 'logo'
            },
            {   
                filename: 'animated_header.gif',
                path: `${__dirname}/../../../../public/images/mail/animated_header.gif`,
                cid: 'animated_header'
            },
            {   
                filename: 'body_background_2.png',
                path: `${__dirname}/../../../../public/images/mail/body_background_2.png`,
                cid: 'body_background_2'
            },
            {   
                filename: 'bottom_img.png',
                path: `${__dirname}/../../../../public/images/mail/bottom_img.png`,
                cid: 'bottom_img'
            },
    ]
    };

    const handlebarOptions = {
        viewEngine: {
            extName: ".handlebars",
            partialsDir: partialsPath,
            defaultLayout: false,
        },
        viewPath: viewPath,
        extName: ".handlebars",
    };
    // assign template
    transporter.use(
        "compile",
        hbs(handlebarOptions)
    );

    transporter.sendMail(mailOptions);
};

// export function
module.exports = newUserCreationEmail;