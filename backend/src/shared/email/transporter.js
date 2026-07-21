import nodemailer from "nodemailer";
import config from "../../config/env.js";

const transporter = nodemailer.createTransport({
  host: config.EMAIL.smtp.host,
  port: config.EMAIL.smtp.port,
  secure: false,
  auth: {
    user: config.EMAIL.smtp.user,
    pass: config.EMAIL.smtp.pass,
  },
});

export default transporter;