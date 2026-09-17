const nodemailer = require("nodemailer");

/**
 * Build the Gmail SMTP transporter once, with explicit host/port/secure
 * so it does not depend on nodemailer's "service" shorthand which can fail.
 *
 * App Password must be the 16-character Google App Password.
 * Spaces are stripped defensively in case a password manager added them.
 */
function buildTransporter() {
    const user = (process.env.MAIL_USER         || "").trim();
    const pass = (process.env.MAIL_APP_PASSWORD || "").replace(/\s/g, "");

    if (!user || !pass) {
        console.warn("[Contact] WARNING: MAIL_USER or MAIL_APP_PASSWORD is not set in .env");
    } else {
        console.log(`[Contact] SMTP transporter configured for MAIL_USER: ${user}`);
    }

    return nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,           // use SSL (port 465)
        auth: { user, pass },
    });
}

/**
 * verifyMailTransporter — call at server startup to immediately know if
 * Gmail SMTP credentials are valid. Logs result without printing the password.
 */
async function verifyMailTransporter() {
    try {
        const t = buildTransporter();
        await t.verify();
        console.log("[Contact] transporter.verify() SUCCESS — Gmail SMTP is ready.");
        return true;
    } catch (err) {
        console.error("[Contact] transporter.verify() FAILED =>", err.message);
        return false;
    }
}

/**
 * POST /api/contact
 * Receives contact form data and sends an email to CONTACT_RECEIVER.
 * Reply-To is set to the visitor email so admin can reply directly.
 */
const sendContactMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ success: false, message: "Please fill in all fields." });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email address." });
        }

        const receiver = (process.env.CONTACT_RECEIVER || "").trim();
        const sender   = (process.env.MAIL_USER        || "").trim();

        if (!sender || !receiver) {
            console.error("[Contact] MAIL_USER or CONTACT_RECEIVER is missing from .env");
            return res.status(500).json({ success: false, message: "Email service is not configured. Please contact the admin directly." });
        }

        console.log(`[Contact] Sending message from "${name}" <${email}> to ${receiver}`);

        const transporter = buildTransporter();

        const mailOptions = {
            from:    `"SkillSync Contact" <${sender}>`,
            to:      receiver,
            replyTo: email,
            subject: `[SkillSync Contact] ${subject}`,
            text: [
                "SkillSync -- New Contact Form Message",
                "-------------------------------------",
                `Name:    ${name}`,
                `Email:   ${email}`,
                `Subject: ${subject}`,
                "",
                "Message:",
                message,
                "",
                "-------------------------------------",
                "Sent via the SkillSync landing page contact form.",
                "Reply-To is set to the sender email.",
            ].join("\n"),
            html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0f172a;color:#e2e8f0;border-radius:12px;"><h2 style="color:#a78bfa;margin-bottom:4px;">SkillSync -- Contact Form</h2><hr style="border-color:#334155;margin-bottom:20px;"><table style="width:100%;border-collapse:collapse;"><tr><td style="padding:6px 0;color:#94a3b8;width:80px;"><strong>Name</strong></td><td style="padding:6px 0;">${name}</td></tr><tr><td style="padding:6px 0;color:#94a3b8;"><strong>Email</strong></td><td style="padding:6px 0;"><a href="mailto:${email}" style="color:#60a5fa;">${email}</a></td></tr><tr><td style="padding:6px 0;color:#94a3b8;"><strong>Subject</strong></td><td style="padding:6px 0;">${subject}</td></tr></table><hr style="border-color:#334155;margin:20px 0;"><p style="color:#94a3b8;margin-bottom:8px;"><strong>Message:</strong></p><div style="background:#1e293b;border-radius:8px;padding:16px;white-space:pre-wrap;line-height:1.6;">${message}</div><hr style="border-color:#334155;margin-top:24px;"><p style="color:#475569;font-size:12px;margin-top:12px;">Sent via SkillSync landing page. Reply-To is set to the sender email.</p></div>`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`[Contact] Email sent successfully to ${receiver}`);

        return res.status(200).json({ success: true, message: "Message sent successfully! We'll get back to you soon." });

    } catch (error) {
        console.error("[Contact] sendMail ERROR =>", error.message);
        return res.status(500).json({ success: false, message: "Failed to send message. Please try again later." });
    }
};

module.exports = { sendContactMessage, verifyMailTransporter };
