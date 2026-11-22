"use server";

import { redirect } from "next/navigation";
import { confirmSubscription, unsubscribe } from "@/lib/newsletter";

export async function confirmAction(formData: FormData) {
  const result = await confirmSubscription(formData.get("token"));
  redirect(`/newsletter/confirm?r=${result}`);
}

export async function unsubscribeAction(formData: FormData) {
  const result = await unsubscribe(formData.get("token"));
  redirect(`/newsletter/unsubscribe?r=${result}`);
}
