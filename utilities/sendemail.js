const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
  try {
    // initialize and define the mode of transport
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    // Defining the mail and sending it using the transport
    const sentEmail = await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text,
    });
  } catch (error) {
    console.log(error.message);
    return response;
  }
};
