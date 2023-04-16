const nodemailer = require('nodemailer');
const nodemailerConfig = require('./nodemailerConfig');

const sendEmail = async ({ to, subject, html }) => {
    let transporter = nodemailer.createTransport(nodemailerConfig);

    return transporter.sendMail({
        from: '"Auth WorkFlow" <support@authworkflow.com>', // sender address
        to, // list of receivers
        subject, // Subject line
        html // html body
        // text:  // plain text body
    });
}

module.exports = sendEmail;