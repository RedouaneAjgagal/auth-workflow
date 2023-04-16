const nodemailerConfig = {
    host: 'smtp-relay.sendinblue.com',
    port: 587,
    auth: {
        user: process.env.USER_SIB,
        pass: process.env.PASS_SIB
    }
}

module.exports = nodemailerConfig;