import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY,
  },
});

export async function sendInviteEmail(to, teamName, inviteLink) {
  const mailOptions = {
    from: 'noreply@launchpage.com',
    to,
    subject: `You've been invited to join ${teamName} on LaunchPage`,
    html: `
      <h2>You've been invited!</h2>
      <p>Click below to get started:</p>
      <a href="${inviteLink}" style="display:inline-block;padding:10px 15px;background:#2563eb;color:white;text-decoration:none;">Accept Invite</a>
    `
  };

  return transporter.sendMail(mailOptions);
}
