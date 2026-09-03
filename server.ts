import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API route to send the real access approval email
app.post("/api/send-approval-email", async (req, res) => {
  const { reqId } = req.body;
  if (!reqId) {
    res.status(400).json({ error: "Missing reqId parameter." });
    return;
  }

  // Get hosting application URL
  const appUrl = process.env.APP_URL || req.headers.origin || `${req.protocol}://${req.get("host")}`;
  
  // Build target emails list (supporting both users to ensure they receive it)
  const targetEmails = ["parthakesarla@gmail.com", "murarikesarla@gmail.com"];

  // Build the approval/denial URLs
  const yesUrl = `${appUrl}/?owner_approval=yes&token=${reqId}`;
  const noUrl = `${appUrl}/?owner_approval=no&token=${reqId}`;

  // Formulate the body exactly as requested by the user
  const emailText = `Somebody is requesting for the access of the Cake Zone \nOwner Dash Board \nplease tick \n\n1.YES , IT'S ME:\n${yesUrl}\n\n2.NO , DON'T GIVE ACCESS:\n${noUrl}`;

  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #fafaf9;">
      <h2 style="color: #7c2d12; font-family: Georgia, serif; margin-bottom: 20px;">Cake Zone Security Alert</h2>
      
      <p style="font-size: 14px; color: #44403c; line-height: 1.6; white-space: pre-line;">
        Somebody is requesting for the access of the Cake Zone 
        Owner Dash Board 
        please tick 
      </p>

      <div style="margin-top: 30px;">
        <!-- Option 1: YES -->
        <div style="background-color: #ffffff; padding: 16px; border: 1px solid #d1fae5; border-radius: 8px; margin-bottom: 16px;">
          <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #065f46;">1. YES , IT'S ME</h3>
          <p style="margin: 0 0 12px 0; font-size: 12px; color: #6b7280;">Authorize this device to bypass passcode restrictions and view the dashboard.</p>
          <a href="${yesUrl}" target="_blank" style="display: inline-block; background-color: #059669; color: white; padding: 10px 20px; font-weight: bold; font-size: 12px; text-decoration: none; border-radius: 6px;">
            YES , IT'S ME
          </a>
        </div>

        <!-- Option 2: NO -->
        <div style="background-color: #ffffff; padding: 16px; border: 1px solid #fee2e2; border-radius: 8px;">
          <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #991b1b;">2. NO , DON'T GIVE ACCESS</h3>
          <p style="margin: 0 0 12px 0; font-size: 12px; color: #6b7280;">Deny and lock this console immediately.</p>
          <a href="${noUrl}" target="_blank" style="display: inline-block; background-color: #dc2626; color: white; padding: 10px 20px; font-weight: bold; font-size: 12px; text-decoration: none; border-radius: 6px;">
            NO , DON'T GIVE ACCESS
          </a>
        </div>
      </div>

      <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0 15px 0;" />
      <p style="font-size: 10px; color: #a8a29e; font-family: monospace; text-align: center;">
        Cake Zone security service • Token: ${reqId}
      </p>
    </div>
  `;

  // Check if SMTP configuration is set up
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    console.warn("SMTP_USER or SMTP_PASS is missing. Attempting zero-config delivery via FormSubmit...");
    const results = [];
    
    for (const email of targetEmails) {
      try {
        const response = await fetch(`https://formsubmit.co/ajax/${email}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            name: "Cake Zone Security Team",
            subject: "Cake Zone Owner Dashboard Access Request",
            message: emailText,
            _replyto: "no-reply@cakezone.in"
          })
        });

        if (response.ok) {
          console.log(`Real authorization email dispatched to ${email} via FormSubmit fallback.`);
          results.push({ email, success: true });
        } else {
          const errText = await response.text();
          console.error(`FormSubmit failed for ${email}:`, errText);
          results.push({ email, success: false, error: errText });
        }
      } catch (e: any) {
        console.error(`FormSubmit exception for ${email}:`, e);
        results.push({ email, success: false, error: e.message });
      }
    }

    const anySuccess = results.some(r => r.success);
    res.json({
      success: anySuccess,
      simulated: !anySuccess,
      results,
      message: anySuccess
        ? `Real security email dispatched to ${targetEmails.join(", ")} via FormSubmit. Please check your spam folder!`
        : "Security email prepared (simulated fallback due to SMTP missing and FormSubmit failing)."
    });
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    for (const email of targetEmails) {
      await transporter.sendMail({
        from: `"Cake Zone Security" <${smtpUser}>`,
        to: email,
        subject: "Cake Zone Owner Dashboard Access Request",
        text: emailText,
        html: emailHtml,
      });
      console.log(`Real authorization email dispatched to ${email} via SMTP.`);
    }

    res.json({
      success: true,
      simulated: false,
      message: `Successfully dispatched real access verification emails to: ${targetEmails.join(", ")}.`
    });
  } catch (error: any) {
    console.error("Failed to send real email via SMTP:", error);
    res.status(500).json({
      error: "Failed to dispatch email via SMTP server.",
      details: error.message
    });
  }
});

// Serve frontend assets
async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    // Explicitly serve src/assets/images directly in production from both dist (pre-built) and physical folder for absolute resilience
    app.use("/src/assets/images", express.static(path.join(distPath, "src/assets/images")));
    app.use("/src/assets/images", express.static(path.join(process.cwd(), "src/assets/images")));
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
