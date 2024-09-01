const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
        user: 'entinfotografia@gmail.com', 
        pass: 'trzr zrxe kcux ynnr' 
    }
});

const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: '"Beats Shop" <entinfotografia@gmail.com>', 
        to: to,
        subject: subject,
        text: text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = { sendEmail };
