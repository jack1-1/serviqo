
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const sendRegistrationEmail = async ({ firstName, email }) => {
    const info = await transporter.sendMail({
        from: `"ServiceHub" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Registration successful!',
        text: `Hi ${firstName},

Welcome to ServiceHub!

Your registration was successful. You can now log in to your account.

Thank you,
ServiceHub Team`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Welcome to ServiceHub!</h2>
                <p>Hi ${escapeHtml(firstName)},</p>
                <p>Your registration was successful.</p>
                <p>You can now log in to your account.</p>
                <p>Thank you,<br/>ServiceHub Team</p>
            </div>
        `
    });

    return info;
};

const escapeHtml = (value = '') =>
    String(value).replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[char]);

module.exports = {
    sendRegistrationEmail
};
