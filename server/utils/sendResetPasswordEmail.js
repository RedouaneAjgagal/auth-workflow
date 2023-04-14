const sendEmail = require('./sendEmail');

const sendResetPasswordEmail = async ({ name, email, token, origin }) => {
    const link = `${origin}/user/reset-password?token=${token}&email=${email}`;
    const message = `
        <h4>Hello ${name}</h4>
        <p>We have recieved a reset password action, if this was not you, you can just ignore this email.</p>
        <p>Else if you want to reset your password please click on the following link : <a href="${link}">RESET PASSWORD</a></p>
    `
    return sendEmail({
        subject: 'Reset password',
        to: email,
        html: message
    });
}

module.exports = sendResetPasswordEmail;