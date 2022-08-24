export default function NewsLetter() {
  const newsletter_content = {
    title: "Subscribe to the NewsLetter",
    description:
      "Get emails from me about web development, tech, and early access to new articles.",
    input_placeholder: "example@email.com",
    button: "Subscribe",
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
        <div className="relative mx-auto max-w-2xl rounded border dark:border-none sm:w-96">
          <input
            className="w-full rounded px-6 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-600 focus:ring-offset-2 dark:bg-gray-900 dark:focus:ring-gray-800 dark:focus:ring-offset-gray-800"
            type="email"
            placeholder={newsletter_content?.input_placeholder}
            required
          />
          <button className="absolute inset-y-0 right-0 m-1 rounded bg-gray-200 px-3 text-sm font-semibold text-gray-600 hover:bg-gray-200/80 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
            {newsletter_content?.button}
          </button>
        </div>
      </div>
    </section>
  );
}
