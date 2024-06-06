const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'siseveca@gmail.com',
        pass: '03101998Temuco/*-+.'
    }
});

const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: 'siseveca@gmail.com',
        to,
        subject,
        text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
    });
};

module.exports = { sendEmail };
