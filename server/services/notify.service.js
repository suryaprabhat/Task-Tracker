const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendEmail = async (to, task) => {
  if (!to) {
    throw new Error("No recipient email provided");
  }

  const title = task.title;
  const deadline = task.deadline
    ? new Date(task.deadline).toLocaleString()
    : "No deadline";

  await transporter.sendMail({
    from: `Task Tracker <${process.env.EMAIL_USER}>`,
    to, // ✅ USER EMAIL
    subject: `⏰ Reminder: ${title}`,
    text: `Task: ${title}\nDeadline: ${deadline}`,
  });
};
