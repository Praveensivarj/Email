const express = require("express");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json());

const port = process.env.PORT

if (!process.env.EMAIL || !process.env.PASS) {
  console.error("ERROR: EMAIL and PASS must be set in .env file");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

app.post("/send-mail", async (req, res) => {
  try {

    const htmlFilePath = path.join(__dirname, "templates", "email.html");
    const htmlContent = fs.readFileSync(htmlFilePath, "utf8");

    const mailOptions = {
      from: process.env.EMAIL,
      to: "alamelusivaraj3@gmail.com",
      subject: "🎉 Welcome Onboard, Gokulakrishnan! Infosys Bangalore - Joining Details Inside 🚀",
      text: "Hi, this is Praveenkumar!",
      html: htmlContent,
      attachments: [
        {
            filename: "infosyslogo.jpg",
            path: path.join(__dirname, "infosyslogo.jpg"),
            cid: "unique_image_id",
        },
    ],
    };

    const info = await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      code: 200,
      message: "Email sent successfully",
      info,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      code: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});