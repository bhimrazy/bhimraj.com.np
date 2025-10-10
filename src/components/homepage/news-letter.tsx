"use client";
import { Form, FormState } from "@/lib/types";
import { useState } from "react";

export default function NewsLetter() {
  const newsletter_content = {
    title: "Subscribe to the NewsLetter",
    description:
      "Get emails from me about web development, tech, and early access to new articles.",
    input_placeholder: "example@email.com",
    button: "Subscribe",
  };
  const [form, setForm] = useState<FormState>({ state: Form.Initial });
  const [email, setEmail] = useState("");

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setForm({ state: Form.Loading });
    fetch(`/api/subscribe`, {
      method: "POST",
      headers: {
        ...(process.env.NEXT_PUBLIC_API_ROUTE_SECRET
          ? {
              Authorization:
                "Basic " + process.env.NEXT_PUBLIC_API_ROUTE_SECRET,
            }
          : {}),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setEmail("");
          setForm({
            state: Form.Success,
            message: data?.message,
          });
        } else {
          // console.error(data?.error);
          setForm({
            state: Form.Error,
            message: data?.error,
          });
        }
      })
      .catch((error) => {
        console.error(error?.error);
        setForm({
          state: Form.Error,
          message: error?.error,
        });
      });
  };

  return (
    <section className="pt-10 pb-16">
      <div className="mx-auto flex flex-col space-y-6 rounded-lg border py-14 text-center dark:border-gray-900">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">
            {newsletter_content?.title}
          </h2>
          <p className="text-gray-600">{newsletter_content?.description}</p>
        </div>
        <form
          onSubmit={subscribe}
          className="relative mx-auto max-w-2xl rounded-sm border sm:w-96 dark:border-none"
        >
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email for newsletter"
            className="w-full rounded-sm px-6 py-2 text-gray-700 focus:ring-1 focus:ring-gray-600 focus:ring-offset-2 focus:outline-hidden dark:bg-gray-900 dark:focus:ring-gray-800 dark:focus:ring-offset-gray-800"
            type="email"
            autoComplete="email"
            placeholder={newsletter_content?.input_placeholder}
            required
          />

          <button
            type="submit"
            className="absolute inset-y-0 right-0 m-1 rounded-sm bg-gray-200 px-3 text-sm font-semibold text-gray-600 hover:bg-gray-200/80 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            {newsletter_content?.button}
          </button>
        </form>
        <small
          className={
            form.state === Form.Error ? "text-red-600" : "text-green-600"
          }
        >
          {form.message}
        </small>
      </div>
    </section>
  );
}
