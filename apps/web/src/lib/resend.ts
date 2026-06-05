import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

export const resend = apiKey ? new Resend(apiKey) : null;

export const resendConfig = {
  audienceId: process.env.RESEND_AUDIENCE_ID,
  fromEmail:
    process.env.RESEND_FROM_EMAIL ?? "Bhimraj Yadav <onboarding@resend.dev>",
  notifyEmail: process.env.FEEDBACK_NOTIFY_EMAIL,
};
