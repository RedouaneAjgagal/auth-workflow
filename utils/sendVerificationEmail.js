const sendEmail = require('./sendEmail');

const sendVerificationEmail = async ({ name, email, verificationToken, origin }) => {
    const verificationLink = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;
    const message = `
        <h3>Welcome ${name}</h3>
        <p>Please confirm your email by clicking on the following link : <a href="${verificationLink}">Confirm my email</a></p>
    `;

    return sendEmail({
        to: email,
        subject: 'Email Confirmation',
        html: message
    });
}

module.exports = sendVerificationEmail;