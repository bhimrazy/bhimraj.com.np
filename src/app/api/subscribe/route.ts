import { headers } from "next/headers";
import { z } from "zod";

// Email validation schema
const EmailSchema = z
  .string()
  .email({ message: "Please enter a valid email address" });

export async function POST(req: Request) {
  // check for basic auth header (Next 15: headers() is async)
  const requestHeaders = await headers();
  const authorization = requestHeaders.get("authorization");
  if (!authorization || authorization.indexOf("Basic ") === -1) {
    return Response.json(
      { message: "Missing Authorization Header" },
      { status: 401 },
    );
  }
  // verify auth credentials
  if (authorization.split(" ")[1] !== process.env.API_ROUTE_SECRET) {
    return Response.json(
      { message: "Invalid Authorization Header" },
      { status: 401 },
    );
  }

  // Check for email in request body
  const { email } = await req.json();

  // 1. Validate email address
  const emailValidation = EmailSchema.safeParse(email);
  if (!emailValidation.success) {
    return Response.json(
      { error: emailValidation.error.message },
      { status: 400 },
    );
  }

  // 2. Retrieve Mailchimp credentials from environment variables
  const API_KEY = process.env.MAILCHIMP_API_KEY;
  const API_SERVER = process.env.MAILCHIMP_API_SERVER;
  const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;

  // 3. Construct Mailchimp API request URL
  const url = `https://${API_SERVER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`;

  // 4. Prepare request data
  const data = {
    email_address: emailValidation.data,
    status: "subscribed",
  };

  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `api_key ${API_KEY}`,
    },
  };

  try {
    // 5. Send request to Mailchimp API
    const res = await fetch(url, {
      method: "POST",
      headers: options.headers,
      body: JSON.stringify(data),
    });

    const response = await res.json();
    if (response?.status === "subscribed") {
      return Response.json(
        { message: "Horray 🎉! You have successfully subscribed!" },
        { status: 201 },
      );
    } else if (response?.title === "Member Exists") {
      return Response.json(
        { error: "Uh oh, it looks like this email's already subscribed🧐" },
        { status: 400 },
      );
    } else {
      return Response.json(
        { error: response?.title + " " + response?.detail },
        {
          status: response?.status === 400 ? 400 : 500,
        },
      );
    }
  } catch (error: unknown) {
    let errorMessage: string;
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = String(error);
    }
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
