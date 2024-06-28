import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendEmail = async (req, res) => {
  const { fromEmail, subject, text } = req.body;

  if (!fromEmail || !subject || !text) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, 
      },
    });

    const mailOptions = {
      from: fromEmail,
      to: 'emiratesdrive774@gmail.com',
      subject: subject,
      text: text,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log('Error sending email:', error);
        res.status(500).json({ message: 'Error sending email', error: error.message });
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).json({ message: 'Email sent successfully!' });
      }
    });
  } catch (error) {
    console.log('Error in sending email:', error);
    res.status(500).json({ message: 'Error sending email', error: error.message });
  }
};
