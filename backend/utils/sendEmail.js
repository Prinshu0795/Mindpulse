const sgMail = require('@sendgrid/mail');

const sendEmail = async (options) => {
    // Set the SendGrid API Key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Send email using SendGrid's HTTP API (bypasses Render SMTP restrictions)
    const msg = {
        to: options.email,
        from: {
            name: process.env.EMAIL_FROM_NAME || 'MindPulse',
            email: process.env.EMAIL_FROM || process.env.EMAIL_USER
        },
        subject: options.subject,
        html: options.html
    };

    const info = await sgMail.send(msg);

    console.log('Message sent successfully via SendGrid');
};

module.exports = sendEmail;
