import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
  },
});

transporter.verify((err) => {
  if (err) {
    console.error("❌ SMTP verify failed:", err);
  } else {
    console.log("✅ SMTP ready");
  }
});

/* ───────────────── SEND REGISTRATION EMAIL ───────────────── */
export async function sendRegistrationMail({
  to,
  name,
  event,
  category,
  bib,
}: {
  to: string;
  name: string;
  event: string;
  category: string;
  bib: string;
}) {
  try {
    await transporter.sendMail({
      from: `"FYTRR Events" <${process.env.EMAIL_USER}>`,
      to,
      subject: `🎉 Registration Confirmed – ${event}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Registration Confirmed 🎉</h2>

          <p>Hi <strong>${name}</strong>,</p>

          <p>Your payment was <strong>successful</strong>. Here are your details:</p>

          <ul>
            <li><strong>Event:</strong> ${event}</li>
            <li><strong>Category:</strong> ${category}</li>
            <li><strong>BIB Number:</strong> ${bib}</li>
          </ul>

          <p>Please keep your BIB number safe.</p>

          <p>See you at the event! 🚴‍♂️</p>

          <br />
          <small>— FYTRR Team</small>
        </div>
      `,
    });

    console.log("📧 Registration email sent to:", to);
  } catch (err) {
    console.error("❌ Failed to send registration email:", err);
    // ❗ Payment flow should NOT fail because of email
  }
}
