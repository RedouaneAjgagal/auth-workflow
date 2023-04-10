const nodemailer = require('nodemailer');
const nodemailerConfig = require('./nodemailerConfig');

const sendEmail = async ({ to, subject, html }) => {
    let transporter = nodemailer.createTransport(nodemailerConfig);

    return transporter.sendMail({
        from: '"Vinnex Comp" <vinnex.comp@mail.io>', // sender address
        to, // list of receivers
        subject, // Subject line
        html // html body
        // text: "Lets see if these things works properly lol", // plain text body
    });
}

module.exports = sendEmail;