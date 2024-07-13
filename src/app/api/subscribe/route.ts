import mailchimp from "@mailchimp/mailchimp_marketing";
import { headers } from "next/headers";

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_API_SERVER, // e.g. us1
});
export async function POST(req: Request) {
  // check for basic auth header
  const authorization = headers().get("authorization");
  if (!authorization || authorization.indexOf("Basic ") === -1) {
    return Response.json(
      { message: "Missing Authorization Header" },
      { status: 401 }
    );
  }
  // verify auth credentials
  if (authorization.split(" ")[1] !== process.env.API_ROUTE_SECRET) {
    return Response.json(
      { message: "Invalid Authorization Header" },
      { status: 401 }
    );
  }
  // Check for email in request body
  const { email } = await req.json();

  if (!email) {
    return Response.json({ message: "Email is required" }, { status: 400 });
  }

  try {
    await mailchimp.lists.addListMember(process.env.MAILCHIMP_AUDIENCE_ID!, {
      email_address: email,
      status: "subscribed",
    });

    return Response.json({ message: "Success" });
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
