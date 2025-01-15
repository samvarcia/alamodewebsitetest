import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp0001.neo.space',
  port: 465,
  secure: true,
  auth: {
    user: "checkin@locationalamode.com",
    pass: '@lamodecheckin3005',
  },
});

export async function sendEmail(to, subject, pdfBuffer, htmlContent) {
  try {
    const info = await transporter.sendMail({
      from: '"Location à la mode" <checkin@locationalamode.com>',
      to,
      subject,
      html: htmlContent,
      attachments: [{
        filename: 'invitation.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf'
      }]
    });
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}