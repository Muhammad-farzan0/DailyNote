import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"DailyNote" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log('Email sent:', info.messageId);
    return info;
  } catch (err) {
    console.error('Email error:', err);
    throw err;
  }
};

export const sendTimerExpiredEmail = async (userEmail, cardTitle, boardId) => {
  const html = `
    <h2>Task Timer Expired</h2>
    <p>Your task <strong>${cardTitle}</strong> has exceeded its time limit.</p>
    <p>It has been moved to the <strong>Incomplete</strong> list.</p>
    <a href="${process.env.FRONTEND_URL}/board/${boardId}">View Board</a>
  `;
  await sendEmail(userEmail, 'DailyNote: Task Timer Expired', html);
};