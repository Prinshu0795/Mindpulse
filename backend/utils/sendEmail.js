const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Send email with defined transport object
    const message = {
        from: `${process.env.EMAIL_FROM_NAME || 'MindPulse'} <${process.env.EMAIL_FROM}>`,
        to: options.email,
        subject: options.subject,
        html: options.html
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
