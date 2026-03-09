import nodemailer from "nodemailer";

// Create a transporter - configure with real SMTP credentials in .env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "localhost",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: process.env.SMTP_USER
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    : undefined,
});

const FROM = process.env.EMAIL_FROM || "Bookizo <noreply@bookizo.ro>";

export async function sendBookingConfirmationEmail(to: string, data: {
  customerName: string;
  salonName: string;
  specialistName: string;
  serviceName: string;
  date: string;
  time: string;
  status: "CONFIRMED" | "CANCELLED";
}) {
  const subject =
    data.status === "CONFIRMED"
      ? `Programare confirmată - ${data.salonName}`
      : `Programare anulată - ${data.salonName}`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #171717; padding: 24px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Bookizo</h1>
      </div>
      <div style="padding: 32px 24px; background: #ffffff;">
        <h2 style="margin: 0 0 16px; color: #171717;">
          ${data.status === "CONFIRMED" ? "Programare confirmată!" : "Programare anulată"}
        </h2>
        <p style="color: #525252; margin: 0 0 24px;">
          Bună, ${data.customerName}!
          ${data.status === "CONFIRMED"
            ? "Programarea ta a fost confirmată de salon."
            : "Din păcate, programarea ta a fost anulată."}
        </p>
        <div style="background: #f5f5f5; border-radius: 8px; padding: 16px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #737373; font-size: 14px;">Salon:</td>
              <td style="padding: 8px 0; font-weight: 600; text-align: right;">${data.salonName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #737373; font-size: 14px;">Specialist:</td>
              <td style="padding: 8px 0; font-weight: 600; text-align: right;">${data.specialistName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #737373; font-size: 14px;">Serviciu:</td>
              <td style="padding: 8px 0; font-weight: 600; text-align: right;">${data.serviceName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #737373; font-size: 14px;">Data:</td>
              <td style="padding: 8px 0; font-weight: 600; text-align: right;">${data.date}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #737373; font-size: 14px;">Ora:</td>
              <td style="padding: 8px 0; font-weight: 600; text-align: right;">${data.time}</td>
            </tr>
          </table>
        </div>
      </div>
      <div style="padding: 16px 24px; background: #f5f5f5; text-align: center;">
        <p style="color: #a3a3a3; font-size: 12px; margin: 0;">
          &copy; ${new Date().getFullYear()} Bookizo. Programări simple pentru saloane și clienți.
        </p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: FROM,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
}

export async function sendNewBookingEmail(to: string, data: {
  customerName: string;
  serviceName: string;
  date: string;
  time: string;
}) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #171717; padding: 24px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Bookizo</h1>
      </div>
      <div style="padding: 32px 24px; background: #ffffff;">
        <h2 style="margin: 0 0 16px; color: #171717;">Programare nouă!</h2>
        <p style="color: #525252; margin: 0 0 24px;">
          <strong>${data.customerName}</strong> dorește o programare pentru <strong>${data.serviceName}</strong>
          pe <strong>${data.date}</strong> la ora <strong>${data.time}</strong>.
        </p>
        <p style="color: #525252;">
          Accesează dashboard-ul pentru a confirma sau respinge programarea.
        </p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: FROM,
      to,
      subject: `Programare nouă de la ${data.customerName}`,
      html,
    });
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
}
