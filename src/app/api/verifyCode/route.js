// Temporary storage for the code and its expiration (in-memory storage for now)
let storedCode = null;
let codeExpiration = null;

export async function POST(req) {
  const { code } = await req.json(); // retrieve the code from the request body

  if (!code) {
    return new Response(
      JSON.stringify({ error: "Verification code is required" }),
      {
        status: 400,
      }
    );
  }

  // Check if the code matches and if it's expired
  if (storedCode === null || codeExpiration === null) {
    return new Response(
      JSON.stringify({ error: "No code generated or code expired" }),
      {
        status: 400,
      }
    );
  }

  // Check if the entered code matches the stored code
  if (code !== storedCode) {
    return new Response(
      JSON.stringify({ error: "Invalid verification code" }),
      {
        status: 400,
      }
    );
  }

  // Check if the code has expired (we set expiration to 10 minutes earlier)
  const currentTime = Date.now();
  if (currentTime > codeExpiration) {
    return new Response(
      JSON.stringify({ error: "Verification code has expired" }),
      {
        status: 400,
      }
    );
  }

  // If the code is correct and hasn't expired
  return new Response(
    JSON.stringify({ message: "Code verified successfully" }),
    { status: 200 }
  );
}
