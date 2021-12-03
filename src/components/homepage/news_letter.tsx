export default function NewsLetter() {
  const newsletter_content = {
    title: 'Subscribe to the NewsLetter',
    description:
      'Get emails from me about web development, tech, and early access to new articles.',
    input_placeholder: 'elon@tesla.com',
    button: 'Subscribe',
  }
  return (
    <section className="pt-10 pb-16">
      <div className="flex flex-col border rounded-lg p-10 text-center mx-auto space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">{newsletter_content?.title}</h2>
          <p className="text-gray-600">{newsletter_content?.description}</p>
        </div>
        <div className="relative sm:w-96 max-w-2xl mx-auto border rounded">
          <input
            className="px-6 py-2 w-full text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-600 ring-offset-2 rounded"
            type="email"
            placeholder={newsletter_content?.input_placeholder}
            required
          />
          <button className="absolute inset-y-0 right-0 px-3 m-1 text-sm font-semibold text-gray-600 bg-gray-200 hover:bg-gray-200/80 rounded">
            {newsletter_content?.button}
          </button>
        </div>
      </div>
    </section>
  )
}
