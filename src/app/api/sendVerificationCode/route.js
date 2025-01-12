import nodemailer from "nodemailer";

// Temporary storage for the code and its expiration (in-memory storage for now)
let storedCode = null;
let codeExpiration = null;

export async function POST(req) {
  const { email } = await req.json(); // retrieve the email from the request body

  if (!email) {
    return new Response(JSON.stringify({ error: "Email is required" }), {
      status: 400,
    });
  }

  // Validate email format
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    return new Response(JSON.stringify({ error: "Invalid email format" }), {
      status: 400,
    });
  }

  // Generate a 4-6 digit code
  const code = Math.floor(1000 + Math.random() * 9000); // 4-digit code

  // Set expiration for the code (10 minutes)
  const expirationTime = Date.now() + 10 * 60 * 1000; // 10 minutes from now
  storedCode = code.toString(); // Store the code
  codeExpiration = expirationTime; // Store the expiration time

  // Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "pixelstudio701@gmail.com", // your email
      pass: "xiylhxqbsjesrmzg", // your app password
    },
    tls: {
      rejectUnauthorized: false, // disable certificate validation (use with caution)
    },
  });

  try {
    await transporter.sendMail({
      from: "pixelstudio701@gmail.com",
      to: email,
      subject: "Your Verification Code",
      html: `
        <p>Use this verification code to verify your email:</p>
        <p><strong>${code}</strong></p>
        <p>It will expire in 10 minutes.</p>
      `,
    });

    return new Response(
      JSON.stringify({ message: "Verification email sent" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ error: "Failed to send email" }), {
      status: 500,
    });
  }
}
